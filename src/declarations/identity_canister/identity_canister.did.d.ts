import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'addVC' : ActorMethod<[string, string], boolean>,
  'getVCs' : ActorMethod<[string], Array<string>>,
  'hasVC' : ActorMethod<[string, string], boolean>,
  'isRevoked' : ActorMethod<[string], boolean>,
  'revokeVC' : ActorMethod<[string], boolean>,
  'status' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
