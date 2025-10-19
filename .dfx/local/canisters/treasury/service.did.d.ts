import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export type Amount = bigint;
export interface Meta {
  'decimals' : bigint,
  'daoCanister' : [] | [Principal],
  'name' : string,
  'locked' : boolean,
  'totalSupply' : bigint,
  'lastTxTime' : [] | [Time],
  'identityCanister' : [] | [Principal],
  'txCount' : bigint,
  'holderCount' : bigint,
  'symbol' : string,
}
export type Result = { 'ok' : TxId } |
  { 'err' : string };
export type Result_1 = { 'ok' : null } |
  { 'err' : string };
export type Time = bigint;
export interface Transaction {
  'id' : TxId,
  'to' : [] | [Principal],
  'from' : [] | [Principal],
  'kind' : TxKind,
  'timestamp' : Time,
  'amount' : Amount,
}
export interface TransferArgs {
  'to' : Account,
  'fee' : [] | [bigint],
  'memo' : [] | [Uint8Array | number[]],
  'from_subaccount' : [] | [Uint8Array | number[]],
  'created_at_time' : [] | [bigint],
  'amount' : bigint,
}
export type TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : bigint } } |
  { 'Duplicate' : { 'duplicate_of' : bigint } } |
  { 'BadFee' : { 'expected_fee' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : bigint } } |
  { 'TooOld' : { 'allowed_window_nanos' : bigint } } |
  { 'InsufficientFunds' : { 'balance' : bigint } };
export type TransferResult = { 'Ok' : bigint } |
  { 'Err' : TransferError };
export type TxId = bigint;
export type TxKind = { 'Burn' : null } |
  { 'Mint' : null } |
  { 'Transfer' : null };
export interface _SERVICE {
  'balanceOf' : ActorMethod<[Principal], bigint>,
  'burn' : ActorMethod<[Principal, bigint], Result>,
  'getLegacySecurityStatus' : ActorMethod<
    [],
    {
      'identityConfigured' : boolean,
      'totalSupply' : bigint,
      'daoConfigured' : boolean,
      'isLocked' : boolean,
    }
  >,
  'getMeta' : ActorMethod<[], Meta>,
  'getSecurityStatus' : ActorMethod<
    [],
    {
      'timelockAmountThreshold' : bigint,
      'multisigThreshold' : bigint,
      'timelockDelayNs' : bigint,
      'isPaused' : boolean,
      'identityConfigured' : boolean,
      'totalSupply' : bigint,
      'daoConfigured' : boolean,
      'isLocked' : boolean,
      'multisigConfigured' : boolean,
      'governanceConfigured' : boolean,
    }
  >,
  'getTx' : ActorMethod<[bigint], [] | [Transaction]>,
  'icrc1_balance_of' : ActorMethod<[Account], bigint>,
  'icrc1_decimals' : ActorMethod<[], number>,
  'icrc1_name' : ActorMethod<[], string>,
  'icrc1_symbol' : ActorMethod<[], string>,
  'icrc1_total_supply' : ActorMethod<[], bigint>,
  'icrc1_transfer' : ActorMethod<[TransferArgs], TransferResult>,
  'listHolders' : ActorMethod<[bigint, bigint], Array<[Principal, bigint]>>,
  'listTx' : ActorMethod<[bigint, bigint], Array<Transaction>>,
  'mint' : ActorMethod<[Principal, bigint], Result>,
  'pauseTreasury' : ActorMethod<[], Result_1>,
  'resumeTreasury' : ActorMethod<[], Result_1>,
  'setDaoCanister' : ActorMethod<[Principal], undefined>,
  'setGovernanceCanister' : ActorMethod<[Principal], undefined>,
  'setIdentityCanister' : ActorMethod<[Principal], undefined>,
  'setMultisigCanister' : ActorMethod<[Principal], undefined>,
  'syncIdentityBalance' : ActorMethod<[Principal], Result_1>,
  'transfer' : ActorMethod<[Principal, bigint], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
