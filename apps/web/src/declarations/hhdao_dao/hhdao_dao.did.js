export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
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
  const GenderIdentity = IDL.Variant({
    'NonBinary' : IDL.Null,
    'Male' : IDL.Null,
    'Female' : IDL.Null,
    'PreferNotToSay' : IDL.Null,
  });
  const Member = IDL.Record({
    'id' : MemberId,
    'joinedAt' : Time,
    'isVerified' : IDL.Bool,
    'contributionScore' : IDL.Nat,
    'gender' : IDL.Opt(GenderIdentity),
    'mentorshipStatus' : IDL.Opt(
      IDL.Record({ 'isMentor' : IDL.Bool, 'specialization' : IDL.Text })
    ),
  });
  const ProposalStatus = IDL.Variant({
    'Passed' : IDL.Null,
    'Active' : IDL.Null,
    'Rejected' : IDL.Null,
    'Expired' : IDL.Null,
  });
  const Proposal = IDL.Record({
    'id' : ProposalId,
    'status' : ProposalStatus,
    'title' : IDL.Text,
    'votesAgainst' : IDL.Nat,
    'votesFor' : IDL.Nat,
    'createdAt' : Time,
    'votingDeadline' : Time,
    'description' : IDL.Text,
    'approved' : IDL.Bool,
    'finalized' : IDL.Bool,
    'category' : ContributionType,
    'proposer' : MemberId,
    'location' : IDL.Opt(
      IDL.Record({
        'latitude' : IDL.Float64,
        'longitude' : IDL.Float64,
        'address' : IDL.Text,
      })
    ),
  });
  const DisputeStatus = IDL.Variant({
    'InArbitration' : IDL.Null,
    'Resolved' : IDL.Null,
    'Appealed' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const DisputeEvidence = IDL.Record({
    'submitter' : IDL.Principal,
    'description' : IDL.Text,
    'timestamp' : Time,
    'evidenceHash' : IDL.Text,
  });
  const Dispute = IDL.Record({
    'id' : IDL.Nat,
    'status' : DisputeStatus,
    'jurors' : IDL.Vec(IDL.Principal),
    'ruling' : IDL.Opt(
      IDL.Record({ 'winner' : IDL.Principal, 'reasoning' : IDL.Text })
    ),
    'createdAt' : Time,
    'evidence' : IDL.Vec(DisputeEvidence),
    'challenger' : IDL.Principal,
    'proposalId' : ProposalId,
    'resolvedAt' : IDL.Opt(Time),
    'appealDeadline' : IDL.Opt(Time),
    'reason' : IDL.Text,
  });
  const JurorApplication = IDL.Record({
    'appliedAt' : Time,
    'juror' : IDL.Principal,
    'experience' : IDL.Text,
    'stake' : IDL.Nat,
    'approved' : IDL.Bool,
  });
  const Result_2 = IDL.Variant({ 'ok' : ProposalId, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  return IDL.Service({
    'appealDispute' : IDL.Func([IDL.Nat, IDL.Text], [Result], []),
    'applyAsJuror' : IDL.Func([IDL.Text, IDL.Nat], [Result], []),
    'approveJuror' : IDL.Func([IDL.Principal], [Result], []),
    'assignJurors' : IDL.Func([IDL.Nat, IDL.Vec(IDL.Principal)], [Result], []),
    'createProposal' : IDL.Func(
        [IDL.Text, IDL.Text, ContributionType],
        [ProposalId],
        [],
      ),
    'finalizeProposal' : IDL.Func([ProposalId], [], []),
    'getAllMembers' : IDL.Func([], [IDL.Vec(Member)], ['query']),
    'getAllProposals' : IDL.Func([], [IDL.Vec(Proposal)], ['query']),
    'getApprovalThreshold' : IDL.Func([], [IDL.Nat], ['query']),
    'getApprovedJurors' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getDispute' : IDL.Func([IDL.Nat], [IDL.Opt(Dispute)], ['query']),
    'getDisputes' : IDL.Func([], [IDL.Vec(Dispute)], ['query']),
    'getGovernanceMeta' : IDL.Func(
        [],
        [
          IDL.Record({
            'nextId' : IDL.Nat,
            'totalProposals' : IDL.Nat,
            'activeCount' : IDL.Nat,
            'schemaVersion' : IDL.Nat,
            'consensusBps' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getJurorApplications' : IDL.Func(
        [],
        [IDL.Vec(JurorApplication)],
        ['query'],
      ),
    'getMember' : IDL.Func([MemberId], [IDL.Opt(Member)], ['query']),
    'getMemberCount' : IDL.Func([], [IDL.Nat], ['query']),
    'getProposal' : IDL.Func([ProposalId], [IDL.Opt(Proposal)], ['query']),
    'getVoteCount' : IDL.Func(
        [ProposalId],
        [IDL.Opt(IDL.Tuple(IDL.Nat, IDL.Nat))],
        ['query'],
      ),
    'getWomenParticipationStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'womenMembers' : IDL.Nat,
            'mentorshipPrograms' : IDL.Nat,
            'womenPercentage' : IDL.Nat,
            'quotaMet' : IDL.Bool,
            'totalMembers' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'hasVotedQuery' : IDL.Func([ProposalId, MemberId], [IDL.Bool], ['query']),
    'join' : IDL.Func([], [], []),
    'proposeQuotaUpdate' : IDL.Func([IDL.Nat], [Result_2], []),
    'raiseDispute' : IDL.Func([ProposalId, IDL.Text], [Result_1], []),
    'registerMentorship' : IDL.Func([IDL.Text, IDL.Bool], [Result], []),
    'registerWithTreasury' : IDL.Func([IDL.Principal], [Result], []),
    'resolveDispute' : IDL.Func(
        [IDL.Nat, IDL.Principal, IDL.Text],
        [Result],
        [],
      ),
    'setConsensusBps' : IDL.Func([IDL.Nat], [], []),
    'setTestMode' : IDL.Func([IDL.Bool], [], []),
    'setVotingWindowSeconds' : IDL.Func([IDL.Nat], [], []),
    'submitEvidence' : IDL.Func([IDL.Nat, IDL.Text, IDL.Text], [Result], []),
    'updateGenderIdentity' : IDL.Func([GenderIdentity], [Result], []),
    'vote' : IDL.Func([ProposalId, IDL.Bool], [], []),
  });
};
