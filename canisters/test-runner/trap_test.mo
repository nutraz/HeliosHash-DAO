import Debug "mo:base/Debug";

persistent actor TrapTest {
  public query func trapMe() : async Int {
    Debug.trap("hello-from-motoko");
    return 0;
  };
};
