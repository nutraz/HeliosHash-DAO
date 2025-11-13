import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Project {
  'id' : string,
  'metadata' : [] | [string],
  'name' : string,
  'capacity' : bigint,
  'location' : string,
}
export interface ProjectHub {
  'create_opportunity' : ActorMethod<[string, string, string], Result_1>,
  'create_project' : ActorMethod<[string, string, bigint, string], Result>,
  'get_project_stats' : ActorMethod<[string], Result_1>,
  'list_opportunities' : ActorMethod<[string, [] | [string]], Result_3>,
  'log_energy_production' : ActorMethod<[string, bigint, bigint], Result_2>,
  'post_update' : ActorMethod<[string, string, string], Result_2>,
  'submit_dispute' : ActorMethod<[string, string, Array<string>], Result_1>,
  'update_status' : ActorMethod<[string, string], Result>,
}
export type Result = { 'ok' : Project } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export type Result_2 = { 'ok' : boolean } |
  { 'err' : string };
export type Result_3 = { 'ok' : Array<string> } |
  { 'err' : string };
export interface _SERVICE extends ProjectHub {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
