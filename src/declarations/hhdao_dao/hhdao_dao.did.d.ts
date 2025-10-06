import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ContributionType =
  | { PanelMaintenance: null }
  | { Teaching: null }
  | { DisputeResolution: null }
  | { CommunityCare: null }
  | { Other: string }
  | { Mentorship: null };
export interface Member {
  id: MemberId;
  joinedAt: Time;
  contributionScore: bigint;
}
export type MemberId = Principal;
export interface Proposal {
  id: ProposalId;
  title: string;
  votesAgainst: bigint;
  votesFor: bigint;
  createdAt: Time;
  description: string;
  approved: boolean;
  finalized: boolean;
  category: ContributionType;
  proposer: MemberId;
}
export type ProposalId = bigint;
export type Time = bigint;
export interface _SERVICE {
  createProposal: ActorMethod<[string, string, ContributionType], ProposalId>;
  finalizeProposal: ActorMethod<[ProposalId], undefined>;
  getAllMembers: ActorMethod<[], Array<Member>>;
  getAllProposals: ActorMethod<[], Array<Proposal>>;
  getApprovalThreshold: ActorMethod<[], bigint>;
  getMember: ActorMethod<[MemberId], [] | [Member]>;
  getMemberCount: ActorMethod<[], bigint>;
  getProposal: ActorMethod<[ProposalId], [] | [Proposal]>;
  getVoteCount: ActorMethod<[ProposalId], [] | [[bigint, bigint]]>;
  hasVotedQuery: ActorMethod<[ProposalId, MemberId], boolean>;
  join: ActorMethod<[], undefined>;
  vote: ActorMethod<[ProposalId, boolean], undefined>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
