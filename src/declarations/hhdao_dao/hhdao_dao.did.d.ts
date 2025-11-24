import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Category = { 'Governance' : null } |
  { 'Project' : null } |
  { 'Treasury' : null };
export interface Proposal {
  'id' : bigint,
  'status' : Status,
  'title' : string,
  'votesAgainst' : bigint,
  'expiresAt' : bigint,
  'votesRequired' : bigint,
  'votesFor' : bigint,
  'description' : string,
  'category' : Category,
}
export type Status = { 'Passed' : null } |
  { 'Open' : null } |
  { 'Rejected' : null };
export interface _SERVICE {
  'addMember' : ActorMethod<[Principal], boolean>,
  'addProposal' : ActorMethod<[Proposal], boolean>,
  'getMembers' : ActorMethod<[], Array<Principal>>,
  'getProposals' : ActorMethod<[], Array<Proposal>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
