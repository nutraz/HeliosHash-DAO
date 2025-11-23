export const idlFactory = ({ IDL }) => {
  const Proposal = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'votesAgainst' : IDL.Nat,
    'votesFor' : IDL.Nat,
    'description' : IDL.Text,
    'timestamp' : IDL.Int,
    'proposer' : IDL.Principal,
    'executed' : IDL.Bool,
  });
  return IDL.Service({
    'createProposal' : IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    'getProposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'getVersion' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
