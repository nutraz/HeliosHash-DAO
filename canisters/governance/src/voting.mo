import Prim "mo:prim";
import Time "mo:base/Time";

module Voting {
  public type VotingMethod = {
    #Quadratic;
    #Conviction;
  };

  public type Delegation = {
    delegator: Principal;
    delegatee: Principal;
  };

  public func quadraticVotes(tokens: Nat): Nat {
    // Integer sqrt for quadratic voting
    var x = tokens;
    var y = (x + 1) / 2;
    var z = x;
    while (y < z) {
      z := y;
      y := (x / y + y) / 2;
    };
    z
  }

  public func convictionVotes(tokens: Nat, timeHeld: Int): Nat {
    // Simple conviction: tokens * sqrt(timeHeld)
    var x = timeHeld;
    var y = (x + 1) / 2;
    var z = x;
    while (y < z) {
      z := y;
      y := (x / y + y) / 2;
    };
    tokens * z
  }
}
