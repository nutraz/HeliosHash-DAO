import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";

module {
  public type TransferArgs = {
    to: Principal.Principal;
    amount: Nat.Nat;
  };

  public type TransferResult = Result.Result<Nat.Nat, Text>;

  public persistent actor class Treasury(initOwner: Principal.Principal) {
    var owner: Principal.Principal = initOwner;
    var balance: Nat.Nat = 0;

    // Only owner can fund (for demo; later: governance calls)
    public shared(msg) func fund(amount: Nat.Nat): async () {
      if (msg.caller != owner) {
        Debug.print("Unauthorized fund attempt");
        return
      };
      balance += amount;
      Debug.print("Treasury funded: +" # Nat.toText(amount))
    };

    public shared(msg) func transfer(args: TransferArgs): async TransferResult {
      if (msg.caller != owner) {
        return #err("Only owner can transfer")
      };
      if (args.amount > balance) {
        return #err("Insufficient balance")
      };
      balance -= args.amount;
      // In prod: trigger ICP ledger transfer
      Debug.print("Transferred " # Nat.toText(args.amount) # " to recipient")
      #ok(balance)
    };

    public query func getBalance(): async Nat.Nat {
      balance
    };

    public query func getOwner(): async Principal.Principal {
      owner
    };
  }
}
