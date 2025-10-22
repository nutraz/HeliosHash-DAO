import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";

module QuickTest {
  // Simple test function that can be called directly
  public func runBasicTest() : Text {
    "Basic test passed - module compiled and function called successfully"
  };

  // Test with some simple logic
  public func runLogicTest() : Text {
    let testArray = [1, 2, 3, 4, 5];
    let sum = Array.foldLeft<Nat, Nat>(testArray, 0, func(acc, x) { acc + x });
    
    if (sum == 15) {
      return "Logic test passed - sum is 15";
    } else {
  return "Logic test failed - expected 15, got " # Nat.toText(sum);
    };
  };

  // Test principal parsing
  public func runPrincipalTest() : Text {
    let _ = Principal.fromText("aaaaa-aa");
    "Principal test passed - parsing succeeded"
  };
};
