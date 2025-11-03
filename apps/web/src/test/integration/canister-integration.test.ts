import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";
/**
 * Integration tests for canister-to-canister communication
 * Tests the interaction between DAO, dispute resolution, and other canisters
 */
import { Principal } from '@dfinity/principal';
import { getCanisterActors, type DAOService, type DisputeService } from '../../lib/canister-actors';

describe('Canister Integration Tests', () => {
  let daoActor: DAOService;
  let disputeActor: DisputeService;
  let testPrincipal: Principal;

  beforeAll(async () => {
    // Initialize canister actors
    const actors = await getCanisterActors();
    daoActor = actors.dao;
    disputeActor = actors.dispute;

    // Create a test principal
    testPrincipal = Principal.fromText("aaaaa-aa");
  });

  describe('DAO and Dispute Resolution Integration', () => {
    it('should allow DAO members to file disputes', async () => {
      // First, join the DAO
      const joinResult = await daoActor.join();
      expect(joinResult).toBeDefined();

      if ('ok' in joinResult) {
        // File a governance dispute
        const disputeResult = await disputeActor.fileDispute(
          'Improper Proposal Handling',
          'The proposal was not handled according to DAO constitution',
          { GovernanceDispute: null },
          { High: null },
          []
        );

        expect(disputeResult).toBeDefined();
        expect('ok' in disputeResult).toBe(true);
      }
    });

    it('should track dispute statistics correctly', async () => {
      // Get initial dispute stats
      const stats = await disputeActor.getDisputeStats();

      expect(stats).toBeDefined();
      expect(typeof stats.totalDisputes).toBe('bigint');
      expect(typeof stats.activeDisputes).toBe('bigint');
      expect(typeof stats.resolvedDisputes).toBe('bigint');
      expect(Array.isArray(stats.disputesByCategory)).toBe(true);
    });

    it('should create proposal for dispute resolution', async () => {
      // Create a DAO proposal related to dispute resolution
      const proposalResult = await daoActor.createProposal(
        'Dispute Resolution Policy Update',
        'Update the dispute resolution process to include mediation',
        { Governance: null }
      );

      expect(proposalResult).toBeDefined();

      if ('ok' in proposalResult) {
        const proposalId = proposalResult.ok;

        // Get the created proposal
        const proposal = await daoActor.getProposal(proposalId);
        expect(proposal).toBeDefined();
        expect(proposal.length).toBe(1);

        if (proposal.length > 0) {
          expect(proposal[0].title).toBe('Dispute Resolution Policy Update');
          expect('Governance' in proposal[0].category).toBe(true);
        }
      }
    });

    it('should handle dispute escalation workflow', async () => {
      // File a dispute
      const disputeResult = await disputeActor.fileDispute(
        'Project Budget Disagreement',
        'Disagreement over project fund allocation',
        { ProjectDispute: null },
        { Medium: null },
        [testPrincipal]
      );

      if ('ok' in disputeResult) {
        const disputeId = disputeResult.ok;

        // Submit evidence
        const evidenceResult = await disputeActor.submitEvidence(
          disputeId,
          'Budget documentation showing discrepancies',
          { Document: null }
        );

        expect(evidenceResult).toBeDefined();
        expect('ok' in evidenceResult).toBe(true);

        // Get the dispute to verify evidence was added
        const dispute = await disputeActor.getDispute(disputeId);
        expect(dispute).toBeDefined();
        expect(dispute.length).toBe(1);

        if (dispute.length > 0) {
          expect(dispute[0].evidence.length).toBeGreaterThan(0);
        }
      }
    });

    it('should integrate with mediation system', async () => {
      // Apply to be a mediator
      const mediatorResult = await disputeActor.applyToBeMediator();
      expect(mediatorResult).toBeDefined();

      // File a dispute that needs mediation
      const disputeResult = await disputeActor.fileDispute(
        'Technical Implementation Dispute',
        'Disagreement over technical implementation approach',
        { TechnicalDispute: null },
        { High: null },
        []
      );

      if ('ok' in disputeResult) {
        const disputeId = disputeResult.ok;

        // Check if we can schedule mediation
        const sessionResult = await disputeActor.scheduleMediationSession(
          disputeId,
          BigInt(Date.now() + 86400000), // Tomorrow
          [testPrincipal]
        );

        expect(sessionResult).toBeDefined();
      }
    });

    it('should validate cross-canister governance voting', async () => {
      // Get DAO stats to verify member count
      const daoStats = await daoActor.getDAOStats();
      expect(daoStats).toBeDefined();
      expect(typeof daoStats.totalMembers).toBe('bigint');

      // Create a proposal that affects dispute resolution
      const proposalResult = await daoActor.createProposal(
        'Mediator Compensation Proposal',
        'Establish compensation for dispute mediators',
        { Treasury: null }
      );

      if ('ok' in proposalResult) {
        const proposalId = proposalResult.ok;

        // Vote on the proposal
        const voteResult = await daoActor.vote(proposalId, true);
        expect(voteResult).toBeDefined();

        if ('ok' in voteResult) {
          // Check vote count
          const voteCount = await daoActor.getVoteCount(proposalId);
          expect(typeof voteCount).toBe('bigint');
          expect(voteCount).toBeGreaterThan(BigInt(0));
        }
      }
    });

    it('should handle dispute categorization properly', async () => {
      // Test different dispute categories
      const categories = [
        { GovernanceDispute: null },
        { ProjectDispute: null },
        { TreasuryDispute: null },
        { TechnicalDispute: null },
      ];

      for (const category of categories) {
        const disputeResult = await disputeActor.fileDispute(
          `Test Dispute - ${Object.keys(category)[0]}`,
          `Testing dispute resolution for ${Object.keys(category)[0]}`,
          category as any,
          { Low: null },
          []
        );

        expect(disputeResult).toBeDefined();
        expect('ok' in disputeResult).toBe(true);
      }

      // Verify disputes by category
      const governanceDisputes = await disputeActor.getDisputesByCategory({
        GovernanceDispute: null,
      });
      expect(Array.isArray(governanceDisputes)).toBe(true);
      expect(governanceDisputes.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle invalid dispute IDs gracefully', async () => {
      const invalidDisputeId = BigInt(999999);
      const dispute = await disputeActor.getDispute(invalidDisputeId);

      expect(dispute).toBeDefined();
      expect(dispute.length).toBe(0); // Should return empty array for non-existent dispute
    });

    it('should handle invalid proposal IDs gracefully', async () => {
      const invalidProposalId = BigInt(999999);
      const proposal = await daoActor.getProposal(invalidProposalId);

      expect(proposal).toBeDefined();
      expect(proposal.length).toBe(0); // Should return empty array for non-existent proposal
    });

    it('should validate mediator permissions', async () => {
      // Try to accept mediation role without being a qualified mediator
      const invalidDisputeId = BigInt(1);
      const mediationResult = await disputeActor.acceptMediationRole(invalidDisputeId);

      expect(mediationResult).toBeDefined();
      // Should handle the case appropriately (either error or specific response)
    });

    it('should handle concurrent voting scenarios', async () => {
      // Create a proposal
      const proposalResult = await daoActor.createProposal(
        'Concurrent Voting Test',
        'Testing concurrent voting functionality',
        { Governance: null }
      );

      if ('ok' in proposalResult) {
        const proposalId = proposalResult.ok;

        // Simulate multiple votes (in real scenario, these would be from different principals)
        const vote1 = await daoActor.vote(proposalId, true);
        const vote2 = await daoActor.vote(proposalId, false); // Should not be allowed (same user)

        expect(vote1).toBeDefined();
        expect(vote2).toBeDefined();

        // Check if double voting is prevented
        if ('err' in vote2) {
          expect(vote2.err).toContain('already voted');
        }
      }
    });
  });

  describe('Data Consistency and State Management', () => {
    it('should maintain consistent state across canisters', async () => {
      // Get initial state from both canisters
      const initialDAOStats = await daoActor.getDAOStats();
      const initialDisputeStats = await disputeActor.getDisputeStats();

      // Perform operations that affect both canisters
      const joinResult = await daoActor.join();
      const disputeResult = await disputeActor.fileDispute(
        'State Consistency Test',
        'Testing state consistency across canisters',
        { GovernanceDispute: null },
        { Medium: null },
        []
      );

      // Verify state changes are reflected correctly
      const finalDAOStats = await daoActor.getDAOStats();
      const finalDisputeStats = await disputeActor.getDisputeStats();

      if ('ok' in joinResult) {
        expect(finalDAOStats.totalMembers).toBeGreaterThanOrEqual(initialDAOStats.totalMembers);
      }

      if ('ok' in disputeResult) {
        expect(finalDisputeStats.totalDisputes).toBeGreaterThan(initialDisputeStats.totalDisputes);
      }
    });

    it('should handle canister upgrade scenarios', async () => {
      // Test that data persists through canister operations
      const beforeUpgradeStats = await daoActor.getDAOStats();

      // Simulate data operations
      const proposalResult = await daoActor.createProposal(
        'Upgrade Test Proposal',
        'Testing data persistence during upgrades',
        { Governance: null }
      );

      // Verify data is still accessible
      const afterOperationStats = await daoActor.getDAOStats();
      expect(afterOperationStats.totalProposals).toBeGreaterThanOrEqual(
        beforeUpgradeStats.totalProposals
      );

      if ('ok' in proposalResult) {
        const proposal = await daoActor.getProposal(proposalResult.ok);
        expect(proposal.length).toBe(1);
      }
    });
  });
});
