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

  // Initialize owner placeholder. Real minting should be done via `mint` call.
  // Use a stable textual placeholder to avoid runtime traps during init.
  private transient var owner : Principal = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  private func _initialize() {
    // No automatic mint at init to avoid depending on canister principal during deployment.
    // Use `mint` externally to distribute initial supply when ready.
    ();
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

  /// Mint new tokens (admin only - simplified)
  public shared(msg) func mint(to : Principal, amount : Nat) : async ApiResponse<Bool> {
    // In production, check caller is authorized minter
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
