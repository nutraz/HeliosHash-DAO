import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Error = { 'InsufficientBalance' : null } |
  { 'Unauthorized' : null } |
  { 'AlreadyInitialized' : null };
export type Result = { 'ok' : bigint } |
  { 'err' : Error };
export type Result_1 = { 'ok' : boolean } |
  { 'err' : Error };
export interface _SERVICE {
  'burn' : ActorMethod<[Principal, bigint], Result>,
  'getBalanceOf' : ActorMethod<[Principal], bigint>,
  'getTotalSupply' : ActorMethod<[], bigint>,
  'initialize' : ActorMethod<[Principal, bigint], Result_1>,
  'mint' : ActorMethod<[Principal, bigint], Result>,
  'transfer' : ActorMethod<[Principal, bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
