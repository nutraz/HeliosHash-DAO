import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Dispute {
  id: DisputeId;
  filer: Principal;
  status: DisputeStatus;
  title: string;
  resolutionProposal: [] | [string];
  lastUpdated: Time;
  description: string;
  finalOutcome: [] | [string];
  evidence: Array<Evidence>;
  category: DisputeCategory;
  respondent: [] | [Principal];
  priority: DisputePriority;
  mediators: Array<Principal>;
  filedAt: Time;
}
export type DisputeCategory =
  | { TreasuryDispute: null }
  | { ContractDispute: null }
  | { GovernanceDispute: null }
  | { ProjectDispute: null }
  | { MembershipDispute: null }
  | { TechnicalDispute: null };
export type DisputeId = bigint;
export type DisputePriority =
  | { Low: null }
  | { High: null }
  | { Medium: null }
  | { Critical: null };
export type DisputeStatus =
  | { UnderReview: null }
  | { Closed: null }
  | { CommunityVoting: null }
  | { Mediation: null }
  | { Filed: null }
  | { Escalated: null }
  | { Resolved: null };
export interface Evidence {
  id: bigint;
  verified: boolean;
  content: string;
  submitter: Principal;
  timestamp: Time;
  evidenceType: EvidenceType;
}
export type EvidenceType =
  | { Transaction: null }
  | { Communication: null }
  | { Document: null }
  | { Testimony: null }
  | { Other: string }
  | { TechnicalLog: null };
export interface MediationSession {
  participants: Array<Principal>;
  scheduledTime: Time;
  completed: boolean;
  mediator: Principal;
  notes: [] | [string];
  sessionId: bigint;
  outcome: [] | [string];
  disputeId: DisputeId;
}
export type Result = { ok: bigint } | { err: string };
export type Result_1 = { ok: string } | { err: string };
export type Result_2 = { ok: DisputeId } | { err: string };
export type Time = bigint;
export interface _SERVICE {
  acceptMediationRole: ActorMethod<[DisputeId], Result_1>;
  applyToBeMediator: ActorMethod<[], Result_1>;
  fileDispute: ActorMethod<
    [string, string, DisputeCategory, DisputePriority, [] | [Principal]],
    Result_2
  >;
  finalizeDispute: ActorMethod<[DisputeId, string, boolean], Result_1>;
  getAllDisputes: ActorMethod<[], Array<Dispute>>;
  getDispute: ActorMethod<[DisputeId], [] | [Dispute]>;
  getDisputeStats: ActorMethod<
    [],
    {
      activeDisputes: bigint;
      totalDisputes: bigint;
      totalMediators: bigint;
      resolvedDisputes: bigint;
      disputesByCategory: Array<[DisputeCategory, bigint]>;
    }
  >;
  getDisputesByCategory: ActorMethod<[DisputeCategory], Array<Dispute>>;
  getDisputesByStatus: ActorMethod<[DisputeStatus], Array<Dispute>>;
  getMediationSessions: ActorMethod<[DisputeId], Array<MediationSession>>;
  getMyDisputes: ActorMethod<[Principal], Array<Dispute>>;
  isMediator: ActorMethod<[Principal], boolean>;
  proposeResolution: ActorMethod<[DisputeId, string], Result_1>;
  scheduleMediationSession: ActorMethod<[DisputeId, Time, Array<Principal>], Result>;
  submitEvidence: ActorMethod<[DisputeId, string, EvidenceType], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
