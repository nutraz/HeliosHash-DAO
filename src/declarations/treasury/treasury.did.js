export const idlFactory = ({ IDL }) => {
  const Transaction = IDL.Record({
    'id' : IDL.Nat,
    'to' : IDL.Principal,
    'from' : IDL.Principal,
    'description' : IDL.Text,
    'timestamp' : IDL.Int,
    'amount' : IDL.Int,
  });
  return IDL.Service({
    'deposit' : IDL.Func([IDL.Int, IDL.Text], [IDL.Text], []),
    'getBalance' : IDL.Func([], [IDL.Int], ['query']),
    'getTransactions' : IDL.Func([], [IDL.Vec(Transaction)], ['query']),
    'getVersion' : IDL.Func([], [IDL.Text], ['query']),
    'withdraw' : IDL.Func([IDL.Int, IDL.Principal, IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
