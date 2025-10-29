import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';
import type { Principal } from '@dfinity/principal';

// cleaned merge conflict marker
export type ContributionType = { 'PanelMaintenance' : null } |
  { 'Teaching' : null } |
  { 'DisputeResolution' : null } |
  { 'CommunityCare' : null } |
  { 'Other' : string } |
  { 'Mentorship' : null };
export interface Dispute {
  'id' : bigint,
  'status' : DisputeStatus,
  'jurors' : Array<Principal>,
  'ruling' : [] | [{ 'winner' : Principal, 'reasoning' : string }],
  'createdAt' : Time,
  'evidence' : Array<DisputeEvidence>,
  'challenger' : Principal,
  'proposalId' : ProposalId,
  'resolvedAt' : [] | [Time],
  'appealDeadline' : [] | [Time],
  'reason' : string,
}
export interface DisputeEvidence {
  'submitter' : Principal,
  'description' : string,
  'timestamp' : Time,
  'evidenceHash' : string,
}
export type DisputeStatus = { 'InArbitration' : null } |
  { 'Resolved' : null } |
  { 'Appealed' : null } |
  { 'Pending' : null };
export type GenderIdentity = { 'NonBinary' : null } |
  { 'Male' : null } |
  { 'Female' : null } |
  { 'PreferNotToSay' : null };
export interface JurorApplication {
  'appliedAt' : Time,
  'juror' : Principal,
  'experience' : string,
  'stake' : bigint,
  'approved' : boolean,
}
export interface Member {
  'id' : MemberId,
  'joinedAt' : Time,
  'isVerified' : boolean,
  'contributionScore' : bigint,
  'gender' : [] | [GenderIdentity],
  'mentorshipStatus' : [] | [
    { 'isMentor' : boolean, 'specialization' : string }
  ],
}
export type MemberId = Principal;
export interface Proposal {
  'id' : ProposalId,
  'status' : ProposalStatus,
  'title' : string,
  'votesAgainst' : bigint,
  'votesFor' : bigint,
  'createdAt' : Time,
  'votingDeadline' : Time,
  'description' : string,
  'approved' : boolean,
  'finalized' : boolean,
  'category' : ContributionType,
  'proposer' : MemberId,
  'location' : [] | [
    { 'latitude' : number, 'longitude' : number, 'address' : string }
  ],
}
export type ProposalId = bigint;
export type ProposalStatus = { 'Passed' : null } |
  { 'Active' : null } |
  { 'Rejected' : null } |
  { 'Expired' : null };
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_2 = { 'ok' : ProposalId } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE {
  'appealDispute' : ActorMethod<[bigint, string], Result>,
  'applyAsJuror' : ActorMethod<[string, bigint], Result>,
  'approveJuror' : ActorMethod<[Principal], Result>,
  'assignJurors' : ActorMethod<[bigint, Array<Principal>], Result>,
  'createProposal' : ActorMethod<
    [string, string, ContributionType],
    ProposalId
  >,
  'finalizeProposal' : ActorMethod<[ProposalId], undefined>,
  'getAllMembers' : ActorMethod<[], Array<Member>>,
  'getAllProposals' : ActorMethod<[], Array<Proposal>>,
  'getApprovalThreshold' : ActorMethod<[], bigint>,
  'getApprovedJurors' : ActorMethod<[], Array<Principal>>,
  'getDispute' : ActorMethod<[bigint], [] | [Dispute]>,
  'getDisputes' : ActorMethod<[], Array<Dispute>>,
  'getGovernanceMeta' : ActorMethod<
    [],
    {
      'nextId' : bigint,
      'totalProposals' : bigint,
      'activeCount' : bigint,
      'schemaVersion' : bigint,
      'consensusBps' : bigint,
    }
  >,
  'getJurorApplications' : ActorMethod<[], Array<JurorApplication>>,
  'getMember' : ActorMethod<[MemberId], [] | [Member]>,
  'getMemberCount' : ActorMethod<[], bigint>,
  'getProposal' : ActorMethod<[ProposalId], [] | [Proposal]>,
  'getVoteCount' : ActorMethod<[ProposalId], [] | [[bigint, bigint]]>,
  'getWomenParticipationStats' : ActorMethod<
    [],
    {
      'womenMembers' : bigint,
      'mentorshipPrograms' : bigint,
      'womenPercentage' : bigint,
      'quotaMet' : boolean,
      'totalMembers' : bigint,
    }
  >,
  'hasVotedQuery' : ActorMethod<[ProposalId, MemberId], boolean>,
  'join' : ActorMethod<[], undefined>,
  'proposeQuotaUpdate' : ActorMethod<[bigint], Result_2>,
  'raiseDispute' : ActorMethod<[ProposalId, string], Result_1>,
  'registerMentorship' : ActorMethod<[string, boolean], Result>,
  'registerWithTreasury' : ActorMethod<[Principal], Result>,
  'resolveDispute' : ActorMethod<[bigint, Principal, string], Result>,
  'setConsensusBps' : ActorMethod<[bigint], undefined>,
  'setTestMode' : ActorMethod<[boolean], undefined>,
  'setVotingWindowSeconds' : ActorMethod<[bigint], undefined>,
  'submitEvidence' : ActorMethod<[bigint, string, string], Result>,
  'updateGenderIdentity' : ActorMethod<[GenderIdentity], Result>,
  'vote' : ActorMethod<[ProposalId, boolean], undefined>,
// cleaned merge conflict marker
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
