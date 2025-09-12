export const idlFactory = ({ IDL }) => {
  const ProjectStatus = IDL.Variant({
    'Operational' : IDL.Null,
    'Maintenance' : IDL.Null,
    'Planning' : IDL.Null,
    'Construction' : IDL.Null,
  });
  const Project = IDL.Record({
    'id' : IDL.Nat,
    'status' : ProjectStatus,
    'completionDate' : IDL.Opt(IDL.Int),
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
    'description' : IDL.Text,
    'governmentApprovals' : IDL.Vec(IDL.Text),
    'capacity' : IDL.Nat,
    'estimatedCost' : IDL.Nat,
    'location' : IDL.Text,
    'telemetryId' : IDL.Opt(IDL.Text),
  });
  const Category = IDL.Variant({
    'Governance' : IDL.Null,
    'Project' : IDL.Null,
    'Treasury' : IDL.Null,
  });
  const MembershipTier = IDL.Variant({
    'Supporter' : IDL.Null,
    'Partner' : IDL.Null,
    'Investor' : IDL.Null,
    'Community' : IDL.Null,
  });
  const NFT = IDL.Record({
    'id' : IDL.Nat,
    'expiresAt' : IDL.Int,
    'owner' : IDL.Principal,
    'tier' : MembershipTier,
    'mintedAt' : IDL.Int,
  });
  const Status = IDL.Variant({
    'Passed' : IDL.Null,
    'Open' : IDL.Null,
    'Rejected' : IDL.Null,
  });
  const Proposal = IDL.Record({
    'id' : IDL.Nat,
    'status' : Status,
    'title' : IDL.Text,
    'votesAgainst' : IDL.Nat,
    'votesRequired' : IDL.Nat,
    'votesFor' : IDL.Nat,
    'description' : IDL.Text,
    'category' : Category,
  });
  const MintResult = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  return IDL.Service({
    'createProject' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Text, IDL.Nat, IDL.Opt(IDL.Int)],
        [Project],
        [],
      ),
    'createProposal' : IDL.Func(
        [
          IDL.Record({
            'title' : IDL.Text,
            'votesRequired' : IDL.Nat,
            'description' : IDL.Text,
            'category' : Category,
          }),
        ],
        [IDL.Nat],
        [],
      ),
    'getNFTInfo' : IDL.Func([IDL.Nat], [IDL.Opt(NFT)], ['query']),
    'getProject' : IDL.Func([IDL.Nat], [IDL.Opt(Project)], ['query']),
    'getProjects' : IDL.Func([], [IDL.Vec(Project)], ['query']),
    'getProposal' : IDL.Func([IDL.Nat], [IDL.Opt(Proposal)], ['query']),
    'mintMembershipNFT' : IDL.Func(
        [
          IDL.Record({
            'durationDays' : IDL.Nat,
            'tier' : MembershipTier,
            'recipient' : IDL.Principal,
          }),
        ],
        [MintResult],
        [],
      ),
    'updateProjectStatus' : IDL.Func([IDL.Nat, ProjectStatus], [IDL.Bool], []),
    'vote' : IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
