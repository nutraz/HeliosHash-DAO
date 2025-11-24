export const idlFactory = ({ IDL }) => {
  const ApiResponse = IDL.Variant({ 'Ok' : IDL.Bool, 'Err' : IDL.Text });
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Time = IDL.Int;
  const Transaction = IDL.Record({
    'to' : IDL.Opt(Account),
    'fee' : IDL.Opt(IDL.Nat),
    'status' : IDL.Text,
    'from' : IDL.Opt(Account),
    'kind' : IDL.Text,
    'timestamp' : Time,
    'amount' : IDL.Nat,
  });
  return IDL.Service({
    'allowance' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Nat],
        ['query'],
      ),
    'approve' : IDL.Func([IDL.Principal, IDL.Nat], [ApiResponse], []),
    'available_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'balance_of' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'batch_balance_of' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [IDL.Vec(IDL.Nat)],
        ['query'],
      ),
    'burn' : IDL.Func([IDL.Nat], [ApiResponse], []),
    'burnt_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'decimals' : IDL.Func([], [IDL.Nat8], ['query']),
    'decrease_allowance' : IDL.Func(
        [IDL.Principal, IDL.Nat],
        [ApiResponse],
        [],
      ),
    'get_transactions' : IDL.Func([IDL.Nat], [IDL.Vec(Transaction)], ['query']),
    'health_check' : IDL.Func(
        [],
        [
          IDL.Record({
            'status' : IDL.Text,
            'totalSupply' : IDL.Nat,
            'burntSupply' : IDL.Nat,
            'transactions' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'increase_allowance' : IDL.Func(
        [IDL.Principal, IDL.Nat],
        [ApiResponse],
        [],
      ),
    'mint' : IDL.Func([IDL.Principal, IDL.Nat], [ApiResponse], []),
    'name' : IDL.Func([], [IDL.Text], ['query']),
    'symbol' : IDL.Func([], [IDL.Text], ['query']),
    'total_supply' : IDL.Func([], [IDL.Nat], ['query']),
    'transaction_count' : IDL.Func([], [IDL.Nat], ['query']),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [ApiResponse], []),
    'transfer_from' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [ApiResponse],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
