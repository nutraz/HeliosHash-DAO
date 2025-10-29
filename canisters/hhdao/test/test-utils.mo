


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

  public func assertEqualsNat(actual : Nat, expected : Nat, message : Text) : () {
    if (actual != expected) {
      Debug.print("❌ Assertion failed: " # message # ". Expected: " # Nat.toText(expected) # ", Actual: " # Nat.toText(actual));
      assert false;
    } else {
      Debug.print("✅ Assertion passed: " # message);
    };
  };
  
  public func assertEqualsText(actual : Text, expected : Text, message : Text) : () {
    if (actual != expected) {
      Debug.print("❌ Assertion failed: " # message # ". Expected: " # expected # ", Actual: " # actual);
      assert false;
    } else {
      Debug.print("✅ Assertion passed: " # message);
    };
  };

  public func assertArraySizeEquals(actual : [Any], expected : [Any], message : Text) : () {
    if (Array.size(actual) != Array.size(expected)) {
      Debug.print("❌ Assertion failed: " # message # ". Array sizes differ. Expected: " # Nat.toText(Array.size(expected)) # ", Actual: " # Nat.toText(Array.size(actual)));
      assert false;
    } else {
      Debug.print("✅ Assertion passed: " # message);
    };
  };

  public func assertResultIsOk(result : Result.Result<Any, Text>, message : Text) : () {
    switch (result) {
      case (#ok(_)) {
        Debug.print("✅ Assertion passed: " # message);
      };
      case (#err(error)) {
        Debug.print("❌ Assertion failed: " # message # ". Error: " # error);
        assert false;
      };
    };
  };

  public func assertResultIsError(result : Result.Result<Any, Text>, message : Text) : () {
    switch (result) {
      case (#err(err)) {
        Debug.print("✅ Assertion passed: " # message # ". Got expected error: " # err);
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
  public func mockPrincipal() : Principal {
    Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai")
  };
  
  // Mock time for testing
  public func mockTime() : Int {
    1672531200000000000; // January 1, 2023 00:00:00 UTC
  };
}
