export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Time = IDL.Int;
  const JobStatus = IDL.Variant({
    'Approved' : IDL.Null,
    'Rejected' : IDL.Null,
    'Completed' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const JobApplication = IDL.Record({
    'status' : JobStatus,
    'appliedAt' : Time,
    'jobId' : IDL.Text,
    'jobTitle' : IDL.Text,
    'priorityScore' : IDL.Nat,
  });
  const Gender = IDL.Variant({
    'NonBinary' : IDL.Null,
    'Male' : IDL.Null,
    'Female' : IDL.Null,
    'PreferNotToSay' : IDL.Null,
  });
  const MentorshipRole = IDL.Record({
    'mentorPrincipal' : IDL.Opt(IDL.Principal),
    'role' : IDL.Variant({ 'Mentee' : IDL.Null, 'Mentor' : IDL.Null }),
    'menteePrincipals' : IDL.Vec(IDL.Principal),
    'monthlyStipend' : IDL.Nat,
    'startDate' : Time,
  });
  const GrantStatus = IDL.Variant({
    'Disbursed' : IDL.Null,
    'UnderReview' : IDL.Null,
    'Approved' : IDL.Null,
    'Rejected' : IDL.Null,
    'Pending' : IDL.Null,
  });
  const GrantApplication = IDL.Record({
    'status' : GrantStatus,
    'appliedAt' : Time,
    'description' : IDL.Text,
    'grantId' : IDL.Text,
    'projectTitle' : IDL.Text,
    'requestedAmount' : IDL.Nat,
    'coSignerTrustee' : IDL.Opt(IDL.Principal),
  });
  const Member = IDL.Record({
    'principal' : IDL.Principal,
    'joinDate' : Time,
    'name' : IDL.Text,
    'jobApplications' : IDL.Vec(JobApplication),
    'owpBalance' : IDL.Nat,
    'gender' : Gender,
    'mentorshipRole' : IDL.Opt(MentorshipRole),
    'grantApplications' : IDL.Vec(GrantApplication),
    'nftBadges' : IDL.Vec(IDL.Text),
    'bonusEarned' : IDL.Nat,
  });
  const IncentiveStats = IDL.Record({
    'totalNFTsMinted' : IDL.Nat,
    'totalGrantsDisbursed' : IDL.Nat,
    'totalWomenMembers' : IDL.Nat,
    'totalBonusDistributed' : IDL.Nat,
    'averageParticipation' : IDL.Float64,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : Member, 'err' : IDL.Text });
  return IDL.Service({
    'addToGrantPool' : IDL.Func([IDL.Nat], [Result], []),
    'applyForJob' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'applyForMicroGrant' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Opt(IDL.Principal)],
        [Result],
        [],
      ),
    'approveGrant' : IDL.Func([IDL.Principal, IDL.Text], [Result], []),
    'assignMentee' : IDL.Func([IDL.Principal], [Result], []),
    'distributeMentorStipends' : IDL.Func([], [IDL.Nat], []),
    'getAllWomenMembers' : IDL.Func([], [IDL.Vec(Member)], ['query']),
    'getGrantPoolBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'getIncentiveStats' : IDL.Func([], [IncentiveStats], ['query']),
    'getJobApplicationsByPriority' : IDL.Func(
        [],
        [IDL.Vec(JobApplication)],
        ['query'],
      ),
    'getMember' : IDL.Func([IDL.Principal], [IDL.Opt(Member)], ['query']),
    'getMemberBadges' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Text)],
        ['query'],
      ),
    'getMemberCount' : IDL.Func([], [IDL.Nat, IDL.Nat], ['query']),
    'getPendingGrants' : IDL.Func([], [IDL.Vec(GrantApplication)], ['query']),
    'getWomenLeaderboard' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
    'mintAchievementBadge' : IDL.Func([IDL.Principal, IDL.Text], [Result], []),
    'mintOWPWithBonus' : IDL.Func([IDL.Principal, IDL.Nat], [Result_2], []),
    'registerAsMentor' : IDL.Func([IDL.Nat], [Result], []),
    'registerMember' : IDL.Func([IDL.Text, Gender], [Result_1], []),
    'updateBonusMultiplier' : IDL.Func([IDL.Float64], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
