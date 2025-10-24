import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Gender = { 'NonBinary' : null } |
  { 'Male' : null } |
  { 'Female' : null } |
  { 'PreferNotToSay' : null };
export interface GrantApplication {
  'status' : GrantStatus,
  'appliedAt' : Time,
  'description' : string,
  'grantId' : string,
  'projectTitle' : string,
  'requestedAmount' : bigint,
  'coSignerTrustee' : [] | [Principal],
}
export type GrantStatus = { 'Disbursed' : null } |
  { 'UnderReview' : null } |
  { 'Approved' : null } |
  { 'Rejected' : null } |
  { 'Pending' : null };
export interface IncentiveStats {
  'totalNFTsMinted' : bigint,
  'totalGrantsDisbursed' : bigint,
  'totalWomenMembers' : bigint,
  'totalBonusDistributed' : bigint,
  'averageParticipation' : number,
}
export interface JobApplication {
  'status' : JobStatus,
  'appliedAt' : Time,
  'jobId' : string,
  'jobTitle' : string,
  'priorityScore' : bigint,
}
export type JobStatus = { 'Approved' : null } |
  { 'Rejected' : null } |
  { 'Completed' : null } |
  { 'Pending' : null };
export interface Member {
  'principal' : Principal,
  'joinDate' : Time,
  'name' : string,
  'jobApplications' : Array<JobApplication>,
  'owpBalance' : bigint,
  'gender' : Gender,
  'mentorshipRole' : [] | [MentorshipRole],
  'grantApplications' : Array<GrantApplication>,
  'nftBadges' : Array<string>,
  'bonusEarned' : bigint,
}
export interface MentorshipRole {
  'mentorPrincipal' : [] | [Principal],
  'role' : { 'Mentee' : null } |
    { 'Mentor' : null },
  'menteePrincipals' : Array<Principal>,
  'monthlyStipend' : bigint,
  'startDate' : Time,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : Member } |
  { 'err' : string };
export type Result_2 = { 'ok' : bigint } |
  { 'err' : string };
export type Time = bigint;
export interface _SERVICE {
  'addToGrantPool' : ActorMethod<[bigint], Result>,
  'applyForJob' : ActorMethod<[string, string], Result>,
  'applyForMicroGrant' : ActorMethod<
    [string, string, bigint, [] | [Principal]],
    Result
  >,
  'approveGrant' : ActorMethod<[Principal, string], Result>,
  'assignMentee' : ActorMethod<[Principal], Result>,
  'distributeMentorStipends' : ActorMethod<[], bigint>,
  'getAllWomenMembers' : ActorMethod<[], Array<Member>>,
  'getGrantPoolBalance' : ActorMethod<[], bigint>,
  'getIncentiveStats' : ActorMethod<[], IncentiveStats>,
  'getJobApplicationsByPriority' : ActorMethod<[], Array<JobApplication>>,
  'getMember' : ActorMethod<[Principal], [] | [Member]>,
  'getMemberBadges' : ActorMethod<[Principal], Array<string>>,
  'getMemberCount' : ActorMethod<[], [bigint, bigint]>,
  'getPendingGrants' : ActorMethod<[], Array<GrantApplication>>,
  'getWomenLeaderboard' : ActorMethod<[], Array<[string, bigint]>>,
  'mintAchievementBadge' : ActorMethod<[Principal, string], Result>,
  'mintOWPWithBonus' : ActorMethod<[Principal, bigint], Result_2>,
  'registerAsMentor' : ActorMethod<[bigint], Result>,
  'registerMember' : ActorMethod<[string, Gender], Result_1>,
  'updateBonusMultiplier' : ActorMethod<[number], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
