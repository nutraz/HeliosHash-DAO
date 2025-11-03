export const idlFactory = ({ IDL }) => {
  const Balance = IDL.Nat;
  const Transaction = IDL.Record({
    'id': IDL.Nat,
    'amount': IDL.Nat,
    'timestamp': IDL.Int,
    'description': IDL.Text,
  });
  const Result = IDL.Variant({ 'ok': IDL.Null, 'err': IDL.Text });

  return IDL.Service({
    'getBalance': IDL.Func([], [Balance], ['query']),
    'getTransactions': IDL.Func([IDL.Opt(IDL.Nat)], [IDL.Vec(Transaction)], ['query']),
    'getPendingRewards': IDL.Func([], [Balance], ['query']),
    'getStakedAmount': IDL.Func([], [Balance], ['query']),
  });
};
