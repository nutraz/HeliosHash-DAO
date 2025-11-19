import HHDAOLib "../src/lib";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";

module SimpleTestRunner {
  public func run() : Text {
    Debug.print("SimpleTestRunner: starting lightweight runtime test...");
    let state = HHDAOLib.HHDAOState();
    let pid = state.createProposal({
      title = "Simple runner test";
      description = "created by simple_runner.mo";
      votesRequired = 1;
      category = #Governance;
    });
    Debug.print("Created proposal id: " # Nat.toText(pid));
    return "Created proposal id: " # Nat.toText(pid);
  };
};
