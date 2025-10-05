export interface Gender {
  Male?: null;
  Female?: null;
  NonBinary?: null;
  PreferNotToSay?: null;
}

export interface IncentiveType {
  TokenBonus?: null;
  PriorityJob?: null;
  MicroGrant?: null;
  NFTBadge?: null;
  MentorshipStipend?: null;
}

export interface JobStatus {
  Pending?: null;
  Approved?: null;
  Rejected?: null;
  Completed?: null;
}

export interface GrantStatus {
  Pending?: null;
  UnderReview?: null;
  Approved?: null;
  Disbursed?: null;
  Rejected?: null;
}

export interface MentorshipRole {
  role: { Mentor?: null; Mentee?: null };
  monthlyStipend: bigint;
  startDate: bigint;
  mentorPrincipal: [] | [string];
  menteePrincipals: string[];
}

export interface JobApplication {
  jobId: string;
  jobTitle: string;
  appliedAt: bigint;
  status: JobStatus;
  priorityScore: bigint;
}

export interface GrantApplication {
  grantId: string;
  projectTitle: string;
  description: string;
  requestedAmount: bigint;
  appliedAt: bigint;
  status: GrantStatus;
  coSignerTrustee: [] | [string];
}

export interface Member {
  principal: string;
  name: string;
  gender: Gender;
  joinDate: bigint;
  owpBalance: bigint;
  bonusEarned: bigint;
  mentorshipRole: [] | [MentorshipRole];
  nftBadges: string[];
  jobApplications: JobApplication[];
  grantApplications: GrantApplication[];
}

export interface NFTBadge {
  badgeId: string;
  name: string;
  description: string;
  imageUrl: string;
  mintedAt: bigint;
}

export interface IncentiveStats {
  totalWomenMembers: bigint;
  totalBonusDistributed: bigint;
  totalGrantsDisbursed: bigint;
  totalNFTsMinted: bigint;
  averageParticipation: number;
}

export interface _SERVICE {
  // Member Management
  registerMember: (name: string, gender: Gender) => Promise<{ Ok: Member } | { Err: string }>;
  getMember: (principal: string) => Promise<[] | [Member]>;

  // Token Bonus System
  mintOWPWithBonus: (
    recipient: string,
    baseAmount: bigint
  ) => Promise<{ Ok: bigint } | { Err: string }>;

  // Priority Job Access
  applyForJob: (jobId: string, jobTitle: string) => Promise<{ Ok: string } | { Err: string }>;
  getJobApplicationsByPriority: () => Promise<JobApplication[]>;

  // Micro-Grant System
  applyForMicroGrant: (
    projectTitle: string,
    description: string,
    requestedAmount: bigint,
    coSignerTrustee: [] | [string]
  ) => Promise<{ Ok: string } | { Err: string }>;
  approveGrant: (
    applicantPrincipal: string,
    grantId: string
  ) => Promise<{ Ok: string } | { Err: string }>;
  getGrantPoolBalance: () => Promise<bigint>;
  getPendingGrants: () => Promise<GrantApplication[]>;

  // NFT Badge System
  mintAchievementBadge: (
    recipient: string,
    badgeType: string
  ) => Promise<{ Ok: string } | { Err: string }>;
  getMemberBadges: (principal: string) => Promise<string[]>;

  // Mentorship System
  registerAsMentor: (monthlyStipend: bigint) => Promise<{ Ok: string } | { Err: string }>;
  assignMentee: (menteePrincipal: string) => Promise<{ Ok: string } | { Err: string }>;
  distributeMentorStipends: () => Promise<bigint>;

  // Statistics & Analytics
  getIncentiveStats: () => Promise<IncentiveStats>;
  getWomenLeaderboard: () => Promise<Array<[string, bigint]>>;

  // Admin Functions
  updateBonusMultiplier: (newMultiplier: number) => Promise<{ Ok: string } | { Err: string }>;
  addToGrantPool: (amount: bigint) => Promise<{ Ok: string } | { Err: string }>;

  // Query Helpers
  getAllWomenMembers: () => Promise<Member[]>;
  getMemberCount: () => Promise<[bigint, bigint]>; // [totalCount, womenCount]
}
