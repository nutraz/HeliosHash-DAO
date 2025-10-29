
import Debug "mo:base/Debug";
import Result "mo:base/Result";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import TestUtils "../test/test-utils";
import HHDAOLib "../src/lib";

import Time "mo:base/Time";



let TimeUtils = object {
  public func measureTime<T>(f : () -> T) : (T, Int) {
    let start = Time.now();
    let result = f();
    let end = Time.now();
    (result, end - start)
  }
};

actor {

  public func runTests() : async () {
    let state = HHDAOLib.HHDAOState();

    // Test 1: Proposal Creation
    TestUtils.printTestHeader("Proposal Creation");
    try {
      let proposalId = state.createProposal({
        title = "Test Proposal";
        description = "A test proposal for unit testing";
        votesRequired = 100;
        category = #Governance;
      });
      TestUtils.assertTrue(proposalId > 0, "Proposal ID should be greater than 0");
      TestUtils.printTestResult("Proposal Creation", true);
    } catch (e) {
      Debug.print("Error in Proposal Creation test: " # debug_show(e));
      TestUtils.printTestResult("Proposal Creation", false);
    };

    // Test 2: Voting Mechanism
    TestUtils.printTestHeader("Voting Mechanism");
    try {
      let proposalId = state.createProposal({
        title = "Voting Test Proposal";
        description = "Testing the voting mechanism";
        votesRequired = 5;
        category = #Governance;
      });
      let voteResult1 = state.vote(proposalId, true);
      let voteResult2 = state.vote(proposalId, false);
      TestUtils.assertTrue(voteResult1, "First vote should succeed");
      TestUtils.assertTrue(voteResult2, "Second vote should succeed");
      let proposal = state.getProposal(proposalId);
      switch (proposal) {
        case (?prop) {
          TestUtils.assertTrue(prop.votesFor >= 1, "Should have at least one vote in favor");
          TestUtils.assertTrue(prop.votesAgainst >= 1, "Should have at least one vote against");
          TestUtils.printTestResult("Voting Mechanism", true);
        };
        case (null) {
          Debug.print("Error: Proposal not found");
          TestUtils.printTestResult("Voting Mechanism", false);
        };
      };
    } catch (e) {
      Debug.print("Error in Voting Mechanism test: " # debug_show(e));
      TestUtils.printTestResult("Voting Mechanism", false);
    };

    // Test 3: NFT Membership Minting
    TestUtils.printTestHeader("NFT Membership Minting");
    try {
      let mintResult = state.mintMembershipNFT({
        recipient = TestUtils.mockPrincipal;
        tier = #Community;
        durationDays = 365;
      });
      switch (mintResult) {
        case (#ok(tokenId)) {
          TestUtils.assertTrue(tokenId > 0, "Token ID should be greater than 0");
          let tokenInfo = state.getNFTInfo(tokenId);
          switch (tokenInfo) {
            case (?info) {
              TestUtils.assertEquals(info.owner, TestUtils.mockPrincipal, "Token owner should match");
              TestUtils.printTestResult("NFT Membership Minting", true);
            };
            case (null) {
              Debug.print("Error: Token info not found");
              TestUtils.printTestResult("NFT Membership Minting", false);
            };
          };
        };
        case (#err(err)) {
          Debug.print("Error minting NFT: " # debug_show(err));
          TestUtils.printTestResult("NFT Membership Minting", false);
        };
      };
    } catch (e) {
      Debug.print("Error in NFT Membership Minting test: " # debug_show(e));
      TestUtils.printTestResult("NFT Membership Minting", false);
    };

    // Test 4: Performance Test
    TestUtils.printTestHeader("Performance Test");
    try {
      let (result, time) = measureTime<Nat>(func() : Nat {
        var sum = 0;
        for (i in Iter.range(1, 1000)) {
          sum += i;
        };
        sum
      });
      Debug.print("Computation result: " # debug_show(result));
      Debug.print("Execution time: " # debug_show(time) # " nanoseconds");
      TestUtils.assertTrue(time < 1000000000, "Execution should be under 1 second");
      TestUtils.printTestResult("Performance Test", true);
    } catch (e) {
      Debug.print("Error in Performance Test: " # debug_show(e));
      TestUtils.printTestResult("Performance Test", false);
    };
  };
}
