export const idlFactory = ({ IDL }) => {
  const TxId = IDL.Nat;
  const Result = IDL.Variant({ 'ok' : TxId, 'err' : IDL.Text });
  const Time = IDL.Int;
  const Meta = IDL.Record({
    'decimals' : IDL.Nat,
    'daoCanister' : IDL.Opt(IDL.Principal),
    'name' : IDL.Text,
    'locked' : IDL.Bool,
    'totalSupply' : IDL.Nat,
    'lastTxTime' : IDL.Opt(Time),
    'identityCanister' : IDL.Opt(IDL.Principal),
    'txCount' : IDL.Nat,
    'holderCount' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const TxKind = IDL.Variant({
    'Burn' : IDL.Null,
    'Mint' : IDL.Null,
    'Transfer' : IDL.Null,
  });
  const Amount = IDL.Nat;
  const Transaction = IDL.Record({
    'id' : TxId,
    'to' : IDL.Opt(IDL.Principal),
    'from' : IDL.Opt(IDL.Principal),
    'kind' : TxKind,
    'timestamp' : Time,
    'amount' : Amount,
  });
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const TransferArgs = IDL.Record({
    'to' : Account,
    'fee' : IDL.Opt(IDL.Nat),
    'memo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'from_subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'created_at_time' : IDL.Opt(IDL.Nat),
    'amount' : IDL.Nat,
  });
  const TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : IDL.Record({ 'min_burn_amount' : IDL.Nat }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : IDL.Nat }),
    'BadFee' : IDL.Record({ 'expected_fee' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : IDL.Nat }),
    'TooOld' : IDL.Record({ 'allowed_window_nanos' : IDL.Nat }),
    'InsufficientFunds' : IDL.Record({ 'balance' : IDL.Nat }),
  });
  const TransferResult = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : TransferError });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'burn' : IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
    'getLegacySecurityStatus' : IDL.Func(
        [],
        [
          IDL.Record({
            'identityConfigured' : IDL.Bool,
            'totalSupply' : IDL.Nat,
            'daoConfigured' : IDL.Bool,
            'isLocked' : IDL.Bool,
          }),
        ],
        ['query'],
      ),
    'getMeta' : IDL.Func([], [Meta], ['query']),
    'getSecurityStatus' : IDL.Func(
        [],
        [
          IDL.Record({
            'timelockAmountThreshold' : IDL.Nat,
            'multisigThreshold' : IDL.Nat,
            'timelockDelayNs' : IDL.Int,
            'isPaused' : IDL.Bool,
            'identityConfigured' : IDL.Bool,
            'totalSupply' : IDL.Nat,
            'daoConfigured' : IDL.Bool,
            'isLocked' : IDL.Bool,
            'multisigConfigured' : IDL.Bool,
            'governanceConfigured' : IDL.Bool,
          }),
        ],
        ['query'],
      ),
    'getTx' : IDL.Func([IDL.Nat], [IDL.Opt(Transaction)], ['query']),
    'icrc1_balance_of' : IDL.Func([Account], [IDL.Nat], ['query']),
    'icrc1_decimals' : IDL.Func([], [IDL.Nat8], ['query']),
    'icrc1_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc1_transfer' : IDL.Func([TransferArgs], [TransferResult], []),
    'listHolders' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query'],
      ),
    'listTx' : IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(Transaction)], ['query']),
    'mint' : IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
    'pauseTreasury' : IDL.Func([], [Result_1], []),
    'resumeTreasury' : IDL.Func([], [Result_1], []),
    'setDaoCanister' : IDL.Func([IDL.Principal], [], []),
    'setGovernanceCanister' : IDL.Func([IDL.Principal], [], []),
    'setIdentityCanister' : IDL.Func([IDL.Principal], [], []),
    'setMultisigCanister' : IDL.Func([IDL.Principal], [], []),
    'syncIdentityBalance' : IDL.Func([IDL.Principal], [Result_1], []),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
