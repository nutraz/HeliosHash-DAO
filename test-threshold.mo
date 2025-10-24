// Test Canister - Verify 60% Threshold Logic  


persistent actor TestDAO {
  
  type TestProposal = {
    votesFor: Nat;
    votesAgainst: Nat;
  };

  // Test the exact same logic as main DAO
  private func meetsApprovalThreshold(proposal: TestProposal, totalMembers: Nat) : Bool {
    if (totalMembers == 0) return false;
    let threshold = (totalMembers * 60) / 100; // ≥60%
    proposal.votesFor >= threshold
  };

  // Test various scenarios
  public query func testThresholds() : async [(Nat, Nat, Bool, Text)] {
    [
      // (members, votesFor, expected, description)
      (5, 3, meetsApprovalThreshold({votesFor=3; votesAgainst=1}, 5), "3/5 = 60% - should pass"),
      (5, 2, meetsApprovalThreshold({votesFor=2; votesAgainst=2}, 5), "2/5 = 40% - should fail"), 
      (5, 4, meetsApprovalThreshold({votesFor=4; votesAgainst=1}, 5), "4/5 = 80% - should pass"),
      (10, 6, meetsApprovalThreshold({votesFor=6; votesAgainst=4}, 10), "6/10 = 60% - should pass"),
      (10, 5, meetsApprovalThreshold({votesFor=5; votesAgainst=5}, 10), "5/10 = 50% - should fail"),
      (3, 2, meetsApprovalThreshold({votesFor=2; votesAgainst=1}, 3), "2/3 = 66.7% - should pass"),
      (100, 60, meetsApprovalThreshold({votesFor=60; votesAgainst=40}, 100), "60/100 = 60% - should pass"),
      (100, 59, meetsApprovalThreshold({votesFor=59; votesAgainst=41}, 100), "59/100 = 59% - should fail"),
    ]
  };

  // Calculate exact threshold for any member count
  public query func calculateThreshold(members: Nat) : async (Nat, Text) {
    let threshold = (members * 60) / 100;
    (threshold, "Need " # Nat.toText(threshold) # " votes for 60% of " # Nat.toText(members) # " members")
  };
}