import Debug "mo:base/Debug";
import TestUtils "../src/test-utils";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import AuthLib "../src/lib";

actor {
  public func run() : async () {
    TestUtils.printTestHeader("AuthLib - Basic registerInternetIdentity");

    let p = TestUtils.mockPrincipal();

    let res = AuthLib.registerInternetIdentity(p);
    TestUtils.assertResultIsOk(res, "register should succeed for non-anonymous principal");

    switch (res) {
      case (#ok(profile)) {
        Debug.print("Profile created, tier: " # Nat.toText(Nat.fromInt(0))); // just debug
        TestUtils.assertTrue(AuthLib.isKYCAdvanced(profile), "registered user should be KYC Advanced");
      };
      case (#err(e)) { Debug.print("Unexpected error: " # e); assert false; };
    };
  };
}
