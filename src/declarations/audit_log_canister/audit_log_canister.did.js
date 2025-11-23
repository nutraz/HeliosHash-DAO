export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'append' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'getLog' : IDL.Func([IDL.Nat], [IDL.Text], ['query']),
    'status' : IDL.Func([], [IDL.Text], ['query']),
    'tail' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Text))],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
