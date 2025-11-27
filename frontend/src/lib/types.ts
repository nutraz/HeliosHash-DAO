export interface Project {
  id: number | string; // Allow both number and string
  name: string;
  // make fields optional to accomodate minimal fixtures in `src/lib/data.ts`
  stage?: string;
  color?: string;
  size?: string;
  energySupply?: string;
  surplus?: string;
  completion?: number;
  funding?: string;
  isLive?: boolean;
  description?: string;
  location?: string;
  status?: string;
  liveData?: {
    panels?: number;
    currentOutput?: number;
    todayEnergy?: number;
    uptime?: string;
    temperature?: string;
    hashrate?: string;
    btcMined?: string;
  };
  opportunities?: Array<{
    type: string;
    positions?: number;
    amount?: string;
  }>;
  detailedInfo?: {
    location: string;
    type: string;
    capacity: string;
    technology: string;
    storage: string;
    architecture: string;
    governance: string;
    revenueModel: string;
    partners: string[];
    milestones: Array<{
      date: string;
      event: string;
    }>;
    impact: {
      [key: string]: string | number | undefined;
    };
  };
}

export interface User {
  name: string;
  pfp: string;
  rank: string;
  communityRole: string;
  // optional identity fields used in tests and services
  principal?: string;
  membershipTier?: string;
  stats: {
    projectsStarted: number;
    projectsHelped: number;
    membersAdded: number;
  };
  tokenBalance: number;
  nftCollection?: NFT[];
}

export interface NFT {
  id: number | string;
  // optional fields to match fixtures
  name?: string;
  image?: string;
  projectId?: number | string | null;
  community?: string;
}

export interface Post {
  id: number | string;
  author: string;
  content: string;
  timestamp?: Date;
  // legacy components use `time` string; keep it optional for compatibility
  time?: string;
  projectId?: number | string;
}

export type UserData = User & { [key: string]: any };

export interface NavigationProps {
  dashboard: any;
  userData: User;
}

export interface CommunityHubProps {
  posts?: Post[];
  selectedProject?: Project | null;
}

export interface NFTCollectionProps {
  projects: Project[];
}

export interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onCommunityClick: () => void;
}

export interface ProjectMapProps {
  projects: Project[];
}
