import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Proposal {
  'id' : bigint,
  'title' : string,
  'votesAgainst' : bigint,
  'votesFor' : bigint,
  'description' : string,
  'timestamp' : bigint,
  'proposer' : Principal,
  'executed' : boolean,
}
export interface _SERVICE {
  'createProposal' : ActorMethod<[string, string], string>,
  'getProposals' : ActorMethod<[], Array<Proposal>>,
  'getVersion' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
