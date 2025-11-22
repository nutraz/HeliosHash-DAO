import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Error "mo:base/Error";

actor Treasury {
  public type Transaction = {
    id : Nat;
    amount : Int;
    description : Text;
    timestamp : Int;
    from : Principal;
    to : Principal;
  };

  // Stable variables for upgrade persistence
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
    if (amount <= 0) {
      throw Error.reject("Deposit amount must be positive");
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
    
    return transaction.id;
  };

  public shared ({ caller }) func withdraw(amount : Int, to : Principal, description : Text) : async Bool {
    if (amount <= 0) {
      return false;
    };
    
    if (balance < amount) {
      return false;
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
    
    return true;
  };

  public query func getVersion() : async Text {
    return "HeliosHash DAO Treasury v1.0";
  };

  // Optional: Add a function to get canister info
  public query func getCanisterInfo() : async { balance : Int; transactionCount : Nat } {
    {
      balance = balance;
      transactionCount = transactions.size();
    }
  };
}
