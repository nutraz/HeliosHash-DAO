// === OWP Token Types ===
// One World Project token integration for HHDAO

export interface OWPTokenBalance {
  balance: bigint;
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

// The OWP_CONTRACT_ADDRESS and mock data (mockOWPBalance, mockOWPTransactions, mockUrgamUStats)
// have been removed as the application now integrates with a live OWP token canister.