export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getRevocation' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Tuple(IDL.Text, IDL.Int, IDL.Text))],
        ['query'],
      ),
    'isRevoked' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'listRevoked' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'revoke' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Int, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'status' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
