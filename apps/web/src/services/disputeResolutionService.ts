// DisputeResolutionService - Frontend service for interacting with the dispute resolution canister

// Temporarily comment out types import due to missing types file
// import {
//   ArbitratorDecisionResponse,
//   ArbitratorProfile,
//   CreateDisputeRequest,
//   CreateDisputeResponse,
//   Dispute,
//   DisputeCategory,
//   DisputePriority,
//   DisputeStats,
//   DisputeStatus,
//   RegisterArbitratorResponse,
//   SubmitEvidenceResponse,
//   VoteResponse,
// } from '@/types/dispute-resolution';
import { Actor, HttpAgent } from '@dfinity/agent';

// IDL interface for the dispute resolution canister
const idlFactory = ({ IDL }: any) => {
  const DisputeId = IDL.Nat;
  const UserId = IDL.Principal;
  const ProjectId = IDL.Text;

  const DisputeCategory = IDL.Variant({
    ProjectFunding: IDL.Null,
    ContractorPerformance: IDL.Null,
    GovernanceDecision: IDL.Null,
    ResourceAllocation: IDL.Null,
    TechnicalIssue: IDL.Null,
    CommunityConflict: IDL.Null,
  });

  const DisputePriority = IDL.Variant({
    Low: IDL.Null,
    Medium: IDL.Null,
    High: IDL.Null,
    Critical: IDL.Null,
  });

  const CreateDisputeRequest = IDL.Record({
    respondent: UserId,
    category: DisputeCategory,
    priority: DisputePriority,
    title: IDL.Text,
    description: IDL.Text,
    relatedProjectId: IDL.Opt(ProjectId),
    tags: IDL.Vec(IDL.Text),
  });

  return IDL.Service({
    createDispute: IDL.Func(
      [CreateDisputeRequest],
      [IDL.Variant({ ok: DisputeId, err: IDL.Text })],
      []
    ),
    submitEvidence: IDL.Func(
      [DisputeId, IDL.Text, IDL.Text, IDL.Vec(IDL.Text)],
      [IDL.Variant({ ok: IDL.Nat, err: IDL.Text })],
      []
    ),
    voteOnDispute: IDL.Func(
      [DisputeId, IDL.Bool, IDL.Opt(IDL.Text)],
      [IDL.Variant({ ok: IDL.Text, err: IDL.Text })],
      []
    ),
    registerArbitrator: IDL.Func(
      [IDL.Vec(DisputeCategory), IDL.Vec(IDL.Text)],
      [IDL.Variant({ ok: IDL.Text, err: IDL.Text })],
      []
    ),
    makeArbitratorDecision: IDL.Func(
      [DisputeId, IDL.Text, IDL.Text, IDL.Opt(IDL.Nat), IDL.Opt(IDL.Text)],
      [IDL.Variant({ ok: IDL.Text, err: IDL.Text })],
      []
    ),
    getDispute: IDL.Func(
      [DisputeId],
      [
        IDL.Opt(
          IDL.Record({
            // Dispute record fields would be defined here
          })
        ),
      ],
      ['query']
    ),
    getUserDisputes: IDL.Func([UserId], [IDL.Vec(DisputeId)], ['query']),
    getAllDisputes: IDL.Func(
      [IDL.Nat, IDL.Nat],
      [
        IDL.Vec(
          IDL.Record({
            // Dispute record fields
          })
        ),
      ],
      ['query']
    ),
    getDisputesByStatus: IDL.Func(
      [
        IDL.Variant({
          Filed: IDL.Null,
          UnderReview: IDL.Null,
          InArbitration: IDL.Null,
          Resolved: IDL.Null,
          Appealed: IDL.Null,
          Closed: IDL.Null,
        }),
      ],
      [
        IDL.Vec(
          IDL.Record({
            // Dispute record fields
          })
        ),
      ],
      ['query']
    ),
  });
};

class DisputeResolutionService {
  private actor: any;
  private agent: any;

  constructor() {
    // Initialize the agent - in development, this connects to local replica
    this.agent = new HttpAgent({
      host: process.env.NODE_ENV === 'development' ? 'http://localhost:4943' : 'https://ic0.app',
    });

    // Create actor for dispute resolution canister
    this.actor = Actor.createActor(idlFactory, {
      agent: this.agent,
      canisterId:
        process.env.NEXT_PUBLIC_DISPUTE_RESOLUTION_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    });
  }

  // Create a new dispute
  async createDispute(request: any): Promise<any> {
    try {
      const result = await this.actor.createDispute(request);
      return result;
    } catch (error) {
      console.error('Error creating dispute:', error);
      throw new Error('Failed to create dispute');
    }
  }

  // Submit evidence for a dispute
  async submitEvidence(
    disputeId: number,
    title: string,
    description: string,
    attachments: string[]
  ): Promise<any> {
    try {
      const result = await this.actor.submitEvidence(disputeId, title, description, attachments);
      return result;
    } catch (error) {
      console.error('Error submitting evidence:', error);
      throw new Error('Failed to submit evidence');
    }
  }

  // Vote on a dispute
  async voteOnDispute(
    disputeId: number,
    decision: boolean,
    reasoning?: string
  ): Promise<any> {
    try {
      const result = await this.actor.voteOnDispute(
        disputeId,
        decision,
        reasoning ? [reasoning] : []
      );
      return result;
    } catch (error) {
      console.error('Error voting on dispute:', error);
      throw new Error('Failed to vote on dispute');
    }
  }

  // Register as an arbitrator
  async registerArbitrator(
    specializations: any[],
    certifications: string[]
  ): Promise<any> {
    try {
      const result = await this.actor.registerArbitrator(specializations, certifications);
      return result;
    } catch (error) {
      console.error('Error registering arbitrator:', error);
      throw new Error('Failed to register arbitrator');
    }
  }

  // Make arbitrator decision
  async makeArbitratorDecision(
    disputeId: number,
    decision: string,
    reasoning: string,
    compensationAmount?: number,
    actionRequired?: string
  ): Promise<any> {
    try {
      const result = await this.actor.makeArbitratorDecision(
        disputeId,
        decision,
        reasoning,
        compensationAmount ? [compensationAmount] : [],
        actionRequired ? [actionRequired] : []
      );
      return result;
    } catch (error) {
      console.error('Error making arbitrator decision:', error);
      throw new Error('Failed to make arbitrator decision');
    }
  }

  // Get a specific dispute
  async getDispute(disputeId: number): Promise<any | null> {
    try {
      const result = await this.actor.getDispute(disputeId);
      return result[0] || null; // Optional type in Candid returns array
    } catch (error) {
      console.error('Error getting dispute:', error);
      throw new Error('Failed to get dispute');
    }
  }

  // Get disputes for a specific user
  async getUserDisputes(userId: string): Promise<number[]> {
    try {
      const result = await this.actor.getUserDisputes(userId);
      return result;
    } catch (error) {
      console.error('Error getting user disputes:', error);
      throw new Error('Failed to get user disputes');
    }
  }

  // Get all disputes with pagination
  async getAllDisputes(offset: number = 0, limit: number = 50): Promise<any[]> {
    try {
      const result = await this.actor.getAllDisputes(offset, limit);
      return result;
    } catch (error) {
      console.error('Error getting all disputes:', error);
      throw new Error('Failed to get all disputes');
    }
  }

  // Get disputes by status
  async getDisputesByStatus(status: any): Promise<any[]> {
    try {
      const statusVariant = { [status]: null };
      const result = await this.actor.getDisputesByStatus(statusVariant);
      return result;
    } catch (error) {
      console.error('Error getting disputes by status:', error);
      throw new Error('Failed to get disputes by status');
    }
  }

  // Get arbitrator profile
  async getArbitratorProfile(userId: string): Promise<any | null> {
    try {
      const result = await this.actor.getArbitratorProfile(userId);
      return result[0] || null;
    } catch (error) {
      console.error('Error getting arbitrator profile:', error);
      throw new Error('Failed to get arbitrator profile');
    }
  }

  // Get dispute statistics
  async getDisputeStats(): Promise<any> {
    try {
      const result = await this.actor.getDisputeStats();
      return result;
    } catch (error) {
      console.error('Error getting dispute stats:', error);
      throw new Error('Failed to get dispute statistics');
    }
  }

  // Helper method to convert category to variant format
  private categoryToVariant(category: any) {
    return { [category]: null };
  }

  // Helper method to convert priority to variant format
  private priorityToVariant(priority: any) {
    return { [priority]: null };
  }
}

// Singleton instance
export const disputeResolutionService = new DisputeResolutionService();
export default disputeResolutionService;
