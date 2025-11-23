import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'getIssuance' : ActorMethod<[string], string>,
  'recordIssuance' : ActorMethod<[string, string, string, bigint], boolean>,
  'recordIssuanceWithProject' : ActorMethod<
    [string, string, string, bigint, string, bigint],
    boolean
  >,
  'status' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
