import Prim "mo:prim";

actor TokenRewards {
  // Example: Reward structure
  type Reward = {
    id: Nat;
    recipient: Principal;
    amount: Nat;
    reason: Text;
  };

  stable var rewards: [Reward] = [];

  public func grantReward(recipient: Principal, amount: Nat, reason: Text): async Nat {
    let id = rewards.size();
    let reward = { id; recipient; amount; reason };
    rewards := Array.append(rewards, [reward]);
    id
  };

  public query func getRewards(): async [Reward] {
    rewards
  };
}
