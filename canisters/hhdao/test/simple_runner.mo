import HHDAOLib "../src/lib";
import Debug "mo:base/Debug";
import Nat "mo:base/Nat";

persistent actor SimpleTestRunner {
  public query func run() : async Text {
    Debug.print("SimpleTestRunner: starting lightweight runtime test...");
    try {
      let state = HHDAOLib.HHDAOState();
      let pid = state.createProposal({
        title = "Simple runner test";
        description = "created by simple_runner.mo";
        votesRequired = 1;
        category = #Governance;
      });
      Debug.print("Created proposal id: " # Nat.toText(pid));
      return "Created proposal id: " # Nat.toText(pid);
    } catch (e) {
      Debug.print("SimpleTestRunner error (caught)");
      return "Test error";
    };
  };
};
