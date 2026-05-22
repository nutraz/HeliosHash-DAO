import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Int "mo:base/Int";

persistent actor Treasury {
  public type Transaction = {
    id : Nat;
    amount : Int;
    description : Text;
    timestamp : Int;
    from : Principal;
    to : Principal;
  };

  var balance : Int = 0;
  var transactions : [Transaction] = [];
  var nextTransactionId : Nat = 1;
  var owner : ?Principal = null;

  public query func getBalance() : async Int {
    return balance;
  };

  public query func getTransactions() : async [Transaction] {
    return transactions;
  };

  public shared ({ caller }) func deposit(amount : Int, description : Text) : async Text {
    if (amount <= 0) {
      return "Error: Deposit amount must be positive";
    };
    
    balance += amount;
    
    let transaction : Transaction = {
      id = nextTransactionId;
      amount = amount;
      description = description;
      timestamp = Time.now();
      from = caller;
      to = Principal.fromActor(Treasury);
    };
    
    transactions := Array.append(transactions, [transaction]);
    nextTransactionId += 1;
    
    return "Deposit successful! New balance: " # Int.toText(balance);
  };

  public shared ({ caller }) func withdraw(amount : Int, to : Principal, description : Text) : async Text {
    if (Principal.isAnonymous(caller)) {
      return "Error: anonymous caller not permitted";
    };

    switch (owner) {
      case (null) { return "Error: treasury owner not configured"; };
      case (?o) {
        if (caller != o) {
          return "Error: caller is not the treasury owner";
        };
      };
    };

    if (amount <= 0) {
      return "Error: Withdrawal amount must be positive";
    };

    if (balance < amount) {
      return "Error: Insufficient balance";
    };

    balance -= amount;
    
    let transaction : Transaction = {
      id = nextTransactionId;
      amount = -amount;
      description = description;
      timestamp = Time.now();
      from = Principal.fromActor(Treasury);
      to = to;
    };
    
    transactions := Array.append(transactions, [transaction]);
    nextTransactionId += 1;
    
    return "Withdrawal successful! New balance: " # Int.toText(balance);
  };

  // Bootstrap and rotate the treasury owner. Gated on IC controller authority
  // (ic0.is_controller): only a controller of this canister may set the owner,
  // so there is no "first caller wins" race. The configured owner is the only
  // principal permitted to withdraw.
  public shared ({ caller }) func setOwner(newOwner : Principal) : async Text {
    if (not Principal.isController(caller)) {
      return "Error: only a canister controller may set the owner";
    };
    if (Principal.isAnonymous(newOwner)) {
      return "Error: owner cannot be the anonymous principal";
    };
    owner := ?newOwner;
    return "Owner set";
  };

  public query func getVersion() : async Text {
    return "HeliosHash DAO Treasury v1.0";
  };
}
