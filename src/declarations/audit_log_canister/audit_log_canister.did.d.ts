import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'append' : ActorMethod<[string], bigint>,
  'getLog' : ActorMethod<[bigint], string>,
  'status' : ActorMethod<[], string>,
  'tail' : ActorMethod<[bigint], Array<[bigint, string]>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
