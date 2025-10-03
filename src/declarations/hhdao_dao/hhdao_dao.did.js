export const idlFactory = ({ IDL }) => {
  const ContributionType = IDL.Variant({
    'PanelMaintenance' : IDL.Null,
    'Teaching' : IDL.Null,
    'DisputeResolution' : IDL.Null,
    'CommunityCare' : IDL.Null,
    'Other' : IDL.Text,
    'Mentorship' : IDL.Null,
  });
  const ProposalId = IDL.Nat;
  const MemberId = IDL.Principal;
  const Time = IDL.Int;
  const Member = IDL.Record({
    'id' : MemberId,
    'joinedAt' : Time,
    'contributionScore' : IDL.Nat,
  });
  const Proposal = IDL.Record({
    'id' : ProposalId,
    'title' : IDL.Text,
    'votesAgainst' : IDL.Nat,
    'votesFor' : IDL.Nat,
    'createdAt' : Time,
    'description' : IDL.Text,
    'approved' : IDL.Bool,
    'finalized' : IDL.Bool,
    'category' : ContributionType,
    'proposer' : MemberId,
  });
  return IDL.Service({
    'createProposal' : IDL.Func(
        [IDL.Text, IDL.Text, ContributionType],
        [ProposalId],
        [],
      ),
    'finalizeProposal' : IDL.Func([ProposalId], [], []),
    'getAllMembers' : IDL.Func([], [IDL.Vec(Member)], ['query']),
    'getAllProposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'getApprovalThreshold' : IDL.Func([], [IDL.Nat], ['query']),
    'getMember' : IDL.Func([MemberId], [IDL.Opt(Member)], ['query']),
    'getMemberCount' : IDL.Func([], [IDL.Nat], ['query']),
    'getProposal' : IDL.Func([ProposalId], [IDL.Opt(Proposal)], ['query']),
    'getVoteCount' : IDL.Func(
        [ProposalId],
        [IDL.Opt(IDL.Tuple(IDL.Nat, IDL.Nat))],
        ['query'],
      ),
    'hasVotedQuery' : IDL.Func([ProposalId, MemberId], [IDL.Bool], ['query']),
    'join' : IDL.Func([], [], []),
    'vote' : IDL.Func([ProposalId, IDL.Bool], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
