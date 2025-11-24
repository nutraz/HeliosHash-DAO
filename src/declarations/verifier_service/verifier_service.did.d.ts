import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'getAllIssuances' : ActorMethod<
    [],
    Array<[string, [string, string, bigint]]>
  >,
  'getIssuance' : ActorMethod<[string], [] | [[string, string, bigint]]>,
  'recordIssuance' : ActorMethod<[string, string, string, bigint], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
