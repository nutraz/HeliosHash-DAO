import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";

persistent actor TokenRewards {

  /********************************************
   * TYPE DEFINITIONS
   ********************************************/
  public type Reward = {
    id: Nat;
    recipient: Principal;
    amount: Nat;
    reason: Text;
  };

  /********************************************
   * STATE
   ********************************************/
  stable var rewards : [Reward] = [];

  /********************************************
   * METHODS
   ********************************************/

  // Create a new reward entry
  public func grantReward(
    recipient: Principal,
    amount: Nat,
    reason: Text
  ) : async Nat {

    let id = Array.size<Reward>(rewards);
    let newReward : Reward = { id; recipient; amount; reason };

    rewards := Array.append<Reward>(rewards, [newReward]);

    return id;
  };

  // Read-only: fetch all rewards
  public query func getRewards() : async [Reward] {
    return rewards;
  };
}

