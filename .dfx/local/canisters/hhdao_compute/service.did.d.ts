import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type ComputeMode = { 'AI' : null } |
  { 'Hybrid' : null } |
  { 'Bitcoin' : null };
export interface ComputeStats {
  'efficiency' : number,
  'hashRate' : number,
  'revenue' : number,
  'mode' : ComputeMode,
  'lastUpdated' : bigint,
  'powerConsumption' : number,
  'aiWorkloads' : bigint,
}
export interface PivotDecision {
  'trigger' : string,
  'estimatedImpact' : number,
  'threshold' : number,
  'timestamp' : bigint,
  'newMode' : ComputeMode,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : boolean } |
  { 'err' : string };
export interface _SERVICE {
  'emergencyShutdown' : ActorMethod<[string], boolean>,
  'getComputeStatus' : ActorMethod<
    [[] | [Principal]],
    {
      'mode' : ComputeMode,
      'stats' : [] | [ComputeStats],
      'pivotHistory' : Array<[bigint, PivotDecision]>,
    }
  >,
  'getPivotRecommendations' : ActorMethod<
    [],
    Array<
      {
        'recommendedMode' : ComputeMode,
        'estimatedGain' : number,
        'confidence' : number,
        'reason' : string,
      }
    >
  >,
  'healthCheck' : ActorMethod<
    [],
    {
      'status' : string,
      'activeUsers' : bigint,
      'totalAIWorkloads' : bigint,
      'totalHashRate' : number,
      'averageEfficiency' : number,
    }
  >,
  'pivotComputeMode' : ActorMethod<[string, string, number], Result_1>,
  'updateComputeStats' : ActorMethod<[number, bigint, number, number], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
