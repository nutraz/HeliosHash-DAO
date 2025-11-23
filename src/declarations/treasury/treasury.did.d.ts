import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Transaction {
  'id' : bigint,
  'to' : Principal,
  'from' : Principal,
  'description' : string,
  'timestamp' : bigint,
  'amount' : bigint,
}
export interface _SERVICE {
  'deposit' : ActorMethod<[bigint, string], string>,
  'getBalance' : ActorMethod<[], bigint>,
  'getTransactions' : ActorMethod<[], Array<Transaction>>,
  'getVersion' : ActorMethod<[], string>,
  'withdraw' : ActorMethod<[bigint, Principal, string], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
