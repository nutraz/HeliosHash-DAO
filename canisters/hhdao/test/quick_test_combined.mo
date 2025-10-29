import Array "mo:base/Array";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

persistent actor QuickTestActor {
  // Internal helper: basic
  private func runBasicTestImpl() : Text {
    "Basic test passed - actor compiled and function called successfully"
  };

  // Internal helper: logic
  private func runLogicTestImpl() : Text {
    let testArray = [1, 2, 3, 4, 5];
    let sum = Array.foldLeft<Nat, Nat>(testArray, 0, func(acc, x) { acc + x });
    if (sum == 15) { "Logic test passed - sum is 15" } else { "Logic test failed" };
  };

  // Internal helper: principal parsing
  private func runPrincipalTestImpl() : Text {
    let _ = Principal.fromText("aaaaa-aa");
    "Principal test passed - parsing succeeded";
  };

  public query func runBasicTest() : async Text { runBasicTestImpl(); };
  public query func runLogicTest() : async Text { runLogicTestImpl(); };
  public query func runPrincipalTest() : async Text { runPrincipalTestImpl(); };
}
