export const idlFactory = ({ IDL }) => {
  const Account = IDL.Record({ owner: IDL.Principal, subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)) });
  const TransferError = IDL.Variant({
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
    TooOld: IDL.Record({ allowed_window_nanos: IDL.Nat64 }),
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    TemporarilyUnavailable: IDL.Null,
    GenericError: IDL.Record({ error_code: IDL.Nat, message: IDL.Text }),
  });
  const TransferResult = IDL.Variant({ Ok: IDL.Nat, Err: TransferError });
  const TransferArgs = IDL.Record({
    from_subaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    to: Account,
    amount: IDL.Nat,
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
  });
  const Meta = IDL.Record({
    symbol: IDL.Text,
    name: IDL.Text,
    decimals: IDL.Nat,
    totalSupply: IDL.Nat,
    holderCount: IDL.Nat,
    txCount: IDL.Nat,
    lastTxTime: IDL.Opt(IDL.Int),
    daoCanister: IDL.Opt(IDL.Principal),
    identityCanister: IDL.Opt(IDL.Principal),
    locked: IDL.Bool,
  });
  return IDL.Service({
    getMeta: IDL.Func([], [Meta], ['query']),
    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    icrc1_name: IDL.Func([], [IDL.Text], ['query']),
    icrc1_symbol: IDL.Func([], [IDL.Text], ['query']),
    icrc1_decimals: IDL.Func([], [IDL.Nat8], ['query']),
    icrc1_total_supply: IDL.Func([], [IDL.Nat], ['query']),
    icrc1_balance_of: IDL.Func([Account], [IDL.Nat], ['query']),
    mint: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Variant({ ok: IDL.Nat, err: IDL.Text })], []),
    transfer: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Variant({ ok: IDL.Nat, err: IDL.Text })], []),
    burn: IDL.Func([IDL.Principal, IDL.Nat], [IDL.Variant({ ok: IDL.Nat, err: IDL.Text })], []),
    icrc1_transfer: IDL.Func([TransferArgs], [TransferResult], []),
    setDaoCanister: IDL.Func([IDL.Principal], [], []),
    setIdentityCanister: IDL.Func([IDL.Principal], [], []),
    syncIdentityBalance: IDL.Func(
      [IDL.Principal],
      [IDL.Variant({ ok: IDL.Null, err: IDL.Text })],
      []
    ),
  });
};
export const init = ({ IDL }) => {
  return [];
};
