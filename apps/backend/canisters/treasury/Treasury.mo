import Array "mo:base/Array";
import Principal "mo:base/Principal";

persistent actor Treasury {
  public type Transaction = {
    id : Nat;
    amount : Int;
    description : Text;
    timestamp : Int;
    from : Principal;
    to : Principal;
  };

  stable var balance : Int = 0;
  stable var transactions : [Transaction] = [];
  stable var nextTransactionId : Nat = 1;

  public query func getBalance() : async Int {
    return balance;
  };

  public query func getTransactions() : async [Transaction] {
    return transactions;
  };

  public shared ({ caller }) func deposit(amount : Int, description : Text) : async Nat {
    balance += amount;
    
    let transaction : Transaction = {
      id = nextTransactionId;
      amount = amount;
      description = description;
      timestamp = 0; // Would use Time.now() in production
      from = caller;
      to = caller; // Treasury receives from caller
    };
    
    transactions := Array.append(transactions, [transaction]);
    nextTransactionId += 1;
    
    return transaction.id;
  };

  public shared ({ caller }) func withdraw(amount : Int, to : Principal, description : Text) : async Bool {
    if (balance >= amount) {
      balance -= amount;
      
      let transaction : Transaction = {
        id = nextTransactionId;
        amount = -amount;
        description = description;
        timestamp = 0;
        from = caller; // Treasury sends to recipient
        to = to;
      };
      
      transactions := Array.append(transactions, [transaction]);
      nextTransactionId += 1;
      
      return true;
    };
    
    return false;
  };

  public query func getVersion() : async Text {
    return "HeliosHash DAO Treasury v1.0";
  };
}
