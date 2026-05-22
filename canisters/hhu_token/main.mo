import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Option "mo:base/Option";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Array "mo:base/Array";

/// HHU Token Canister
/// Implements ICRC-1 token standard for HHU token on Internet Computer

persistent actor HHUToken {

  // ============================================================================
  // CONSTANTS
  // ============================================================================

  private func token_name() : Text { "HeliosHash Utility Token" };
  private func token_symbol() : Text { "HHU" };
  private func token_decimals() : Nat8 { 8 };
  private func token_total_supply() : Nat { 1_000_000_000 * (10 ** 8) };

  // ============================================================================
  // TYPE DEFINITIONS
  // ============================================================================

  public type Account = {
    owner: Principal;
    subaccount: ?Blob;
  };

  public type TransferArg = {
    from_subaccount: ?Blob;
    to: Account;
    amount: Nat;
    fee: ?Nat;
    memo: ?Blob;
    created_at_time: ?Nat64;
  };

  public type Transaction = {
    kind: Text;
    from: ?Account;
    to: ?Account;
    amount: Nat;
    fee: ?Nat;
    timestamp: Time.Time;
    status: Text;
  };

  public type ApiResponse<T> = {
    #Ok : T;
    #Err : Text;
  };

  // ============================================================================
  // STATE
  // ============================================================================

  private transient var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
  private transient var allowances = HashMap.HashMap<Principal, HashMap.HashMap<Principal, Nat>>(1, Principal.equal, Principal.hash);
  private stable var transactions : [Transaction] = [];
  private stable var totalSupply : Nat = 0;
  private stable var burntSupply : Nat = 0;

  // Stable backing for the transient maps above (H2). Populated at preupgrade,
  // drained at postupgrade. Without these, balances/allowances reset on upgrade.
  private stable var balancesEntries : [(Principal, Nat)] = [];
  private stable var allowancesEntries : [(Principal, [(Principal, Nat)])] = [];
  // One-time guard: the upgrade that introduces these hooks cannot capture the
  // pre-hook transient balances (old code had no preupgrade), so on first run we
  // reconstruct them from the stable `transactions` log. true thereafter.
  private stable var migratedV2 : Bool = false;

  // Mint authority. Set once post-deploy by a canister controller via setOwner
  // (controller-gated, same model as Treasury C1). null until configured, so
  // mint is disabled until an owner is established.
  private stable var tokenOwner : ?Principal = null;

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private func _initialize() {
    // No automatic mint at init to avoid depending on canister principal during deployment.
    // Use `mint` externally to distribute initial supply when ready.
    ();
  };

  // ============================================================================
  // UPGRADE PERSISTENCE (H2)
  // ============================================================================

  system func preupgrade() {
    balancesEntries := Iter.toArray(balances.entries());
    var accs : [(Principal, [(Principal, Nat)])] = [];
    for ((owner, inner) in allowances.entries()) {
      accs := Array.append(accs, [(owner, Iter.toArray(inner.entries()))]);
    };
    allowancesEntries := accs;
  };

  system func postupgrade() {
    for ((p, amt) in balancesEntries.vals()) { balances.put(p, amt) };
    for ((owner, inner) in allowancesEntries.vals()) {
      let innerMap = HashMap.HashMap<Principal, Nat>(
        if (inner.size() == 0) 1 else inner.size(), Principal.equal, Principal.hash
      );
      for ((spender, amt) in inner.vals()) { innerMap.put(spender, amt) };
      allowances.put(owner, innerMap);
    };
    // One-time recovery of pre-hook transient balances from the tx log.
    if (not migratedV2) {
      reconstructBalancesFromLog();
      migratedV2 := true;
    };
    balancesEntries := [];
    allowancesEntries := [];
  };

  // Replay the stable transaction log to rebuild balances (mint/transfer/
  // transfer_from credit/debit; burn debit). Used once during the H2-introducing
  // upgrade; faithful because every balance-changing op appends to the log.
  private func reconstructBalancesFromLog() {
    for (tx in transactions.vals()) {
      switch (tx.kind) {
        case ("mint") { creditFromAcct(tx.to, tx.amount) };
        case ("burn") { debitFromAcct(tx.from, tx.amount) };
        case ("transfer") { debitFromAcct(tx.from, tx.amount); creditFromAcct(tx.to, tx.amount) };
        case ("transfer_from") { debitFromAcct(tx.from, tx.amount); creditFromAcct(tx.to, tx.amount) };
        case (_) {};
      };
    };
  };

  private func creditFromAcct(acct : ?Account, amt : Nat) {
    switch (acct) {
      case (?a) { balances.put(a.owner, Option.get(balances.get(a.owner), 0) + amt) };
      case null {};
    };
  };

  private func debitFromAcct(acct : ?Account, amt : Nat) {
    switch (acct) {
      case (?a) {
        let cur = Option.get(balances.get(a.owner), 0);
        balances.put(a.owner, if (cur >= amt) cur - amt else 0);
      };
      case null {};
    };
  };

  // ============================================================================
  // PUBLIC FUNCTIONS - TOKEN INFO
  // ============================================================================

  /// Get token name
  public query func name() : async Text {
    token_name()
  };

  /// Get token symbol
  public query func symbol() : async Text {
    token_symbol()
  };

  /// Get number of decimals
  public query func decimals() : async Nat8 {
    token_decimals()
  };

  /// Get total supply
  public query func total_supply() : async Nat {
    token_total_supply()
  };

  /// Get burnt tokens
  public query func burnt_supply() : async Nat {
    burntSupply
  };

  /// Get available supply (total - burnt)
  public query func available_supply() : async Nat {
    totalSupply - burntSupply
  };

  // ============================================================================
  // PUBLIC FUNCTIONS - BALANCE & ALLOWANCE
  // ============================================================================

  /// Get balance of an account
  public query func balance_of(account : Principal) : async Nat {
    Option.get(balances.get(account), 0)
  };

  /// Get balance of multiple accounts
  public query func batch_balance_of(accounts : [Principal]) : async [Nat] {
    Array.map<Principal, Nat>(
      accounts,
      func(account : Principal) : Nat {
        Option.get(balances.get(account), 0)
      }
    )
  };

  /// Get allowance for spender
  public query func allowance(owner : Principal, spender : Principal) : async Nat {
    switch (allowances.get(owner)) {
      case (?ownerAllowances) {
        Option.get(ownerAllowances.get(spender), 0)
      };
      case (null) {
        0
      };
    }
  };

  // ============================================================================
  // PUBLIC FUNCTIONS - TRANSFERS
  // ============================================================================

  /// Transfer tokens to recipient
  public shared(msg) func transfer(to : Principal, amount : Nat) : async ApiResponse<Bool> {
    let from = msg.caller;

    if (amount == 0) {
      return #Err("Amount must be greater than 0");
    };

    let fromBalance = Option.get(balances.get(from), 0);
    if (fromBalance < amount) {
      return #Err("Insufficient balance");
    };

    balances.put(from, fromBalance - amount);
    let toBalance = Option.get(balances.get(to), 0);
    balances.put(to, toBalance + amount);

    // Record transaction
    let tx : Transaction = {
      kind = "transfer";
      from = ?{ owner = from; subaccount = null };
      to = ?{ owner = to; subaccount = null };
      amount = amount;
      fee = null;
      timestamp = Time.now();
      status = "completed";
    };
    transactions := Array.append(transactions, [tx]);

    #Ok(true)
  };

  /// Transfer from one account to another (requires approval)
  public shared(msg) func transfer_from(
    from : Principal,
    to : Principal,
    amount : Nat
  ) : async ApiResponse<Bool> {
    let spender = msg.caller;

    // Check allowance
    let allowedAmount = switch (allowances.get(from)) {
      case (?ownerAllowances) {
        Option.get(ownerAllowances.get(spender), 0)
      };
      case (null) {
        0
      };
    };

    if (allowedAmount < amount) {
      return #Err("Insufficient allowance");
    };

    // Check balance
    let fromBalance = Option.get(balances.get(from), 0);
    if (fromBalance < amount) {
      return #Err("Insufficient balance");
    };

    // Transfer
    balances.put(from, fromBalance - amount);
    let toBalance = Option.get(balances.get(to), 0);
    balances.put(to, toBalance + amount);

    // Update allowance
    let ownerAllowances = switch (allowances.get(from)) {
      case (?existing) { existing };
      case (null) { HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash) };
    };
    ownerAllowances.put(spender, allowedAmount - amount);
    allowances.put(from, ownerAllowances);

    // Record transaction
    let tx : Transaction = {
      kind = "transfer_from";
      from = ?{ owner = from; subaccount = null };
      to = ?{ owner = to; subaccount = null };
      amount = amount;
      fee = null;
      timestamp = Time.now();
      status = "completed";
    };
    transactions := Array.append(transactions, [tx]);

    #Ok(true)
  };

  // ============================================================================
  // PUBLIC FUNCTIONS - APPROVAL
  // ============================================================================

  /// Approve spender to spend tokens
  public shared(msg) func approve(spender : Principal, amount : Nat) : async ApiResponse<Bool> {
    let owner = msg.caller;

    let ownerAllowances = switch (allowances.get(owner)) {
      case (?existing) { existing };
      case (null) { HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash) };
    };

    ownerAllowances.put(spender, amount);
    allowances.put(owner, ownerAllowances);

    #Ok(true)
  };

  /// Increase allowance
  public shared(msg) func increase_allowance(spender : Principal, addedValue : Nat) : async ApiResponse<Bool> {
    let owner = msg.caller;

    let currentAllowance = switch (allowances.get(owner)) {
      case (?ownerAllowances) {
        Option.get(ownerAllowances.get(spender), 0)
      };
      case (null) {
        0
      };
    };

    let newAllowance = currentAllowance + addedValue;

    let ownerAllowances = switch (allowances.get(owner)) {
      case (?existing) { existing };
      case (null) { HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash) };
    };

    ownerAllowances.put(spender, newAllowance);
    allowances.put(owner, ownerAllowances);

    #Ok(true)
  };

  /// Decrease allowance
  public shared(msg) func decrease_allowance(spender : Principal, subtractedValue : Nat) : async ApiResponse<Bool> {
    let owner = msg.caller;

    let currentAllowance = switch (allowances.get(owner)) {
      case (?ownerAllowances) {
        Option.get(ownerAllowances.get(spender), 0)
      };
      case (null) {
        0
      };
    };

    if (currentAllowance < subtractedValue) {
      return #Err("Allowance cannot be negative");
    };

    let newAllowance = currentAllowance - subtractedValue;

    let ownerAllowances = switch (allowances.get(owner)) {
      case (?existing) { existing };
      case (null) { HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash) };
    };

    ownerAllowances.put(spender, newAllowance);
    allowances.put(owner, ownerAllowances);

    #Ok(true)
  };

  // ============================================================================
  // PUBLIC FUNCTIONS - MINT & BURN
  // ============================================================================

  /// Set / rotate the mint authority. Gated on IC controller authority
  /// (ic0.is_controller): only a controller of this canister may set the owner,
  /// so there is no "first caller wins" race. Same model as Treasury C1.
  public shared ({ caller }) func setOwner(newOwner : Principal) : async ApiResponse<Bool> {
    if (not Principal.isController(caller)) {
      return #Err("only a canister controller may set the owner");
    };
    if (Principal.isAnonymous(newOwner)) {
      return #Err("owner cannot be the anonymous principal");
    };
    tokenOwner := ?newOwner;
    #Ok(true)
  };

  /// Mint new tokens (owner-gated)
  public shared(msg) func mint(to : Principal, amount : Nat) : async ApiResponse<Bool> {
    let caller = msg.caller;
    if (Principal.isAnonymous(caller)) {
      return #Err("anonymous caller not permitted");
    };
    switch (tokenOwner) {
      case (null) { return #Err("mint authority not configured"); };
      case (?o) { if (caller != o) { return #Err("caller is not the mint owner"); } };
    };

    let toBalance = Option.get(balances.get(to), 0);
    balances.put(to, toBalance + amount);
    totalSupply += amount;

    let tx : Transaction = {
      kind = "mint";
      from = null;
      to = ?{ owner = to; subaccount = null };
      amount = amount;
      fee = null;
      timestamp = Time.now();
      status = "completed";
    };
    transactions := Array.append(transactions, [tx]);

    #Ok(true)
  };

  /// Burn tokens from caller's balance
  public shared(msg) func burn(amount : Nat) : async ApiResponse<Bool> {
    let caller = msg.caller;

    let balance = Option.get(balances.get(caller), 0);
    if (balance < amount) {
      return #Err("Insufficient balance to burn");
    };

    balances.put(caller, balance - amount);
    burntSupply += amount;

    let tx : Transaction = {
      kind = "burn";
      from = ?{ owner = caller; subaccount = null };
      to = null;
      amount = amount;
      fee = null;
      timestamp = Time.now();
      status = "completed";
    };
    transactions := Array.append(transactions, [tx]);

    #Ok(true)
  };

  // ============================================================================
  // QUERY FUNCTIONS
  // ============================================================================

  /// Get transaction history (limited to last N transactions)
  public query func get_transactions(limit : Nat) : async [Transaction] {
    let transactionCount = transactions.size();
    if (transactionCount <= limit) {
      transactions
    } else {
      let start = transactionCount - limit;
      var res : [Transaction] = [];
      var i : Nat = start;
      while (i < transactionCount) {
        res := Array.append(res, [transactions[i]]);
        i += 1;
      };
      res
    }
  };

  /// Get transaction count
  public query func transaction_count() : async Nat {
    transactions.size()
  };

  /// Health check
  public query func health_check() : async {
    status: Text;
    totalSupply: Nat;
    burntSupply: Nat;
    transactions: Nat;
  } {
    {
      status = "healthy";
      totalSupply = totalSupply;
      burntSupply = burntSupply;
      transactions = transactions.size();
    }
  };
}
