export const idlFactory = ({ IDL }) => {
  const DocumentType = IDL.Variant({
    'TechnicalCertificate' : IDL.Null,
    'BankDetails' : IDL.Null,
    'Resume' : IDL.Null,
    'LocalApproval' : IDL.Null,
    'LandDeed' : IDL.Null,
    'IdentityProof' : IDL.Null,
    'Other' : IDL.Text,
    'EnvironmentalClearance' : IDL.Null,
  });
  const UploadedDocument = IDL.Record({
    'id' : IDL.Text,
    'documentType' : DocumentType,
    'fileName' : IDL.Text,
    'verificationStatus' : IDL.Variant({
      'Rejected' : IDL.Text,
      'Verified' : IDL.Null,
      'Pending' : IDL.Null,
    }),
    'uploadedAt' : IDL.Int,
  });
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
  const Result_3 = IDL.Variant({ 'ok' : Project, 'err' : IDL.Text });
  const Category = IDL.Variant({
    'Governance' : IDL.Null,
    'Project' : IDL.Null,
    'Treasury' : IDL.Null,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const ApplicationStatus = IDL.Variant({
    'UnderReview' : IDL.Null,
    'Approved' : IDL.Null,
    'Rejected' : IDL.Null,
    'Submitted' : IDL.Null,
    'Interview' : IDL.Null,
    'DocumentsRequested' : IDL.Null,
    'Expired' : IDL.Null,
  });
  const ApplicationStatusHistory = IDL.Record({
    'status' : ApplicationStatus,
    'documentsRequested' : IDL.Opt(IDL.Vec(DocumentType)),
    'updatedAt' : IDL.Int,
    'updatedBy' : IDL.Principal,
    'comments' : IDL.Opt(IDL.Text),
  });
  const ApplicationPriority = IDL.Variant({
    'Low' : IDL.Null,
    'High' : IDL.Null,
    'Medium' : IDL.Null,
    'Urgent' : IDL.Null,
  });
  const ApplicationData = IDL.Record({
    'references' : IDL.Opt(IDL.Vec(IDL.Text)),
    'technicalSkills' : IDL.Opt(IDL.Vec(IDL.Text)),
    'investmentCapacity' : IDL.Opt(IDL.Nat),
    'riskTolerance' : IDL.Opt(IDL.Text),
    'bankAccount' : IDL.Opt(IDL.Text),
    'investmentHorizon' : IDL.Opt(IDL.Text),
    'localKnowledge' : IDL.Opt(IDL.Text),
    'electricityAccess' : IDL.Opt(IDL.Bool),
    'landLocation' : IDL.Opt(IDL.Text),
    'experience' : IDL.Opt(IDL.Nat),
    'workingHours' : IDL.Opt(IDL.Text),
    'availability' : IDL.Opt(IDL.Text),
    'contactEmail' : IDL.Opt(IDL.Text),
    'specialization' : IDL.Opt(IDL.Text),
    'landSize' : IDL.Opt(IDL.Nat),
    'preferredRoles' : IDL.Opt(IDL.Vec(IDL.Text)),
    'aadhaarNumber' : IDL.Opt(IDL.Text),
    'currentLandUse' : IDL.Opt(IDL.Text),
    'contactPhone' : IDL.Opt(IDL.Text),
  });
  const ApplicationType = IDL.Variant({
    'CommunityContributor' : IDL.Null,
    'Investor' : IDL.Null,
    'LandPartner' : IDL.Null,
    'TechCollaborator' : IDL.Null,
    'Vendor' : IDL.Null,
  });
  const Application = IDL.Record({
    'id' : IDL.Nat,
    'relatedProjectId' : IDL.Opt(IDL.Nat),
    'status' : ApplicationStatus,
    'uploadedDocuments' : IDL.Vec(UploadedDocument),
    'title' : IDL.Text,
    'applicantId' : IDL.Principal,
    'assignedReviewer' : IDL.Opt(IDL.Principal),
    'submittedAt' : IDL.Int,
    'description' : IDL.Text,
    'statusHistory' : IDL.Vec(ApplicationStatusHistory),
    'lastUpdatedAt' : IDL.Int,
    'governmentApprovalId' : IDL.Opt(IDL.Text),
    'reviewDeadline' : IDL.Opt(IDL.Int),
    'priority' : ApplicationPriority,
    'applicationData' : ApplicationData,
    'applicationType' : ApplicationType,
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
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const MintResult = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const HHDAO = IDL.Service({
    'addDocumentToApplication' : IDL.Func(
        [IDL.Nat, UploadedDocument],
        [IDL.Bool],
        [],
      ),
    'assignApplicationReviewer' : IDL.Func(
        [IDL.Nat, IDL.Principal],
        [IDL.Bool],
        [],
      ),
    'createProject' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Nat, IDL.Text, IDL.Nat, IDL.Opt(IDL.Int)],
        [Result_3],
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
        [Result_2],
        [],
      ),
    'getAllApplications' : IDL.Func([], [IDL.Vec(Application)], ['query']),
    'getApplication' : IDL.Func([IDL.Nat], [IDL.Opt(Application)], ['query']),
    'getApplicationsByReviewer' : IDL.Func(
        [],
        [IDL.Vec(Application)],
        ['query'],
      ),
    'getApplicationsByStatus' : IDL.Func(
        [ApplicationStatus],
        [IDL.Vec(Application)],
        ['query'],
      ),
    'getApplicationsByType' : IDL.Func(
        [ApplicationType],
        [IDL.Vec(Application)],
        ['query'],
      ),
    'getCyclesBalance' : IDL.Func([], [IDL.Nat], ['query']),
    'getDashboardData' : IDL.Func(
        [],
        [
          IDL.Record({
            'documents' : IDL.Vec(
              IDL.Record({
                'id' : IDL.Text,
                'accessLevel' : IDL.Variant({
                  'DAO' : IDL.Null,
                  'Private' : IDL.Null,
                  'Public' : IDL.Null,
                  'Restricted' : IDL.Vec(IDL.Principal),
                }),
                'status' : IDL.Variant({
                  'UnderReview' : IDL.Null,
                  'Approved' : IDL.Null,
                  'Draft' : IDL.Null,
                  'Rejected' : IDL.Null,
                  'Archived' : IDL.Null,
                  'Submitted' : IDL.Null,
                }),
                'documentType' : IDL.Variant({
                  'Legal' : IDL.Null,
                  'Technical' : IDL.Null,
                  'Report' : IDL.Null,
                  'Image' : IDL.Null,
                  'Financial' : IDL.Null,
                  'Other' : IDL.Text,
                  'Video' : IDL.Null,
                  'Environmental' : IDL.Null,
                  'Certificate' : IDL.Null,
                }),
                'owner' : IDL.Principal,
                'metadata' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
                'hash' : IDL.Text,
                'name' : IDL.Text,
                'createdAt' : IDL.Int,
                'size' : IDL.Nat,
                'tags' : IDL.Vec(IDL.Text),
                'mimeType' : IDL.Text,
                'description' : IDL.Opt(IDL.Text),
                'version' : IDL.Nat,
                'updatedAt' : IDL.Int,
              })
            ),
            'projects' : IDL.Vec(Project),
            'userProfile' : IDL.Opt(
              IDL.Record({
                'bio' : IDL.Opt(IDL.Text),
                'principal' : IDL.Principal,
                'username' : IDL.Opt(IDL.Text),
                'displayName' : IDL.Opt(IDL.Text),
                'createdAt' : IDL.Int,
                'email' : IDL.Opt(IDL.Text),
                'website' : IDL.Opt(IDL.Text),
                'updatedAt' : IDL.Int,
                'isVerified' : IDL.Bool,
                'verificationLevel' : IDL.Variant({
                  'KYC' : IDL.Null,
                  'Enhanced' : IDL.Null,
                  'Email' : IDL.Null,
                  'Basic' : IDL.Null,
                }),
                'location' : IDL.Opt(IDL.Text),
                'avatar' : IDL.Opt(IDL.Text),
              })
            ),
            'devices' : IDL.Vec(
              IDL.Record({
                'id' : IDL.Text,
                'status' : IDL.Variant({
                  'Error' : IDL.Null,
                  'Online' : IDL.Null,
                  'Maintenance' : IDL.Null,
                  'Offline' : IDL.Null,
                }),
                'owner' : IDL.Principal,
                'metadata' : IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
                'name' : IDL.Text,
                'deviceType' : IDL.Variant({
                  'GridConnection' : IDL.Null,
                  'SolarPanel' : IDL.Null,
                  'Battery' : IDL.Null,
                  'EnergyMeter' : IDL.Null,
                  'Inverter' : IDL.Null,
                  'WeatherStation' : IDL.Null,
                }),
                'registeredAt' : IDL.Int,
                'lastPing' : IDL.Int,
                'location' : IDL.Record({
                  'region' : IDL.Opt(IDL.Text),
                  'latitude' : IDL.Float64,
                  'longitude' : IDL.Float64,
                  'address' : IDL.Opt(IDL.Text),
                }),
              })
            ),
          }),
        ],
        [],
      ),
    'getNFTInfo' : IDL.Func([IDL.Nat], [IDL.Opt(NFT)], ['query']),
    'getProject' : IDL.Func([IDL.Nat], [IDL.Opt(Project)], ['query']),
    'getProjects' : IDL.Func([], [IDL.Vec(Project)], ['query']),
    'getProposal' : IDL.Func(
        [IDL.Nat],
        [
          IDL.Opt(
            IDL.Record({
              'id' : IDL.Nat,
              'status' : IDL.Variant({
                'Passed' : IDL.Null,
                'Active' : IDL.Null,
                'Rejected' : IDL.Null,
                'Executed' : IDL.Null,
              }),
              'title' : IDL.Text,
              'votesAgainst' : IDL.Nat,
              'votesFor' : IDL.Nat,
              'createdAt' : IDL.Int,
              'votingDeadline' : IDL.Int,
              'description' : IDL.Text,
              'proposalType' : IDL.Variant({
                'Governance' : IDL.Null,
                'Project' : IDL.Null,
                'Treasury' : IDL.Null,
                'Community' : IDL.Null,
              }),
              'proposer' : IDL.Principal,
              'executionData' : IDL.Opt(IDL.Text),
            })
          ),
        ],
        [],
      ),
    'getSystemStats' : IDL.Func(
        [],
        [
          IDL.Record({
            'totalProjects' : IDL.Nat,
            'timestamp' : IDL.Int,
            'totalUsers' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getUserApplications' : IDL.Func([], [IDL.Vec(Application)], ['query']),
    'joinPlatform' : IDL.Func(
        [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        [Result],
        [],
      ),
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
    'registerSolarDevice' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Variant({
            'GridConnection' : IDL.Null,
            'SolarPanel' : IDL.Null,
            'Battery' : IDL.Null,
            'EnergyMeter' : IDL.Null,
            'Inverter' : IDL.Null,
            'WeatherStation' : IDL.Null,
          }),
          IDL.Float64,
          IDL.Float64,
          IDL.Opt(IDL.Text),
          IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
        ],
        [Result],
        [],
      ),
    'seed_data' : IDL.Func([], [IDL.Text], []),
    'submitApplication' : IDL.Func(
        [
          ApplicationType,
          IDL.Text,
          IDL.Text,
          ApplicationData,
          ApplicationPriority,
          IDL.Opt(IDL.Nat),
        ],
        [IDL.Nat],
        [],
      ),
    'updateApplicationStatus' : IDL.Func(
        [
          IDL.Nat,
          ApplicationStatus,
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Vec(DocumentType)),
        ],
        [IDL.Bool],
        [],
      ),
    'updateProjectStatus' : IDL.Func([IDL.Nat, ProjectStatus], [Result_1], []),
    'uploadProjectDocument' : IDL.Func(
        [
          IDL.Nat,
          IDL.Text,
          IDL.Opt(IDL.Text),
          IDL.Variant({
            'Legal' : IDL.Null,
            'Technical' : IDL.Null,
            'Report' : IDL.Null,
            'Image' : IDL.Null,
            'Financial' : IDL.Null,
            'Other' : IDL.Text,
            'Video' : IDL.Null,
            'Environmental' : IDL.Null,
            'Certificate' : IDL.Null,
          }),
          IDL.Text,
          IDL.Nat,
          IDL.Text,
          IDL.Bool,
        ],
        [Result],
        [],
      ),
    'vote' : IDL.Func([IDL.Nat, IDL.Bool], [Result], []),
    'whoami' : IDL.Func([], [IDL.Principal], []),
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
