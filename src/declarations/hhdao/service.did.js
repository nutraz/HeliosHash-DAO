export const idlFactory = ({ IDL }) => {
  const ProjectStatus = IDL.Variant({
    Operational: IDL.Null,
    Maintenance: IDL.Null,
    Planning: IDL.Null,
    Construction: IDL.Null,
  });
  const Project = IDL.Record({
    id: IDL.Nat,
    status: ProjectStatus,
    completionDate: IDL.Opt(IDL.Int),
    owner: IDL.Principal,
    name: IDL.Text,
    createdAt: IDL.Int,
    description: IDL.Text,
    governmentApprovals: IDL.Vec(IDL.Text),
    capacity: IDL.Nat,
    estimatedCost: IDL.Nat,
    location: IDL.Text,
    telemetryId: IDL.Opt(IDL.Text),
  });
  const Result_2 = IDL.Variant({ ok: Project, err: IDL.Text });
  const Category = IDL.Variant({
    Governance: IDL.Null,
    Project: IDL.Null,
    Treasury: IDL.Null,
  });
  const Result_1 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const MembershipTier = IDL.Variant({
    Supporter: IDL.Null,
    Partner: IDL.Null,
    Investor: IDL.Null,
    Community: IDL.Null,
  });
  const NFT = IDL.Record({
    id: IDL.Nat,
    expiresAt: IDL.Int,
    owner: IDL.Principal,
    tier: MembershipTier,
    mintedAt: IDL.Int,
  });
  const Result = IDL.Variant({ ok: IDL.Text, err: IDL.Text });
  const MintResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const HHDAO = IDL.Service({
    createProject: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Nat, IDL.Text, IDL.Nat, IDL.Opt(IDL.Int)],
      [Result_2],
      []
    ),
    createProposal: IDL.Func(
      [
        IDL.Record({
          title: IDL.Text,
          votesRequired: IDL.Nat,
          description: IDL.Text,
          category: Category,
        }),
      ],
      [Result_1],
      []
    ),
    getCyclesBalance: IDL.Func([], [IDL.Nat], ['query']),
    getDashboardData: IDL.Func(
      [],
      [
        IDL.Record({
          documents: IDL.Vec(
            IDL.Record({
              id: IDL.Text,
              accessLevel: IDL.Variant({
                DAO: IDL.Null,
                Private: IDL.Null,
                Public: IDL.Null,
                Restricted: IDL.Vec(IDL.Principal),
              }),
              status: IDL.Variant({
                UnderReview: IDL.Null,
                Approved: IDL.Null,
                Draft: IDL.Null,
                Rejected: IDL.Null,
                Archived: IDL.Null,
                Submitted: IDL.Null,
              }),
              documentType: IDL.Variant({
                Legal: IDL.Null,
                Technical: IDL.Null,
                Report: IDL.Null,
                Image: IDL.Null,
                Financial: IDL.Null,
                Other: IDL.Text,
                Video: IDL.Null,
                Environmental: IDL.Null,
                Certificate: IDL.Null,
              }),
              owner: IDL.Principal,
              metadata: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
              hash: IDL.Text,
              name: IDL.Text,
              createdAt: IDL.Int,
              size: IDL.Nat,
              tags: IDL.Vec(IDL.Text),
              mimeType: IDL.Text,
              description: IDL.Opt(IDL.Text),
              version: IDL.Nat,
              updatedAt: IDL.Int,
            })
          ),
          projects: IDL.Vec(Project),
          userProfile: IDL.Opt(
            IDL.Record({
              bio: IDL.Opt(IDL.Text),
              principal: IDL.Principal,
              username: IDL.Opt(IDL.Text),
              displayName: IDL.Opt(IDL.Text),
              createdAt: IDL.Int,
              email: IDL.Opt(IDL.Text),
              website: IDL.Opt(IDL.Text),
              updatedAt: IDL.Int,
              isVerified: IDL.Bool,
              verificationLevel: IDL.Variant({
                KYC: IDL.Null,
                Enhanced: IDL.Null,
                Email: IDL.Null,
                Basic: IDL.Null,
              }),
              location: IDL.Opt(IDL.Text),
              avatar: IDL.Opt(IDL.Text),
            })
          ),
          devices: IDL.Vec(
            IDL.Record({
              id: IDL.Text,
              status: IDL.Variant({
                Error: IDL.Null,
                Online: IDL.Null,
                Maintenance: IDL.Null,
                Offline: IDL.Null,
              }),
              owner: IDL.Principal,
              metadata: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
              name: IDL.Text,
              deviceType: IDL.Variant({
                GridConnection: IDL.Null,
                SolarPanel: IDL.Null,
                Battery: IDL.Null,
                EnergyMeter: IDL.Null,
                Inverter: IDL.Null,
                WeatherStation: IDL.Null,
              }),
              registeredAt: IDL.Int,
              lastPing: IDL.Int,
              location: IDL.Record({
                region: IDL.Opt(IDL.Text),
                latitude: IDL.Float64,
                longitude: IDL.Float64,
                address: IDL.Opt(IDL.Text),
              }),
            })
          ),
        }),
      ],
      []
    ),
    getNFTInfo: IDL.Func([IDL.Nat], [IDL.Opt(NFT)], ['query']),
    getProject: IDL.Func([IDL.Nat], [IDL.Opt(Project)], ['query']),
    getProjects: IDL.Func([], [IDL.Vec(Project)], ['query']),
    getProposal: IDL.Func(
      [IDL.Nat],
      [
        IDL.Opt(
          IDL.Record({
            id: IDL.Nat,
            status: IDL.Variant({
              Passed: IDL.Null,
              Active: IDL.Null,
              Rejected: IDL.Null,
              Executed: IDL.Null,
            }),
            title: IDL.Text,
            votesAgainst: IDL.Nat,
            votesFor: IDL.Nat,
            createdAt: IDL.Int,
            votingDeadline: IDL.Int,
            description: IDL.Text,
            proposalType: IDL.Variant({
              Governance: IDL.Null,
              Project: IDL.Null,
              Treasury: IDL.Null,
              Community: IDL.Null,
            }),
            proposer: IDL.Principal,
            executionData: IDL.Opt(IDL.Text),
          })
        ),
      ],
      []
    ),
    getSystemStats: IDL.Func(
      [],
      [
        IDL.Record({
          totalProjects: IDL.Nat,
          timestamp: IDL.Int,
          totalUsers: IDL.Nat,
        }),
      ],
      ['query']
    ),
    joinPlatform: IDL.Func([IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)], [Result], []),
    mintMembershipNFT: IDL.Func(
      [
        IDL.Record({
          durationDays: IDL.Nat,
          tier: MembershipTier,
          recipient: IDL.Principal,
        }),
      ],
      [MintResult],
      []
    ),
    registerSolarDevice: IDL.Func(
      [
        IDL.Text,
        IDL.Text,
        IDL.Variant({
          GridConnection: IDL.Null,
          SolarPanel: IDL.Null,
          Battery: IDL.Null,
          EnergyMeter: IDL.Null,
          Inverter: IDL.Null,
          WeatherStation: IDL.Null,
        }),
        IDL.Float64,
        IDL.Float64,
        IDL.Opt(IDL.Text),
        IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
      ],
      [Result],
      []
    ),
    updateProjectStatus: IDL.Func([IDL.Nat, ProjectStatus], [IDL.Bool], []),
    uploadProjectDocument: IDL.Func(
      [
        IDL.Nat,
        IDL.Text,
        IDL.Opt(IDL.Text),
        IDL.Variant({
          Legal: IDL.Null,
          Technical: IDL.Null,
          Report: IDL.Null,
          Image: IDL.Null,
          Financial: IDL.Null,
          Other: IDL.Text,
          Video: IDL.Null,
          Environmental: IDL.Null,
          Certificate: IDL.Null,
        }),
        IDL.Text,
        IDL.Nat,
        IDL.Text,
        IDL.Bool,
      ],
      [Result],
      []
    ),
    vote: IDL.Func([IDL.Nat, IDL.Bool], [Result], []),
  });
  return HHDAO;
};
export const init = ({ IDL }) => {
  return [
    IDL.Opt(IDL.Principal),
    IDL.Opt(IDL.Principal),
    IDL.Opt(IDL.Principal),
    IDL.Opt(IDL.Principal),
  ];
};
