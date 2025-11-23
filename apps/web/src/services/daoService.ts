// === HHDAO Service Layer ===
// Connects React frontend to Internet Computer DAO canister
// Handles governance: proposals, voting, membership

import { HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
// Note: AuthClient import removed - will use basic identity for now
import { createActor, canisterId as generatedCanisterId } from '../declarations/hhdao_dao';
import type {
  _SERVICE,
  ContributionType,
  Member,
  ProposalId,
} from '../declarations/hhdao_dao/hhdao_dao.did.d.ts';
import { resolveCanisterId } from '../lib/canisterIds';

// Helper function to map canister data to proposal with location
function mapToProposalWithLocation(canisterProposal: any): Proposal {
  // Convert category to type string
  let typeStr = 'Other';
  if (canisterProposal.category && typeof canisterProposal.category === 'object') {
    const categoryKeys = Object.keys(canisterProposal.category);
    if (categoryKeys.length > 0) {
      const key = categoryKeys[0];
      typeStr = key === 'Other' ? canisterProposal.category[key] : key;
    }
  }

  // Convert status variant to string
  let statusStr: 'Active' | 'Passed' | 'Rejected' | 'Expired' = 'Active';
  if (canisterProposal.status && typeof canisterProposal.status === 'object') {
    const statusKeys = Object.keys(canisterProposal.status);
    if (statusKeys.length > 0) {
      statusStr = statusKeys[0] as 'Active' | 'Passed' | 'Rejected' | 'Expired';
    }
  }

  return {
    id: canisterProposal.id.toString(),
    title: canisterProposal.title,
    description: canisterProposal.description,
    proposer: canisterProposal.proposer.toString(),
    createdAt: new Date(Number(canisterProposal.createdAt) / 1_000_000), // Convert nanoseconds to milliseconds
    votesFor: Number(canisterProposal.votesFor),
    votesAgainst: Number(canisterProposal.votesAgainst),
    finalized: canisterProposal.finalized,
    approved: canisterProposal.approved,
    status: statusStr,
    votingDeadline: new Date(Number(canisterProposal.votingDeadline) / 1_000_000),
    type: typeStr,
    location: canisterProposal.location
      ? {
          latitude: canisterProposal.location.latitude,
          longitude: canisterProposal.location.longitude,
          address: canisterProposal.location.address,
        }
      : undefined,
  };
}

// Extended Proposal type with location for frontend
export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  createdAt: Date;
  votesFor: number;
  votesAgainst: number;
  finalized: boolean;
  approved: boolean;
  status: 'Active' | 'Passed' | 'Rejected' | 'Expired';
  votingDeadline: Date;
  type: string;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}
export class HHDAOError extends Error {
  constructor(
    message: string,
    public cause?: string
  ) {
    super(message);
    this.name = 'HHDAOError';
  }
}

export interface CreateProposalRequest {
  title: string;
  description: string;
  category: ContributionType;
}

export interface ProposalStats {
  totalProposals: number;
  activeProposals: number;
  approvedProposals: number;
  participationRate: number;
}

export interface MembershipInfo {
  isMember: boolean;
  memberCount: number;
  currentMember?: Member;
  contributionScore: number;
}

// Re-export types from the canister declarations
export type {
  ContributionType,
  Member,
  MemberId,
  ProposalId,
} from '../declarations/hhdao_dao/hhdao_dao.did.d.ts';

export class HHDAOService {
  private actor: any = null;
  private mockMode: boolean = false;

  /**
   * Initialize the HHDAO service
   * Must be called before using other methods
   */
  async initialize(): Promise<void> {
    try {
      await this.setupActor();
    } catch (error) {
      console.warn(
        '[HHDAOService] Failed to initialize canister connection, falling back to mock mode:',
        error
      );
      this.mockMode = true;
    }
  }

  private async setupActor(): Promise<void> {
    const resolvedId = resolveCanisterId('HHDAO_DAO', generatedCanisterId);
    if (!resolvedId) {
      throw new Error('No canister ID resolved for HHDAO_DAO');
    }
    const agent = new HttpAgent({
      host: process.env.DFX_NETWORK === 'local' ? 'http://127.0.0.1:4943' : 'https://ic0.app',
    });
    if (process.env.DFX_NETWORK === 'local') {
      try {
        await agent.fetchRootKey();
      } catch (e) {
        console.warn('[HHDAOService] fetchRootKey failed', e);
      }
    }
    this.actor = createActor(resolvedId, { agent });

    // Test the connection by calling a simple method
    try {
      await this.actor.getMemberCount();
    } catch (error) {
      this.actor = null;
      throw new Error(`Canister connection test failed: ${error}`);
    }
  }

  private getActor(): any {
    if (!this.actor && !this.mockMode) {
      throw new HHDAOError(
        'Service not initialized (no actor). Ensure CANISTER_ID_HHDAO_DAO is set and call initialize().'
      );
    }
    return this.actor!;
  }

  private isMockMode(): boolean {
    return this.mockMode || !this.actor;
  }

  // Helper to map canister proposals to frontend proposals with location data

  private getMockProposals(): Proposal[] {
    const now = BigInt(Date.now() * 1_000_000); // Convert to nanoseconds
    const oneDay = BigInt(24 * 60 * 60 * 1_000_000_000);

    return [
      mapToProposalWithLocation({
        id: BigInt(1),
        title: 'Install Solar Panels in Urgam Valley',
        description:
          'Proposal to install 50kW solar panel system in Urgam Valley to provide clean energy to 100 households.',
        proposer: Principal.fromText('2vxsx-fae'),
        createdAt: now - oneDay * BigInt(2),
        votesFor: BigInt(15),
        votesAgainst: BigInt(3),
        finalized: false,
        approved: false,
        status: { Active: null },
        votingDeadline: now + oneDay * BigInt(5),
        category: { Other: 'Solar Infrastructure' },
        location: {
          latitude: 27.0238,
          longitude: 74.2179,
          address: 'Urgam Valley, Rajasthan, India',
        },
      }),
      mapToProposalWithLocation({
        id: BigInt(2),
        title: 'Community Training Program',
        description:
          'Establish a training program for local technicians to maintain solar installations.',
        proposer: Principal.fromText('rdmx6-jaaaa-aaaaa-aaadq-cai'),
        createdAt: now - oneDay * BigInt(5),
        votesFor: BigInt(22),
        votesAgainst: BigInt(1),
        finalized: true,
        approved: true,
        status: { Passed: null },
        votingDeadline: now + oneDay * BigInt(2),
        category: { Teaching: null },
        location: {
          latitude: 26.9124,
          longitude: 75.7873,
          address: 'Jaipur, Rajasthan, India',
        },
      }),
      mapToProposalWithLocation({
        id: BigInt(3),
        title: 'Battery Storage Expansion',
        description:
          'Add lithium battery storage to existing solar installations for 24/7 power availability.',
        proposer: Principal.fromText('ryjl3-tyaaa-aaaaa-aaaba-cai'),
        createdAt: now - oneDay * BigInt(1),
        votesFor: BigInt(8),
        votesAgainst: BigInt(2),
        finalized: false,
        approved: false,
        status: { Active: null },
        votingDeadline: now + oneDay * BigInt(6),
        category: { PanelMaintenance: null },
        location: {
          latitude: 27.4924,
          longitude: 77.6737,
          address: 'Bharatpur, Rajasthan, India',
        },
      }),
    ];
  }

  // === Membership Functions ===

  /**
   * Join the DAO as a new member
   * Each member gets equal voting power (1 vote)
   */
  async joinDAO(): Promise<void> {
    try {
      const actor = this.getActor();
      await actor.join();
    } catch (error) {
      throw new HHDAOError(
        'Failed to join DAO',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Get current user's membership information
   * Note: For now returns basic info, will add identity integration later
   */
  async getMembershipInfo(): Promise<MembershipInfo> {
    if (this.isMockMode()) {
      return {
        isMember: false,
        memberCount: 42, // Mock member count
        currentMember: undefined,
        contributionScore: 0,
      };
    }

    try {
      const actor = this.getActor();
      const memberCount = await actor.getMemberCount();

      // TODO: Add proper identity management
      // For now, assume user is not authenticated
      return {
        isMember: false,
        memberCount: Number(memberCount),
        currentMember: undefined,
        contributionScore: 0,
      };
    } catch (error) {
      console.warn('[HHDAOService] getMembershipInfo failed, falling back to mock:', error);
      return {
        isMember: false,
        memberCount: 42, // Mock fallback
        currentMember: undefined,
        contributionScore: 0,
      };
    }
  }

  /**
   * Get all DAO members (admin function)
   */
  async getAllMembers(): Promise<Member[]> {
    try {
      const actor = this.getActor();
      return await actor.getAllMembers();
    } catch (error) {
      throw new HHDAOError(
        'Failed to get members',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  // === Proposal Functions ===

  /**
   * Create a new proposal
   * Requires membership in the DAO
   */
  async createProposal(request: CreateProposalRequest): Promise<ProposalId> {
    try {
      const actor = this.getActor();

      if (!request.title.trim()) {
        throw new HHDAOError('Proposal title cannot be empty');
      }
      if (!request.description.trim()) {
        throw new HHDAOError('Proposal description cannot be empty');
      }

      const proposalId = await actor.createProposal(
        request.title.trim(),
        request.description.trim(),
        request.category
      );

      return proposalId;
    } catch (error) {
      throw new HHDAOError(
        'Failed to create proposal',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Get all proposals in the DAO
   */
  async getAllProposals(): Promise<Proposal[]> {
    if (this.isMockMode()) {
      // Return mock proposals when canister is unavailable
      return this.getMockProposals();
    }

    try {
      const actor = this.getActor();
      const canisterProposals = await actor.getAllProposals();

      // Map canister proposals to service proposal format
      const mappedProposals = canisterProposals.map(mapToProposalWithLocation);

      // Sort by creation time (newest first)
      return mappedProposals.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.warn('[HHDAOService] Canister call failed, falling back to mock data:', error);
      return this.getMockProposals();
    }
  }

  /**
   * Get a specific proposal by ID
   */
  async getProposal(proposalId: ProposalId): Promise<Proposal | null> {
    try {
      const actor = this.getActor();
      const result = await actor.getProposal(proposalId);
      if (result.length > 0 && result[0]) {
        return mapToProposalWithLocation(result[0]);
      }
      return null;
    } catch (error) {
      throw new HHDAOError(
        'Failed to get proposal',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  // === Voting Functions ===

  /**
   * Vote on a proposal
   * @param proposalId - ID of the proposal to vote on
   * @param approve - true to vote YES, false to vote NO
   */
  async vote(proposalId: ProposalId, approve: boolean): Promise<void> {
    try {
      const actor = this.getActor();
      await actor.vote(proposalId, approve);
    } catch (error) {
      throw new HHDAOError(
        'Failed to submit vote',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Check if current user has voted on a proposal
   * TODO: Add identity integration
   */
  async hasVoted(proposalId: ProposalId): Promise<boolean> {
    try {
      // TODO: Add proper identity management
      // For now, assume user hasn't voted
      return false;
    } catch (error) {
      throw new HHDAOError(
        'Failed to check vote status',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Get vote counts for a proposal
   */
  async getVoteCount(
    proposalId: ProposalId
  ): Promise<{ votesFor: number; votesAgainst: number } | null> {
    try {
      const actor = this.getActor();
      const result = await actor.getVoteCount(proposalId);

      if (result.length === 0) {
        return null;
      }

      const [votesFor, votesAgainst] = result[0];
      return {
        votesFor: Number(votesFor),
        votesAgainst: Number(votesAgainst),
      };
    } catch (error) {
      throw new HHDAOError(
        'Failed to get vote count',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  // === Admin Functions ===

  /**
   * Finalize a proposal (admin only)
   * Calculates if proposal meets 60% approval threshold
   */
  async finalizeProposal(proposalId: ProposalId): Promise<void> {
    try {
      const actor = this.getActor();
      await actor.finalizeProposal(proposalId);
    } catch (error) {
      throw new HHDAOError(
        'Failed to finalize proposal',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Get the current approval threshold (should be 60% of total members)
   */
  async getApprovalThreshold(): Promise<number> {
    try {
      const actor = this.getActor();
      const threshold = await actor.getApprovalThreshold();
      return Number(threshold);
    } catch (error) {
      throw new HHDAOError(
        'Failed to get approval threshold',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  // === Statistics Functions ===

  /**
   * Get comprehensive proposal statistics
   */
  async getProposalStats(): Promise<ProposalStats> {
    try {
      const [proposals, memberCount] = await Promise.all([
        this.getAllProposals(),
        this.getMembershipInfo(),
      ]);

      const totalProposals = proposals.length;
      const activeProposals = proposals.filter((p) => !p.finalized).length;
      const approvedProposals = proposals.filter((p) => p.approved).length;

      // Calculate participation rate from latest proposals
      let totalVotes = 0;
      let possibleVotes = 0;

      proposals.slice(0, 5).forEach((proposal) => {
        // Last 5 proposals
        const votes = Number(proposal.votesFor) + Number(proposal.votesAgainst);
        totalVotes += votes;
        possibleVotes += memberCount.memberCount;
      });

      const participationRate = possibleVotes > 0 ? (totalVotes / possibleVotes) * 100 : 0;

      return {
        totalProposals,
        activeProposals,
        approvedProposals,
        participationRate: Math.round(participationRate),
      };
    } catch (error) {
      throw new HHDAOError(
        'Failed to get proposal stats',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  // === Utility Functions ===

  /**
   * Format contribution type for display
   */
  static formatContributionType(type: ContributionType): string {
    if ('PanelMaintenance' in type) return 'Panel Maintenance';
    if ('Teaching' in type) return 'Teaching';
    if ('DisputeResolution' in type) return 'Dispute Resolution';
    if ('CommunityCare' in type) return 'Community Care';
    if ('Mentorship' in type) return 'Mentorship';
    if ('Other' in type) return type.Other;
    return 'Unknown';
  }

  /**
   * Calculate approval percentage for a proposal
   */
  static calculateApprovalPercentage(proposal: Proposal, totalMembers: number): number {
    if (totalMembers === 0) return 0;
    return Math.round((Number(proposal.votesFor) / totalMembers) * 100);
  }

  /**
   * Check if proposal meets 60% approval threshold
   */
  static meetsApprovalThreshold(proposal: Proposal, totalMembers: number): boolean {
    const approvalPercentage = this.calculateApprovalPercentage(proposal, totalMembers);
    return approvalPercentage >= 60;
  }

  /**
   * Format timestamp for display
   */
  static formatTimestamp(timestamp: bigint): string {
    // Convert nanoseconds to milliseconds
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

// Export a singleton instance
export const daoService = new HHDAOService();
