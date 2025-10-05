import Ledger "./ledger.mo";

// Refactored Treasury canister delegating core logic to ledger.mo (pure module)



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
  private var locked : Bool = false;

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

  // Auth helpers
  private func assertDao(caller : Principal) {
    switch (daoCanister) { case null { Debug.trap("DAO not set") }; case (?d) { if (d != caller) Debug.trap("Unauthorized (dao)"); } };
  };
  private func markLockedIfReady() { if (not locked and daoCanister != null and identityCanister != null) { locked := true } };

  public shared({ caller = _ }) func setDaoCanister(p : Principal) : async () { if (locked) return; switch (daoCanister) { case (?_) { Debug.trap("daoCanister already set") }; case null { daoCanister := ?p; markLockedIfReady(); } } };
  public shared({ caller = _ }) func setIdentityCanister(p : Principal) : async () { if (locked) return; switch (identityCanister) { case (?_) { Debug.trap("identityCanister already set") }; case null { identityCanister := ?p; markLockedIfReady(); } } };

  // Core ops delegating into ledger state
  public shared({ caller }) func mint(to : Principal, amount : Nat) : async Result.Result<TxId, Text> {
    assertDao(caller);
    let res = Ledger.mint(state, to, amount);
    switch (res) { case (#ok _) { totalSupplyStable := state.totalSupply }; case _ {} };
    res
  };
  public shared({ caller }) func burn(from : Principal, amount : Nat) : async Result.Result<TxId, Text> {
    assertDao(caller);
    let res = Ledger.burn(state, from, amount);
    switch (res) { case (#ok _) { totalSupplyStable := state.totalSupply }; case _ {} };
    res
  };
  public shared({ caller }) func transfer(to : Principal, amount : Nat) : async Result.Result<TxId, Text> {
    Ledger.transfer(state, caller, to, amount)
  };
  public shared({ caller }) func icrc1_transfer(args : TransferArgs) : async TransferResult {
    Ledger.icrc1_transfer(state, caller, args)
  };

  // Identity sync using current balance
  public shared({ caller }) func syncIdentityBalance(user : Principal) : async Result.Result<(), Text> {
    switch (daoCanister) { case null { return #err("DAO not set") }; case (?d) { if (d != caller) return #err("Unauthorized"); } };
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
