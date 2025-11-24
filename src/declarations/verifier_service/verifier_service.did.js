export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getAllIssuances' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Tuple(IDL.Text, IDL.Text, IDL.Int)))],
        ['query'],
      ),
    'getIssuance' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(IDL.Tuple(IDL.Text, IDL.Text, IDL.Int))],
        ['query'],
      ),
    'recordIssuance' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Int],
        [],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
