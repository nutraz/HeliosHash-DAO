// === HHDAO Multilingual System ===
// Comprehensive i18n for 26 languages: 22 Indian + 4 Regional
// Making solar governance accessible to diverse communities

export const SUPPORTED_LANGUAGES = {
  // === Indian Languages (22) ===
  hi: { name: 'हिंदी', englishName: 'Hindi', rtl: false, region: 'India' },
  bn: { name: 'বাংলা', englishName: 'Bengali', rtl: false, region: 'India' },
  te: { name: 'తెలుగు', englishName: 'Telugu', rtl: false, region: 'India' },
  mr: { name: 'मराठी', englishName: 'Marathi', rtl: false, region: 'India' },
  ta: { name: 'தமிழ்', englishName: 'Tamil', rtl: false, region: 'India' },
  gu: { name: 'ગુજરાતી', englishName: 'Gujarati', rtl: false, region: 'India' },
  ur: { name: 'اردو', englishName: 'Urdu', rtl: true, region: 'India' },
  kn: { name: 'ಕನ್ನಡ', englishName: 'Kannada', rtl: false, region: 'India' },
  or: { name: 'ଓଡ଼ିଆ', englishName: 'Odia', rtl: false, region: 'India' },
  pa: { name: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', rtl: false, region: 'India' },
  ml: { name: 'മലയാളം', englishName: 'Malayalam', rtl: false, region: 'India' },
  as: { name: 'অসমীয়া', englishName: 'Assamese', rtl: false, region: 'India' },
  mai: { name: 'मैथिली', englishName: 'Maithili', rtl: false, region: 'India' },
  sa: { name: 'संस्कृतम्', englishName: 'Sanskrit', rtl: false, region: 'India' },
  ne: { name: 'नेपाली', englishName: 'Nepali', rtl: false, region: 'India' },
  kok: { name: 'कोंकणी', englishName: 'Konkani', rtl: false, region: 'India' },
  mni: { name: 'মেইতেই লোন্', englishName: 'Manipuri', rtl: false, region: 'India' },
  brx: { name: 'बरʼ', englishName: 'Bodo', rtl: false, region: 'India' },
  doi: { name: 'डोगरी', englishName: 'Dogri', rtl: false, region: 'India' },
  ks: { name: 'कॉशुर', englishName: 'Kashmiri', rtl: false, region: 'India' },
  sat: { name: 'ᱥᱟᱱᱛᱟᱲᱤ', englishName: 'Santali', rtl: false, region: 'India' },
  sd: { name: 'سنڌي', englishName: 'Sindhi', rtl: true, region: 'India' },

  // === Regional Languages (4) ===
  ps: { name: 'پښتو', englishName: 'Pashto', rtl: true, region: 'Afghanistan/Pakistan' },
  id: { name: 'Bahasa Indonesia', englishName: 'Indonesian', rtl: false, region: 'Indonesia' },
  tl: { name: 'Filipino', englishName: 'Tagalog', rtl: false, region: 'Philippines' },
  th: { name: 'ไทย', englishName: 'Thai', rtl: false, region: 'Thailand' },

  // === Default ===
  en: { name: 'English', englishName: 'English', rtl: false, region: 'Global' },
} as const;

export type LanguageCode = keyof typeof SUPPORTED_LANGUAGES;

// === Governance Translation Keys ===
export interface GovernanceTranslations {
  // === Header & Navigation ===
  governance: string;
  community: string;
  solarGovernance: string;
  communityGovernanceFor: string;

  // === Membership ===
  joinCommunity: string;
  joinDAO: string;
  daoMember: string;
  becomeMember: string;
  membershipBenefits: string;
  votingPower: string;
  equalForAll: string;
  contributionScore: string;
  communitySize: string;
  members: string;

  // === Proposals ===
  proposals: string;
  createProposal: string;
  proposal: string;
  title: string;
  description: string;
  category: string;
  noProposalsYet: string;
  beFirstToCreate: string;

  // === Voting ===
  vote: string;
  voteYes: string;
  voteNo: string;
  voting: string;
  youHaveVoted: string;
  votingOpen: string;
  approved: string;
  rejected: string;

  // === Statistics ===
  totalProposals: string;
  activeVoting: string;
  participation: string;
  communitySupport: string;

  // === Consensus ===
  consensusRequired: string;
  approvalThreshold: string;
  needApproval: string;
  meetsThreshold: string;

  // === Categories ===
  panelMaintenance: string;
  teaching: string;
  disputeResolution: string;
  communityCare: string;
  mentorship: string;
  other: string;

  // === Time ===
  createdAt: string;
  timestamp: string;

  // === Actions ===
  loading: string;
  tryAgain: string;
  error: string;
  success: string;

  // === Messages ===
  welcomeToDAO: string;
  canNowParticipate: string;
  voteFailed: string;
  loadingGovernanceData: string;

  // === Philosophy ===
  collaborationOverCompetition: string;
  sunGenerosityHumanFairness: string;
  inclusiveDecisionMaking: string;
}
