import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Error "mo:base/Error";

persistent actor Treasury {
  public type Transaction = {
    id : Nat;
    amount : Int;
    description : Text;
    timestamp : Int;
    from : Principal;
    to : Principal;
  };

  transient var balance : Int = 0;
  transient var transactions : [Transaction] = [];
  transient var nextTransactionId : Nat = 1;

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

  public query func getVersion() : async Text {
    return "HeliosHash DAO Treasury v1.0";
  };
}
