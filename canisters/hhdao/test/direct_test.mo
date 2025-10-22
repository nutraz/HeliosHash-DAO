import HHDAOLib "../src/lib";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";

persistent actor DirectTest {
  public query func runAllTests() : async Text {
    Debug.print("DirectTest: starting lightweight tests...");
    try {
      let state = HHDAOLib.HHDAOState();
      let pid = state.createProposal({
        title = "DirectTest proposal";
        description = "created by direct_test.mo";
        votesRequired = 1;
        category = #Governance;
      });
      Debug.print("DirectTest created proposal id: " # Nat.toText(pid));
      return "Created proposal id: " # Nat.toText(pid);
    } catch (e) {
      Debug.print("DirectTest error (caught)");
      return "Test error";
    };
  };
};
