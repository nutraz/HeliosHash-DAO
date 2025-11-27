export interface WalletData {
  balance: number;
  pendingRewards: number;
  stakedAmount: number;
  fiatValue: number;
  transactions: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'reward' | 'staking';
  amount: number;
  currency: 'OWP' | 'INR';
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  description: string;
}

export interface RewardsData {
  totalEarned: number;
  thisMonth: number;
  lastMonth: number;
  projected: number;
}

export interface RewardsSource {
  name: string;
  amount: number;
  percentage: number;
}

export interface WalletService {
  getBalance(): Promise<WalletData>;
  getTransactions(): Promise<Transaction[]>;
}

export interface RewardsService {
  getRewardsSummary(): Promise<RewardsData>;
  getRewardsBySource(): Promise<RewardsSource[]>;
}
