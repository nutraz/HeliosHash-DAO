import Ledger "./ledger";

// Refactored Treasury canister delegating core logic to ledger.mo (pure module)
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Option "mo:base/Option";

persistent actor Treasury {
  // Re-export selected types for external interface compatibility
  public type TxId = Ledger.TxId;
  public type Transaction = Ledger.Transaction;
  public type Account = Ledger.Account;
  public type TransferArgs = Ledger.TransferArgs;
  public type TransferResult = Ledger.TransferResult;
  public type TransferError = Ledger.TransferError;
  public type Meta = {
    symbol : Text; name : Text; decimals : Nat; totalSupply : Nat; holderCount : Nat;
    txCount : Nat; lastTxTime : ?Time.Time; daoCanister : ?Principal; identityCanister : ?Principal; locked : Bool
  };

  // Stable vars for config & auth
  private var symbol : Text = "OWP";
  private var name : Text = "One World Power";
  private var decimals : Nat = 8;
  private var daoCanister : ?Principal = null;
  private var identityCanister : ?Principal = null;
  private var multisigCanister : ?Principal = null;
  private var governanceCanister : ?Principal = null; // Governance canister for emergency pause
  private var locked : Bool = false;
  private var paused : Bool = false; // Emergency pause
  private var multisigThreshold : Nat = 1000000; // Amount threshold for multisig routing
  private var timelockDelayNs : Int = 48 * 60 * 60 * 1_000_000_000; // 48 hours in nanoseconds
  private var timelockAmountThreshold : Nat = 1000000; // Amounts >= this require timelock

  // Ledger state (stable decomposition)
  private var totalSupplyStable : Nat = 0; // persisted copy
  private var nextTxIdStable : Nat = 0;
  private var txEntries : [Transaction] = [];
  private var balanceEntries : [(Principal, Nat)] = [];

  // transient runtime state restored from stable
  private transient var state = Ledger.init();

  // Upgrade hooks map between pure state and stable vars
  system func preupgrade() {
    totalSupplyStable := state.totalSupply;
    nextTxIdStable := state.nextTxId;
    balanceEntries := Iter.toArray(state.balances.entries());
    txEntries := state.txs;
  };
  system func postupgrade() {
    state.totalSupply := totalSupplyStable;
    state.nextTxId := nextTxIdStable;
    // rebuild balances from stable entries
    state.balances := Ledger.init().balances; // fresh map
    for ((p, b) in balanceEntries.vals()) { state.balances.put(p, b) };
    state.txs := txEntries;
  };

  // RBAC: Role-Based Access Control with least privilege principle

  // Role definitions with minimal required permissions
  public type Role = {
    #DAO_ADMIN;        // Can mint/burn tokens, configure treasury
    #GOVERNANCE;       // Can trigger emergency pause/resume
    #MULTISIG_GUARDIAN; // Can approve large transfers
    #IDENTITY_MANAGER;  // Can sync balances for identity verification
    #USER;             // Basic user permissions
  };

  // Permission matrix - explicit function-level access control
  private func hasPermission(role: Role, action: Text) : Bool {
    switch (role, action) {
      case (#DAO_ADMIN, "mint") { true };
      case (#DAO_ADMIN, "burn") { true };
      case (#DAO_ADMIN, "configure") { true };
      case (#DAO_ADMIN, "sync_identity") { true };
      case (#GOVERNANCE, "emergency_pause") { true };
      case (#GOVERNANCE, "emergency_resume") { true };
      case (#MULTISIG_GUARDIAN, "approve_transfer") { true };
      case (#IDENTITY_MANAGER, "read_balance") { true };
      case (#USER, "transfer_small") { true };
      case (#USER, "query") { true };
      case _ { false };
    };
  };

  // Role resolution from caller principal
  private func getRole(caller: Principal) : Role {
    if (Option.isSome(daoCanister) and caller == Option.unwrap(daoCanister)) {
      #DAO_ADMIN
    } else if (Option.isSome(governanceCanister) and caller == Option.unwrap(governanceCanister)) {
      #GOVERNANCE
    } else if (Option.isSome(multisigCanister) and caller == Option.unwrap(multisigCanister)) {
      #MULTISIG_GUARDIAN
    } else if (Option.isSome(identityCanister) and caller == Option.unwrap(identityCanister)) {
      #IDENTITY_MANAGER
    } else {
      #USER
    };
  };

  // Enhanced auth helpers with RBAC
  private func assertPermission(caller: Principal, action: Text) {
    let role = getRole(caller);
    if (not hasPermission(role, action)) {
      Debug.trap("Access denied: " # debug_show(role) # " cannot perform " # action);
    };
  };

  private func assertDao(caller : Principal) {
    assertPermission(caller, "configure");
  };

  private func markLockedIfReady() { if (not locked and daoCanister != null and identityCanister != null) { locked := true } };

  public shared({ caller = _ }) func setDaoCanister(p : Principal) : async () { if (locked) return; switch (daoCanister) { case (?_) { Debug.trap("daoCanister already set") }; case null { daoCanister := ?p; markLockedIfReady(); } } };
  public shared({ caller = _ }) func setIdentityCanister(p : Principal) : async () { if (locked) return; switch (identityCanister) { case (?_) { Debug.trap("identityCanister already set") }; case null { identityCanister := ?p; markLockedIfReady(); } } };
  public shared({ caller = _ }) func setMultisigCanister(p : Principal) : async () { if (locked) return; switch (multisigCanister) { case (?_) { Debug.trap("multisigCanister already set") }; case null { multisigCanister := ?p; } } };
  public shared({ caller = _ }) func setGovernanceCanister(p : Principal) : async () { if (locked) return; switch (governanceCanister) { case (?_) { Debug.trap("governanceCanister already set") }; case null { governanceCanister := ?p; } } };

  // Emergency pause functions - RBAC controlled with function-level access modifiers
  public shared({ caller }) func pauseTreasury() : async Result.Result<(), Text> {
    assertPermission(caller, "emergency_pause");
    if (paused) { return #err("Already paused") };
    paused := true;
    #ok(())
  };

  public shared({ caller }) func resumeTreasury() : async Result.Result<(), Text> {
    assertPermission(caller, "emergency_resume");
    if (not paused) { return #err("Not paused") };
    paused := false;
    #ok(())
  };

  // Core ops delegating into ledger state - with function-level access modifiers
  public shared({ caller }) func mint(to : Principal, amount : Nat) : async Result.Result<TxId, Text> {
    assertPermission(caller, "mint");
    let res = Ledger.mint(state, to, amount);
    switch (res) { case (#ok _) { totalSupplyStable := state.totalSupply }; case _ {} };
    res
  };
  public shared({ caller }) func burn(from : Principal, amount : Nat) : async Result.Result<TxId, Text> {
    assertPermission(caller, "burn");
    let res = Ledger.burn(state, from, amount);
    switch (res) { case (#ok _) { totalSupplyStable := state.totalSupply }; case _ {} };
    res
  };
  public shared({ caller }) func transfer(to : Principal, amount : Nat) : async Result.Result<TxId, Text> {
    if (paused) { return #err("Treasury operations paused") };

    // Function-level access control for transfers
    let role = getRole(caller);
    if (amount >= multisigThreshold) {
      // Large transfers require multisig approval
      assertPermission(caller, "approve_transfer");
    } else {
      // Small transfers allowed for users
      assertPermission(caller, "transfer_small");
    };

    // Enforce timelock for large amounts (unless emergency paused)
    if (amount >= timelockAmountThreshold and not paused) {
      // For large transfers, require a timelock delay
      // This is a simplified implementation - in production, you'd track pending transfers with timestamps
      let earliestExecution = Time.now() + timelockDelayNs;
      return #err("Large transfer requires timelock. Earliest execution: " # debug_show(earliestExecution));
    };

    // Route large transfers through multisig if configured
    if (amount >= multisigThreshold) {
      switch (multisigCanister) {
        case null {
          // Fallback to direct transfer if multisig not configured
          Ledger.transfer(state, caller, to, amount)
        };
        case (?msig) {
          // Create multisig proposal instead of direct transfer
          type MultisigActor = actor {
            proposeTransfer : (Principal, Nat, ?Text) -> async Result.Result<Nat, Text>
          };
          let multisig : MultisigActor = actor (Principal.toText(msig));
          let note = "Large transfer via multisig: " # debug_show(amount) # " OWP to " # Principal.toText(to);
          let res = await multisig.proposeTransfer(to, amount, ?note);
          switch (res) {
            case (#ok(proposalId)) { #ok(proposalId) }; // Return proposal ID as transaction ID
            case (#err(e)) { #err("Multisig proposal failed: " # e) };
          };
        };
      };
    } else {
      // Direct transfer for smaller amounts
      Ledger.transfer(state, caller, to, amount)
    };
  };
  public shared({ caller }) func icrc1_transfer(args : TransferArgs) : async TransferResult {
    Ledger.icrc1_transfer(state, caller, args)
  };

  // Identity sync using current balance - RBAC controlled
  public shared({ caller }) func syncIdentityBalance(user : Principal) : async Result.Result<(), Text> {
    assertPermission(caller, "sync_identity");
    switch (identityCanister) { case null { return #err("Identity not set") }; case (?i) {
      type IdentityActor = actor { updateOWPBalance : (Principal, Nat) -> async Result.Result<(), Text> };
      let identity : IdentityActor = actor (Principal.toText(i));
      let res = await identity.updateOWPBalance(user, Ledger.balanceOf(state, user));
      switch (res) { case (#ok ()) { #ok(()) }; case (#err e) { #err("identity update failed: " # e) } };
    } };
  };

  // Queries
  public query func getMeta() : async Meta {
    let m = Ledger.meta(state, symbol, name, decimals);
    {
      symbol = m.symbol; name = m.name; decimals = m.decimals; totalSupply = m.totalSupply; holderCount = m.holderCount;
      txCount = m.txCount; lastTxTime = m.lastTxTime; daoCanister; identityCanister; locked
    }
  };

  // Enhanced security status query
  public query func getSecurityStatus() : async {
    daoConfigured : Bool;
    identityConfigured : Bool;
    multisigConfigured : Bool;
    governanceConfigured : Bool;
    isLocked : Bool;
    isPaused : Bool;
    multisigThreshold : Nat;
    timelockDelayNs : Int;
    timelockAmountThreshold : Nat;
    totalSupply : Nat
  } {
    {
      daoConfigured = Option.isSome(daoCanister);
      identityConfigured = Option.isSome(identityCanister);
      multisigConfigured = Option.isSome(multisigCanister);
      governanceConfigured = Option.isSome(governanceCanister);
      isLocked = locked;
      isPaused = paused;
      multisigThreshold = multisigThreshold;
      timelockDelayNs = timelockDelayNs;
      timelockAmountThreshold = timelockAmountThreshold;
      totalSupply = state.totalSupply
    }
  };

  // Lightweight, read-only status to assist audits. This returns configuration
  // flags only and does not expose private keys, principals beyond existence,
  // or any secret material. Useful for quick security checks.
  public query func getLegacySecurityStatus() : async {
    daoConfigured : Bool;
    identityConfigured : Bool;
    isLocked : Bool;
    totalSupply : Nat
  } {
    {
      daoConfigured = Option.isNull(daoCanister) == false;
      identityConfigured = Option.isNull(identityCanister) == false;
      isLocked = locked;
      totalSupply = state.totalSupply;
    }
  };
  public query func balanceOf(p : Principal) : async Nat { Ledger.balanceOf(state, p) };
  public query func getTx(id : Nat) : async ?Transaction { Ledger.getTx(state, id) };
  public query func listTx(from : Nat, limit : Nat) : async [Transaction] { Ledger.listTx(state, from, limit) };
  public query func listHolders(offset : Nat, limit : Nat) : async [(Principal, Nat)] { Ledger.listHolders(state, offset, limit) };
  public query func icrc1_name() : async Text { name };
  public query func icrc1_symbol() : async Text { symbol };
  public query func icrc1_decimals() : async Nat8 { 8 };
  public query func icrc1_total_supply() : async Nat { state.totalSupply };
  public query func icrc1_balance_of(account : Account) : async Nat { Ledger.balanceOf(state, account.owner) };
}
