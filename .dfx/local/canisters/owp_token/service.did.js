export const idlFactory = ({ IDL }) => {
  const Error = IDL.Variant({
    'InsufficientBalance' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'AlreadyInitialized' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Nat, 'err' : Error });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Bool, 'err' : Error });
  return IDL.Service({
    'burn' : IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
    'getBalanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getTotalSupply' : IDL.Func([], [IDL.Nat], ['query']),
    'initialize' : IDL.Func([IDL.Principal, IDL.Nat], [Result_1], []),
    'mint' : IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
