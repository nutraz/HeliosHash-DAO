export const idlFactory = ({ IDL }: { IDL: any }) => {
  const Gender = IDL.Variant({
    Male: IDL.Null,
    Female: IDL.Null,
    NonBinary: IDL.Null,
    PreferNotToSay: IDL.Null,
  });

  const JobStatus = IDL.Variant({
    Pending: IDL.Null,
    Approved: IDL.Null,
    Rejected: IDL.Null,
    Completed: IDL.Null,
  });

  const GrantStatus = IDL.Variant({
    Pending: IDL.Null,
    UnderReview: IDL.Null,
    Approved: IDL.Null,
    Disbursed: IDL.Null,
    Rejected: IDL.Null,
  });

  const MentorshipRole = IDL.Record({
    role: IDL.Variant({ Mentor: IDL.Null, Mentee: IDL.Null }),
    monthlyStipend: IDL.Nat,
    startDate: IDL.Int,
    mentorPrincipal: IDL.Opt(IDL.Principal),
    menteePrincipals: IDL.Vec(IDL.Principal),
  });

  const JobApplication = IDL.Record({
    jobId: IDL.Text,
    jobTitle: IDL.Text,
    appliedAt: IDL.Int,
    status: JobStatus,
    priorityScore: IDL.Nat,
  });

  const GrantApplication = IDL.Record({
    grantId: IDL.Text,
    projectTitle: IDL.Text,
    description: IDL.Text,
    requestedAmount: IDL.Nat,
    appliedAt: IDL.Int,
    status: GrantStatus,
    coSignerTrustee: IDL.Opt(IDL.Principal),
  });

  const Member = IDL.Record({
    principal: IDL.Principal,
    name: IDL.Text,
    gender: Gender,
    joinDate: IDL.Int,
    owpBalance: IDL.Nat,
    bonusEarned: IDL.Nat,
    mentorshipRole: IDL.Opt(MentorshipRole),
    nftBadges: IDL.Vec(IDL.Text),
    jobApplications: IDL.Vec(JobApplication),
    grantApplications: IDL.Vec(GrantApplication),
  });

  const IncentiveStats = IDL.Record({
    totalWomenMembers: IDL.Nat,
    totalBonusDistributed: IDL.Nat,
    totalGrantsDisbursed: IDL.Nat,
    totalNFTsMinted: IDL.Nat,
    averageParticipation: IDL.Float64,
  });

  const Result = IDL.Variant({ Ok: IDL.Text, Err: IDL.Text });
  const ResultMember = IDL.Variant({ Ok: Member, Err: IDL.Text });
  const ResultNat = IDL.Variant({ Ok: IDL.Nat, Err: IDL.Text });

  return IDL.Service({
    registerMember: IDL.Func([IDL.Text, Gender], [ResultMember], []),
    getMember: IDL.Func([IDL.Principal], [IDL.Opt(Member)], ['query']),
    mintOWPWithBonus: IDL.Func([IDL.Principal, IDL.Nat], [ResultNat], []),
    applyForJob: IDL.Func([IDL.Text, IDL.Text], [Result], []),
    getJobApplicationsByPriority: IDL.Func([], [IDL.Vec(JobApplication)], ['query']),
    applyForMicroGrant: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Nat, IDL.Opt(IDL.Principal)],
      [Result],
      []
    ),
    approveGrant: IDL.Func([IDL.Principal, IDL.Text], [Result], []),
    getGrantPoolBalance: IDL.Func([], [IDL.Nat], ['query']),
    getPendingGrants: IDL.Func([], [IDL.Vec(GrantApplication)], ['query']),
    mintAchievementBadge: IDL.Func([IDL.Principal, IDL.Text], [Result], []),
    getMemberBadges: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Text)], ['query']),
    registerAsMentor: IDL.Func([IDL.Nat], [Result], []),
    assignMentee: IDL.Func([IDL.Principal], [Result], []),
    distributeMentorStipends: IDL.Func([], [IDL.Nat], []),
    getIncentiveStats: IDL.Func([], [IncentiveStats], ['query']),
    getWomenLeaderboard: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))], ['query']),
    updateBonusMultiplier: IDL.Func([IDL.Float64], [Result], []),
    addToGrantPool: IDL.Func([IDL.Nat], [Result], []),
    getAllWomenMembers: IDL.Func([], [IDL.Vec(Member)], ['query']),
    getMemberCount: IDL.Func([], [IDL.Tuple(IDL.Nat, IDL.Nat)], ['query']),
  });
};

export const init = ({ IDL }: { IDL: any }) => {
  return [];
};
