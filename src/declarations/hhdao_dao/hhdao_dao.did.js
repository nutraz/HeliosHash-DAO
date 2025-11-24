export const idlFactory = ({ IDL }) => {
  const Status = IDL.Variant({
    'Passed' : IDL.Null,
    'Open' : IDL.Null,
    'Rejected' : IDL.Null,
  });
  const Category = IDL.Variant({
    'Governance' : IDL.Null,
    'Project' : IDL.Null,
    'Treasury' : IDL.Null,
  });
  const Proposal = IDL.Record({
    'id' : IDL.Nat,
    'status' : Status,
    'title' : IDL.Text,
    'votesAgainst' : IDL.Nat,
    'expiresAt' : IDL.Int,
    'votesRequired' : IDL.Nat,
    'votesFor' : IDL.Nat,
    'description' : IDL.Text,
    'category' : Category,
  });
  return IDL.Service({
    'addMember' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'addProposal' : IDL.Func([Proposal], [IDL.Bool], []),
    'getMembers' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getProposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
