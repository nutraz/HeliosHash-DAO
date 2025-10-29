// API Service Layer for HeliosHash DAO
// Connects frontend components with Internet Computer canisters

// import { getCanisterActors } from '@/lib/canister-actors';

const API_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://your-domain.com/api'
    : 'http://localhost:3000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  message?: string;
}

// Solar Projects API
export interface SolarProject {
  id: number;
  name: string;
  location: string;
  capacity: number;
  status: 'Planning' | 'Construction' | 'Operational' | 'Maintenance';
  owner: string;
  createdAt: number;
  governmentApprovals: string[];
  telemetryId?: string;
  description: string;
  estimatedCost: number;
  completionDate?: number;
}

export interface ProjectsStats {
  totalCapacity: number;
  totalProjects: number;
  operationalProjects: number;
  totalInvestment: number;
}

export const projectsApi = {
  async getAll(): Promise<ApiResponse<{ projects: SolarProject[] } & ProjectsStats>> {
    try {
      // Temporarily return mock data due to canister integration issues
      const mockProjects: SolarProject[] = [
        {
          id: 1,
          name: 'Uttarakhand Solar Farm',
          location: 'Uttarakhand, India',
          capacity: 100,
          status: 'Operational',
          owner: 'HeliosHash DAO',
          createdAt: Date.now() - 86400000,
          governmentApprovals: ['MNRE-2023-001'],
          description: 'Large-scale solar installation in the Himalayas',
          estimatedCost: 5000000,
          completionDate: Date.now() - 43200000,
        },
        {
          id: 2,
          name: 'Rajasthan Desert Solar',
          location: 'Rajasthan, India',
          capacity: 200,
          status: 'Construction',
          owner: 'HeliosHash DAO',
          createdAt: Date.now() - 172800000,
          governmentApprovals: ['MNRE-2023-002'],
          description: 'Mega solar project in the Thar Desert',
          estimatedCost: 10000000,
        },
      ];

      const stats: ProjectsStats = {
        totalProjects: mockProjects.length,
        operationalProjects: mockProjects.filter((p) => p.status === 'Operational').length,
        totalCapacity: mockProjects.reduce((acc, p) => acc + p.capacity, 0),
        totalInvestment: mockProjects.reduce((acc, p) => acc + p.estimatedCost, 0),
      };

      return {
        success: true,
        data: { projects: mockProjects, ...stats },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch solar projects',
        details: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  async create(project: {
    name: string;
    location: string;
    capacity: number;
    description: string;
    estimatedCost: number;
  }): Promise<ApiResponse<SolarProject>> {
    try {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create solar project',
        details: error instanceof Error ? error.message : 'Network error',
      };
    }
  },
};

// DAO Governance API
export interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  proposalType: 'Project' | 'Governance' | 'Treasury' | 'Community';
  votesFor: number;
  votesAgainst: number;
  status: 'Active' | 'Passed' | 'Rejected' | 'Executed';
  createdAt: number;
  votingDeadline: number;
  executionData?: string;
  votesRequired: number;
}

export interface ProposalStats {
  total: number;
  active: number;
  passed: number;
  rejected: number;
  executed: number;
}

export const governanceApi = {
  async getProposals(filters?: {
    status?: string;
    type?: string;
  }): Promise<ApiResponse<{ proposals: Proposal[]; stats: ProposalStats }>> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.type) params.append('type', filters.type);

      const response = await fetch(`${API_BASE}/dao/proposals?${params}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch proposals',
        details: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  async createProposal(proposal: {
    title: string;
    description: string;
    proposalType: 'Project' | 'Governance' | 'Treasury' | 'Community';
    votingDuration?: number;
    executionData?: string;
  }): Promise<ApiResponse<Proposal>> {
    try {
      const response = await fetch(`${API_BASE}/dao/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposal),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to create proposal',
        details: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  async vote(
    proposalId: number,
    vote: boolean
  ): Promise<
    ApiResponse<{
      proposalId: number;
      userVote: boolean;
      votesFor: number;
      votesAgainst: number;
      hasVoted: boolean;
      votingPower: number;
    }>
  > {
    try {
      const response = await fetch(`${API_BASE}/dao/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, vote }),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to cast vote',
        details: error instanceof Error ? error.message : 'Network error',
      };
    }
  },
};

// NFT Marketplace API
export interface NFT {
  id: number;
  name: string;
  description: string;
  image: string;
  owner: string;
  creator: string;
  price?: number;
  membershipTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  attributes: {
    energyGenerated?: number;
    carbonOffset?: number;
    communityImpact?: string;
    utilityAccess?: string[];
  };
  isForSale: boolean;
  createdAt: number;
  saleHistory: Array<{
    price: number;
    buyer: string;
    seller: string;
    timestamp: number;
  }>;
}

export interface NFTStats {
  totalNFTs: number;
  forSale: number;
  totalVolume: number;
  averagePrice: number;
  tierDistribution: {
    Bronze: number;
    Silver: number;
    Gold: number;
    Platinum: number;
  };
}

export const nftApi = {
  async getAll(filters?: {
    forSale?: boolean;
    tier?: string;
    owner?: string;
  }): Promise<ApiResponse<{ nfts: NFT[]; stats: NFTStats }>> {
    try {
      const params = new URLSearchParams();
      if (filters?.forSale !== undefined) params.append('forSale', filters.forSale.toString());
      if (filters?.tier) params.append('tier', filters.tier);
      if (filters?.owner) params.append('owner', filters.owner);

      const response = await fetch(`${API_BASE}/nft?${params}`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch NFTs',
        details: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  async purchase(
    nftId: number,
    buyerPrincipal: string
  ): Promise<
    ApiResponse<{
      nftId: number;
      transactionId: string;
      price: number;
      previousOwner: string;
      newOwner: string;
    }>
  > {
    try {
      const response = await fetch(`${API_BASE}/nft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nftId, buyerPrincipal }),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to purchase NFT',
        details: error instanceof Error ? error.message : 'Network error',
      };
    }
  },
};

// ICP Cycles Management API
export interface CycleInfo {
  canister: string;
  cycles: string; // bigint as string
  status: 'healthy' | 'warning' | 'critical';
  threshold: string; // bigint as string
}

export interface CyclesStats {
  canisters: CycleInfo[];
  totalCycles: string;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  lastUpdated: string;
}

export const cyclesApi = {
  async getStatus(): Promise<ApiResponse<CyclesStats>> {
    try {
      const response = await fetch(`${API_BASE}/cycles`);
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch cycle information',
        details: error instanceof Error ? error.message : 'Network error',
      };
    }
  },

  async topUp(
    canister: string,
    amount: string
  ): Promise<
    ApiResponse<{
      message: string;
      transactionId: string;
      newBalance: string;
    }>
  > {
    try {
      const response = await fetch(`${API_BASE}/cycles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canister, amount }),
      });
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to top up cycles',
        details: error instanceof Error ? error.message : 'Network error',
      };
    }
  },
};
