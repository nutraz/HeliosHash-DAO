import Prim "mo:prim";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";

module {
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
  };

  public func convictionVotes(tokens: Nat, timeHeld: Int): Nat {
    // Simple conviction: tokens * sqrt(timeHeld)
    var timeHeldNat : Nat = if (timeHeld < 0) 1 else Nat32.toNat(Nat32.fromIntWrap(timeHeld));
    var x : Nat = Nat.max(1, timeHeldNat);
    var y : Nat = (x + 1) / 2;
    var z : Nat = x;
    while (y < z) {
      z := y;
      y := (x / y + y) / 2;
    };
    tokens * z
  };
}
