import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [Uint8Array | number[]],
}
export type ApiResponse = { 'Ok' : boolean } |
  { 'Err' : string };
export type Time = bigint;
export interface Transaction {
  'to' : [] | [Account],
  'fee' : [] | [bigint],
  'status' : string,
  'from' : [] | [Account],
  'kind' : string,
  'timestamp' : Time,
  'amount' : bigint,
}
export interface _SERVICE {
  /**
   * / Get allowance for spender
   */
  'allowance' : ActorMethod<[Principal, Principal], bigint>,
  /**
   * / Approve spender to spend tokens
   */
  'approve' : ActorMethod<[Principal, bigint], ApiResponse>,
  /**
   * / Get available supply (total - burnt)
   */
  'available_supply' : ActorMethod<[], bigint>,
  /**
   * / Get balance of an account
   */
  'balance_of' : ActorMethod<[Principal], bigint>,
  /**
   * / Get balance of multiple accounts
   */
  'batch_balance_of' : ActorMethod<[Array<Principal>], Array<bigint>>,
  /**
   * / Burn tokens from caller's balance
   */
  'burn' : ActorMethod<[bigint], ApiResponse>,
  /**
   * / Get burnt tokens
   */
  'burnt_supply' : ActorMethod<[], bigint>,
  /**
   * / Get number of decimals
   */
  'decimals' : ActorMethod<[], number>,
  /**
   * / Decrease allowance
   */
  'decrease_allowance' : ActorMethod<[Principal, bigint], ApiResponse>,
  /**
   * / Get transaction history (limited to last N transactions)
   */
  'get_transactions' : ActorMethod<[bigint], Array<Transaction>>,
  /**
   * / Health check
   */
  'health_check' : ActorMethod<
    [],
    {
      'status' : string,
      'totalSupply' : bigint,
      'burntSupply' : bigint,
      'transactions' : bigint,
    }
  >,
  /**
   * / Increase allowance
   */
  'increase_allowance' : ActorMethod<[Principal, bigint], ApiResponse>,
  /**
   * / Mint new tokens (admin only - simplified)
   */
  'mint' : ActorMethod<[Principal, bigint], ApiResponse>,
  /**
   * / Get token name
   */
  'name' : ActorMethod<[], string>,
  /**
   * / Get token symbol
   */
  'symbol' : ActorMethod<[], string>,
  /**
   * / Get total supply
   */
  'total_supply' : ActorMethod<[], bigint>,
  /**
   * / Get transaction count
   */
  'transaction_count' : ActorMethod<[], bigint>,
  /**
   * / Transfer tokens to recipient
   */
  'transfer' : ActorMethod<[Principal, bigint], ApiResponse>,
  /**
   * / Transfer from one account to another (requires approval)
   */
  'transfer_from' : ActorMethod<[Principal, Principal, bigint], ApiResponse>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
