import List "mo:base/List";
import Result "mo:base/Result";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

shared ({ caller = initializer }) actor class Treasury(init_args : {}) = this {
  type Operation = {
    #Transfer : { to : Principal; amount : Nat };
    #Approve : { spender : Principal; amount : Nat };
  };

  type Transaction = {
    operation : Operation;
    timestamp : Int;
    caller : Principal;
  };

  private stable var balance : Nat = 0;
  private stable var owner : Principal = initializer;
  private var transactions : List.List<Transaction> = List.nil();
  private var approvals = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);

  public shared ({ caller }) func get_balance() : async Nat {
    assert Principal.isAnonymous(caller) == false;
    balance;
  };

  public shared ({ caller }) func transfer(to : Principal, amount : Nat) : async Result.Result<(), Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous calls not allowed");
    };
    if (amount > balance) {
      return #err("Insufficient balance");
    };
    balance -= amount;
    let transaction : Transaction = {
      operation = #Transfer({ to; amount });
      timestamp = 0;
      caller;
    };
    transactions := List.push(transaction, transactions);
    #ok(());
  };

  public shared ({ caller }) func get_transactions() : async [Transaction] {
    assert Principal.isAnonymous(caller) == false;
    List.toArray(transactions);
  };

  public shared ({ caller }) func fund() : async Result.Result<(), Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous calls not allowed");
    };
    balance += 1000;
    #ok(());
  };

  public shared ({ caller }) func approve(spender : Principal, amount : Nat) : async Result.Result<(), Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous calls not allowed");
    };
    if (amount > balance) {
      return #err("Insufficient balance");
    };
    approvals.put(spender, amount);
    #ok(());
  };

  public shared ({ caller }) func transfer_from(from : Principal, to : Principal, amount : Nat) : async Result.Result<(), Text> {
    if (Principal.isAnonymous(caller)) {
      return #err("Anonymous calls not allowed");
    };
    switch (approvals.get(from)) {
      case (?approved_amount) {
        if (approved_amount >= amount) {
          balance -= amount;
          approvals.put(from, approved_amount - amount);
          #ok(());
        } else {
          #err("Amount exceeds approved limit");
        };
      };
      case null {
        #err("No approval found for spender");
      };
    };
  };
};
