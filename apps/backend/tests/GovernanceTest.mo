import Test "mo:test";
import Governance "../canisters/governance/Governance";

Test.describe("Governance Canister", func {
  let gov = Governance.Governance();

  Test.it("should create proposal", func {
    let result = await gov.createProposal({ title = "Test Proposal"; description = "Should pass" });
    Test.expect(result).toBe(#ok(_))
  });

  Test.it("should list proposals", func {
    let proposals = await gov.getProposals();
    Test.expect(Array.size(proposals)).toBe(1)
  });
});
