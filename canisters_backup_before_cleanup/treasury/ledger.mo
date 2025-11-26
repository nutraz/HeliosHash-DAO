// Pure ledger logic module for OWP token
// Decimals: 8
// Minimal module used by treasury canister

import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";

module {
  public type TxId = Nat;
  public type Amount = Nat;
  public type TxKind = { #Mint; #Transfer; #Burn };
  public type Transaction = {
    id : TxId;
    kind : TxKind;
    from : ?Principal;
    to : ?Principal;
    amount : Amount;
    timestamp : Time.Time;
  };

  public type Account = { owner : Principal; subaccount : ?Blob };
  public type TransferArgs = {
    from_subaccount : ?Blob;
    to : Account;
    amount : Nat;
    fee : ?Nat;
    memo : ?Blob;
    created_at_time : ?Nat; // simplified
  };
  public type TransferError = {
    #BadFee : { expected_fee : Nat };
    #BadBurn : { min_burn_amount : Nat };
    #InsufficientFunds : { balance : Nat };
    #TooOld : { allowed_window_nanos : Nat };
    #CreatedInFuture : { ledger_time : Nat };
    #Duplicate : { duplicate_of : Nat };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  };
  public type TransferResult = { #Ok : Nat; #Err : TransferError };

  public type Meta = {
    symbol : Text;
    name : Text;
    decimals : Nat;
    totalSupply : Nat;
    holderCount : Nat;
    txCount : Nat;
    lastTxTime : ?Time.Time;
  };

  public type LedgerState = {
    var totalSupply : Nat;
    var nextTxId : Nat;
    var balances : HashMap.HashMap<Principal, Nat>;
    var txs : [Transaction];
  };

  public func init() : LedgerState {
    {
      var totalSupply = 0;
      var nextTxId = 0;
      var balances = HashMap.HashMap<Principal, Nat>(50, Principal.equal, Principal.hash);
      var txs = [];
    }
  };

  func addBalance(s : LedgerState, p : Principal, amt : Nat) {
    let cur = switch (s.balances.get(p)) { case (?b) b; case null 0; };
    s.balances.put(p, cur + amt);
  };
  func subBalance(s : LedgerState, p : Principal, amt : Nat) : Result.Result<(), Text> {
    switch (s.balances.get(p)) {
      case null { #err("No balance") };
      case (?b) { if (b < amt) #err("Insufficient balance") else { s.balances.put(p, b - amt); #ok(()) } };
    }
  };
  func recordTx(s : LedgerState, tx : Transaction) { s.txs := Array.append<Transaction>(s.txs, [tx]); };

  public func mint(s : LedgerState, to : Principal, amt : Nat) : Result.Result<TxId, Text> {
    if (Principal.isAnonymous(to)) return #err("Cannot mint to anonymous");
    if (amt == 0) return #err("Zero amount");
    addBalance(s, to, amt);
    s.totalSupply += amt;
    let tx : Transaction = { id = s.nextTxId; kind = #Mint; from = null; to = ?to; amount = amt; timestamp = Time.now() };
    recordTx(s, tx);
    s.nextTxId += 1;
    #ok(tx.id)
  };

  public func burn(s : LedgerState, from : Principal, amt : Nat) : Result.Result<TxId, Text> {
    if (amt == 0) return #err("Zero amount");
    switch (subBalance(s, from, amt)) { case (#err e) return #err(e); case (#ok ()) {}; };
    s.totalSupply -= amt;
    let tx : Transaction = { id = s.nextTxId; kind = #Burn; from = ?from; to = null; amount = amt; timestamp = Time.now() };
    recordTx(s, tx);
    s.nextTxId += 1;
    #ok(tx.id)
  };

  public func transfer(s : LedgerState, caller : Principal, to : Principal, amt : Nat) : Result.Result<TxId, Text> {
    if (amt == 0) return #err("Zero amount");
    if (Principal.isAnonymous(to)) return #err("Invalid recipient");
    if (caller == to) return #err("Self-transfer not needed");
    switch (subBalance(s, caller, amt)) { case (#err e) return #err(e); case (#ok ()) {}; };
    addBalance(s, to, amt);
    let tx : Transaction = { id = s.nextTxId; kind = #Transfer; from = ?caller; to = ?to; amount = amt; timestamp = Time.now() };
    recordTx(s, tx);
    s.nextTxId += 1;
    #ok(tx.id)
  };

  public func icrc1_transfer(s : LedgerState, caller : Principal, args : TransferArgs) : TransferResult {
    if (args.amount == 0) return #Err(#GenericError({ error_code = 0; message = "amount must be > 0" }));
    switch (args.fee) { case (?_) return #Err(#BadFee({ expected_fee = 0 })); case null {}; };
    if (Principal.isAnonymous(args.to.owner)) return #Err(#GenericError({ error_code = 1; message = "recipient anonymous" }));
    switch (subBalance(s, caller, args.amount)) {
      case (#err _) return #Err(#InsufficientFunds({ balance = switch (s.balances.get(caller)) { case null 0; case (?b) b } }));
      case (#ok ()) {};
    };
    addBalance(s, args.to.owner, args.amount);
    let tx : Transaction = { id = s.nextTxId; kind = #Transfer; from = ?caller; to = ?args.to.owner; amount = args.amount; timestamp = Time.now() };
    recordTx(s, tx);
    s.nextTxId += 1;
    #Ok(tx.id)
  };

  public func balanceOf(s : LedgerState, p : Principal) : Nat { switch (s.balances.get(p)) { case null 0; case (?b) b } };
  public func meta(s : LedgerState, symbol : Text, name : Text, decimals : Nat) : Meta {
    {
      symbol; name; decimals; totalSupply = s.totalSupply;
      holderCount = Iter.toArray(s.balances.entries()).size();
      txCount = s.txs.size();
      lastTxTime = if (s.txs.size() == 0) null else ?s.txs[s.txs.size() - 1].timestamp;
    }
  };

  public func getTx(s : LedgerState, id : Nat) : ?Transaction { if (id >= s.txs.size()) null else ?s.txs[id] };
  public func listTx(s : LedgerState, from : Nat, limit : Nat) : [Transaction] {
    if (from >= s.txs.size()) return [];
    let upper = Nat.min(s.txs.size(), from + limit);
    Array.tabulate<Transaction>(upper - from, func(i : Nat) : Transaction { s.txs[from + i] })
  };
  public func listHolders(s : LedgerState, offset : Nat, limit : Nat) : [(Principal, Nat)] {
    let entries = Iter.toArray(s.balances.entries());
    if (offset >= entries.size()) return [];
    let upper = Nat.min(entries.size(), offset + limit);
    Array.tabulate<(Principal, Nat)>(upper - offset, func(i : Nat) { entries[offset + i] })
  };
}
