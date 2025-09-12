
import Debug "mo:base/Debug";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Time "mo:base/Time";

module {
  // Custom assertion functions with better error messages
  public func assertTrue(condition : Bool, message : Text) : () {
    if (not condition) {
      Debug.print("❌ Assertion failed: " # message);
      assert false;
    } else {
      Debug.print("✅ Assertion passed: " # message);
    };
  };

  public func assertEquals<T>(actual : T, expected : T, message : Text) : () {
    if (actual != expected) {
      Debug.print("❌ Assertion failed: " # message # ". Expected: " # debug_show(expected) # ", Actual: " # debug_show(actual));
      assert false;
    } else {
      Debug.print("✅ Assertion passed: " # message);
    };
  };

  public func assertArrayEquals<T>(actual : [T], expected : [T], message : Text) : () {
    if (Array.size(actual) != Array.size(expected)) {
      Debug.print("❌ Assertion failed: " # message # ". Array sizes differ. Expected: " # debug_show(Array.size(expected)) # ", Actual: " # debug_show(Array.size(actual)));
      assert false;
    };
    
    for (i in Iter.range(0, Array.size(expected) - 1)) {
      if (actual[i] != expected[i]) {
        Debug.print("❌ Assertion failed: " # message # ". Arrays differ at index " # debug_show(i) # ". Expected: " # debug_show(expected[i]) # ", Actual: " # debug_show(actual[i]));
        assert false;
      };
    };
    
    Debug.print("✅ Assertion passed: " # message);
  };

  public func assertError<T, E>(result : Result.Result<T, E>, expectedError : E, message : Text) : () {
    switch (result) {
      case (#err(err)) {
        if (err != expectedError) {
          Debug.print("❌ Assertion failed: " # message # ". Expected error: " # debug_show(expectedError) # ", Actual error: " # debug_show(err));
          assert false;
        } else {
          Debug.print("✅ Assertion passed: " # message);
        };
      };
      case (#ok(_)) {
        Debug.print("❌ Assertion failed: " # message # ". Expected error but got success");
        assert false;
      };
    };
  };

  public func printTestHeader(testName : Text) : () {
    Debug.print("\n🧪 === Running Test: " # testName # " ===");
  };

  public func printTestResult(testName : Text, passed : Bool) : () {
    let status = if (passed) "✅ PASSED" else "❌ FAILED";
    Debug.print("🏁 === Test: " # testName # " - " # status # " ===\n");
  };

  // Helper for async tests
  public func asyncTest(testName : Text, testFunc : () -> async Bool) : async () {
    printTestHeader(testName);
    let result = await testFunc();
    printTestResult(testName, result);
  };

  // Mock principal for testing
  public let mockPrincipal : Principal = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");
  
  // Mock time for testing
  public func mockTime() : Int {
    1672531200000000000; // January 1, 2023 00:00:00 UTC
  };
}
