// === OWP Token Types ===
// One World Project token integration for HHDAO

export interface OWPTokenBalance {
  balance: number;
  lockedBalance: number;
  stakingRewards: number;
  miningRewards: number;
  communityRewards: number;
}

export interface OWPTransaction {
  id: string;
  type:
    | 'mining_reward'
    | 'community_reward'
    | 'staking_reward'
    | 'governance_vote'
    | 'transfer'
    | 'solar_dividend';
  amount: number;
  timestamp: Date;
  description: string;
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
  fromAddress?: string;
  toAddress?: string;
}

export interface OWPStakingInfo {
  stakedAmount: number;
  stakingAPY: number;
  rewardsEarned: number;
  unstakingPeriod: number; // days
  nextRewardDate: Date;
}

export interface OWPGovernanceInfo {
  votingPower: number;
  proposalsVoted: number;
  proposalsCreated: number;
  governanceRewards: number;
}

export interface OWPMiningRewards {
  dailyRate: number;
  weeklyTotal: number;
  monthlyTotal: number;
  allTimeTotal: number;
  lastPayoutDate: Date;
  nextPayoutDate: Date;
}

// 1WP Treasury Integration
export interface OWPTreasuryStats {
  totalValue: number; // USD
  owpTokens: number;
  btcReserves: number;
  solarInvestments: number;
  communityFunds: number;
  distributedRewards: number;
}

// UrgamU Valley Specific
export interface UrgamUProjectStats {
  solarCapacity: number; // kW
  energyGenerated: number; // kWh lifetime
  communityMembers: number;
  jobsCreated: number;
  owpTokensDistributed: number;
  carbonOffset: number; // tons CO2
}

export const OWP_TOKEN_SYMBOL = 'OWP';
export const OWP_TOKEN_DECIMALS = 8;
export const OWP_CONTRACT_ADDRESS = '0x...'; // To be filled with actual contract

// Mock OWP token data for development
export const mockOWPBalance: OWPTokenBalance = {
  balance: 1247.5,
  lockedBalance: 850.0,
  stakingRewards: 23.75,
  miningRewards: 156.25,
  communityRewards: 67.5,
};

export const mockOWPTransactions: OWPTransaction[] = [
  {
    id: '1',
    type: 'mining_reward',
    amount: 12.5,
    timestamp: new Date('2025-09-30T10:30:00'),
    description: 'Daily Bitcoin mining rewards from Gujarat Solar Farm',
    status: 'confirmed',
    txHash: '0xabc123...',
  },
  {
    id: '2',
    type: 'community_reward',
    amount: 5.0,
    timestamp: new Date('2025-09-29T16:15:00'),
    description: 'Community governance participation reward',
    status: 'confirmed',
    txHash: '0xdef456...',
  },
  {
    id: '3',
    type: 'solar_dividend',
    amount: 8.75,
    timestamp: new Date('2025-09-28T09:00:00'),
    description: 'Solar energy production dividend - Pilot Farm',
    status: 'confirmed',
    txHash: '0xghi789...',
  },
];

export const mockUrgamUStats: UrgamUProjectStats = {
  solarCapacity: 50, // 50kW pilot
  energyGenerated: 125000, // kWh lifetime
  communityMembers: 247,
  jobsCreated: 18,
  owpTokensDistributed: 15420.5,
  carbonOffset: 85.3,
};
