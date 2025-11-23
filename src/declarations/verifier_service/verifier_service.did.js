export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getIssuance' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'recordIssuance' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Int],
        [IDL.Bool],
        [],
      ),
    'recordIssuanceWithProject' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Int, IDL.Text, IDL.Int],
        [IDL.Bool],
        [],
      ),
    'status' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
