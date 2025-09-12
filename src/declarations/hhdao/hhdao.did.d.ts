import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Category = { 'Governance' : null } |
  { 'Project' : null } |
  { 'Treasury' : null };
export type MembershipTier = { 'Supporter' : null } |
  { 'Partner' : null } |
  { 'Investor' : null } |
  { 'Community' : null };
export type MintResult = { 'ok' : bigint } |
  { 'err' : string };
export interface NFT {
  'id' : bigint,
  'expiresAt' : bigint,
  'owner' : Principal,
  'tier' : MembershipTier,
  'mintedAt' : bigint,
}
export interface Project {
  'id' : bigint,
  'status' : ProjectStatus,
  'completionDate' : [] | [bigint],
  'owner' : Principal,
  'name' : string,
  'createdAt' : bigint,
  'description' : string,
  'governmentApprovals' : Array<string>,
  'capacity' : bigint,
  'estimatedCost' : bigint,
  'location' : string,
  'telemetryId' : [] | [string],
}
export type ProjectStatus = { 'Operational' : null } |
  { 'Maintenance' : null } |
  { 'Planning' : null } |
  { 'Construction' : null };
export interface Proposal {
  'id' : bigint,
  'status' : Status,
  'title' : string,
  'votesAgainst' : bigint,
  'votesRequired' : bigint,
  'votesFor' : bigint,
  'description' : string,
  'category' : Category,
}
export type Status = { 'Passed' : null } |
  { 'Open' : null } |
  { 'Rejected' : null };
export interface _SERVICE {
  'createProject' : ActorMethod<
    [string, string, bigint, string, bigint, [] | [bigint]],
    Project
  >,
  'createProposal' : ActorMethod<
    [
      {
        'title' : string,
        'votesRequired' : bigint,
        'description' : string,
        'category' : Category,
      },
    ],
    bigint
  >,
  'getNFTInfo' : ActorMethod<[bigint], [] | [NFT]>,
  'getProject' : ActorMethod<[bigint], [] | [Project]>,
  'getProjects' : ActorMethod<[], Array<Project>>,
  'getProposal' : ActorMethod<[bigint], [] | [Proposal]>,
  'mintMembershipNFT' : ActorMethod<
    [
      {
        'durationDays' : bigint,
        'tier' : MembershipTier,
        'recipient' : Principal,
      },
    ],
    MintResult
  >,
  'updateProjectStatus' : ActorMethod<[bigint, ProjectStatus], boolean>,
  'vote' : ActorMethod<[bigint, boolean], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
