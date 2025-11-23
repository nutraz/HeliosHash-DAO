export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addVC' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'getVCs' : IDL.Func([IDL.Text], [IDL.Vec(IDL.Text)], ['query']),
    'hasVC' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], ['query']),
    'isRevoked' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'revokeVC' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'status' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
