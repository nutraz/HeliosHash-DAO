// Programmatic IDL factory for HHDAO canister
// This avoids dependency on generated bindings and provides direct actor creation

export const hhdaoIdlFactory = ({ IDL: _IDL }: { IDL: unknown }) => {
  // `_IDL` comes from @dfinity/candid runtime; the candid builder shapes are
  // difficult to express precisely in TS here. Confine the explicit `any` to
  // this local alias only so the rest of the file can use the builder helpers.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _ = _IDL as any;
  // Basic types from HHDAOLib
  const ProjectStatus = _.Variant({
    Planning: _.Null,
    Construction: _.Null,
    Operational: _.Null,
    Maintenance: _.Null,
  });

  const Category = _.Variant({
    Governance: _.Null,
    Project: _.Null,
    Treasury: _.Null,
  });

  const MembershipTier = _.Variant({
    Bronze: _.Null,
    Silver: _.Null,
    Gold: _.Null,
    Platinum: _.Null,
  });

  const MintResult = _.Variant({
    ok: _.Record({
      tokenId: _.Nat,
      owner: _.Principal,
      tier: MembershipTier,
      mintedAt: _.Int,
      expiresAt: _.Int,
    }),
    err: _.Text,
  });

  const NFT = _.Record({
    tokenId: _.Nat,
    owner: _.Principal,
    tier: MembershipTier,
    mintedAt: _.Int,
    expiresAt: _.Int,
    metadata: _.Vec(_.Tuple(_.Text, _.Text)),
  });

  const ApplicationType = _.Variant({
    ProjectFunding: _.Null,
    EquipmentGrant: _.Null,
    TrainingProgram: _.Null,
    CommunityEvent: _.Null,
  });

  const ApplicationData = _.Record({
    location: _.Text,
    capacity: _.Opt(_.Nat),
    budget: _.Opt(_.Nat),
    timeline: _.Opt(_.Text),
    additionalInfo: _.Opt(_.Text),
  });

  const ApplicationPriority = _.Variant({
    Low: _.Null,
    Medium: _.Null,
    High: _.Null,
    Urgent: _.Null,
  });

  const ApplicationStatus = _.Variant({
    Draft: _.Null,
    Submitted: _.Null,
    UnderReview: _.Null,
    Approved: _.Null,
    Rejected: _.Null,
    Completed: _.Null,
  });

  const DocumentType = _.Variant({
    Legal: _.Null,
    Technical: _.Null,
    Financial: _.Null,
    Environmental: _.Null,
    Certificate: _.Null,
    Report: _.Null,
    Image: _.Null,
    Video: _.Null,
    Other: _.Text,
  });

  const UploadedDocument = _.Record({
    name: _.Text,
    documentType: DocumentType,
    mimeType: _.Text,
    size: _.Nat,
    hash: _.Text,
    url: _.Opt(_.Text),
  });

  const Application = _.Record({
    id: _.Nat,
    applicationType: ApplicationType,
    title: _.Text,
    description: _.Text,
    applicant: _.Principal,
    applicationData: ApplicationData,
    priority: ApplicationPriority,
    status: ApplicationStatus,
    submittedAt: _.Int,
    updatedAt: _.Int,
    reviewer: _.Opt(_.Principal),
    comments: _.Opt(_.Text),
    documentsRequested: _.Opt(_.Vec(DocumentType)),
    documents: _.Vec(UploadedDocument),
    relatedProjectId: _.Opt(_.Nat),
  });

  const Project = _.Record({
    id: _.Nat,
    name: _.Text,
    location: _.Text,
    capacity: _.Nat,
    status: ProjectStatus,
    owner: _.Principal,
    createdAt: _.Int,
    governmentApprovals: _.Vec(_.Text),
    telemetryId: _.Opt(_.Text),
    description: _.Text,
    estimatedCost: _.Nat,
    completionDate: _.Opt(_.Int),
  });

  const Result = _.Variant({
    ok: _.Principal,
    err: _.Text,
  });

  const Result_1 = _.Variant({
    ok: Project,
    err: _.Text,
  });

  const Result_2 = _.Variant({
    ok: _.Nat,
    err: _.Text,
  });

  const Result_3 = _.Variant({
    ok: _.Text,
    err: _.Text,
  });

  return _.Service({
    // Internet Identity integration
    whoami: _.Func([], [_.Principal], []),

    // Project management
    createProject: _.Func([
      _.Text, _.Text, _.Nat, _.Text, _.Nat, _.Opt(_.Int)
    ], [Result_1], []),
    getProjects: _.Func([], [_.Vec(Project)], ["query"]),
    getProject: _.Func([_.Nat], [_.Opt(Project)], ["query"]),
    updateProjectStatus: _.Func([_.Nat, ProjectStatus], [_.Bool], []),

    // DAO functions
    createProposal: _.Func([
      _.Record({
        title: _.Text,
        description: _.Text,
        votesRequired: _.Nat,
        category: Category,
      })
    ], [Result_2], []),
    vote: _.Func([_.Nat, _.Bool], [Result_3], []),
    getProposal: _.Func([_.Nat], [_.Opt(_.Record({
      id: _.Nat,
      title: _.Text,
      description: _.Text,
      proposer: _.Principal,
      proposalType: _.Variant({
        Project: _.Null,
        Governance: _.Null,
        Treasury: _.Null,
        Community: _.Null,
      }),
      votesFor: _.Nat,
      votesAgainst: _.Nat,
      status: _.Variant({
        Active: _.Null,
        Passed: _.Null,
        Rejected: _.Null,
        Executed: _.Null,
      }),
      createdAt: _.Int,
      votingDeadline: _.Int,
      executionData: _.Opt(_.Text),
    }))], []),

    // NFT functions
    mintMembershipNFT: _.Func([
      _.Record({
        recipient: _.Principal,
        tier: MembershipTier,
        durationDays: _.Nat,
      })
    ], [MintResult], []),
    getNFTInfo: _.Func([_.Nat], [_.Opt(NFT)], ["query"]),

    // Application management
    submitApplication: _.Func([
      ApplicationType, _.Text, _.Text, ApplicationData,
      ApplicationPriority, _.Opt(_.Nat)
    ], [_.Nat], []),
    updateApplicationStatus: _.Func([
      _.Nat, ApplicationStatus, _.Opt(_.Text), _.Opt(_.Vec(DocumentType))
    ], [_.Bool], []),
    addDocumentToApplication: _.Func([_.Nat, UploadedDocument], [_.Bool], []),
    getApplication: _.Func([_.Nat], [_.Opt(Application)], ["query"]),
    getUserApplications: _.Func([], [_.Vec(Application)], ["query"]),
    getApplicationsByStatus: _.Func([ApplicationStatus], [_.Vec(Application)], ["query"]),
    getApplicationsByType: _.Func([ApplicationType], [_.Vec(Application)], ["query"]),
    getApplicationsByReviewer: _.Func([], [_.Vec(Application)], ["query"]),
    getAllApplications: _.Func([], [_.Vec(Application)], ["query"]),

    // System functions
    getSystemStats: _.Func([], [_.Record({
      totalProjects: _.Nat,
      totalUsers: _.Nat,
      timestamp: _.Int,
    })], ["query"]),
    getCyclesBalance: _.Func([], [_.Nat], ["query"]),

    // Development helpers
    seed_data: _.Func([], [_.Text], []),
  });
};