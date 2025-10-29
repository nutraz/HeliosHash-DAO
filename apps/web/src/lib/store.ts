import { ethers } from 'ethers';
import { create } from 'zustand';

export interface User {
  id: string;
  address: string;
  provider: 'metamask' | 'walletconnect' | 'coinbase' | 'internet-identity' | 'email' | 'google';
  balance: string;
  votingPower: string;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'stake' | 'unstake' | 'reward';
  amount: string;
  valueUSD: string;
  timestamp: number;
  description: string;
  hash?: string;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
  timestamp: number;
  read: boolean;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'passed' | 'failed' | 'pending';
  votesFor: number;
  votesAgainst: number;
  endTime: number;
  creator: string;
}

export interface WalletState {
  provider?: string | null;
  address: string | null;
  balance: string | null;
  network?: string | null;
  instance?: ethers.BrowserProvider | null;
  signer?: ethers.Signer | null;
  isConnecting?: boolean;
  error?: string | null;
}

interface AppState {
  // User & Auth
  user: User | null;
  isAuthenticated: boolean;

  // Wallet
  wallet: WalletState | null;

  // Portfolio
  portfolioValue: string;
  stakingRewards: string;

  // Transactions
  transactions: Transaction[];

  // Governance
  proposals: Proposal[];
  votingPower: string;

  // Notifications
  notifications: Notification[];

  // Security
  twoFactorEnabled: boolean;
  notificationSettings: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setWallet: (wallet: Partial<WalletState> | WalletState | null) => void;
  setPortfolioValue: (value: string) => void;
  setStakingRewards: (rewards: string) => void;
  addTransaction: (transaction: Transaction) => void;
  setTransactions: (transactions: Transaction[]) => void;
  addProposal: (proposal: Proposal) => void;
  setProposals: (proposals: Proposal[]) => void;
  setVotingPower: (power: string) => void;
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  setTwoFactorEnabled: (enabled: boolean) => void;
  setNotificationSettings: (settings: any) => void;

  // Analytics
  trackEvent: (eventName: string, properties?: any) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  wallet: null,
  portfolioValue: '0',
  stakingRewards: '0',
  transactions: [],
  proposals: [],
  votingPower: '0',
  notifications: [],
  twoFactorEnabled: false,
  notificationSettings: {
    email: true,
    push: false,
    sms: false,
  },

  // Actions
  setUser: (user) => set({ user }),
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  setWallet: (wallet) => set((state) => ({ wallet: wallet === null ? null : ({ ...((state.wallet ?? {}) as Partial<WalletState>), ...(wallet as Partial<WalletState>) } as WalletState) })),
  setPortfolioValue: (value) => set({ portfolioValue: value }),
  setStakingRewards: (rewards) => set({ stakingRewards: rewards }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions].slice(0, 50), // Keep last 50
    })),

  setTransactions: (transactions) => set({ transactions }),

  addProposal: (proposal) =>
    set((state) => ({
      proposals: [proposal, ...state.proposals],
    })),

  setProposals: (proposals) => set({ proposals }),
  setVotingPower: (power) => set({ votingPower: power }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 20), // Keep last 20
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  clearNotifications: () => set({ notifications: [] }),
  setTwoFactorEnabled: (enabled) => set({ twoFactorEnabled: enabled }),
  setNotificationSettings: (settings) =>
    set((state) => ({
      notificationSettings: { ...state.notificationSettings, ...settings },
    })),

  // Analytics placeholder
  trackEvent: (eventName, properties) => {
    console.log('Event:', eventName, properties);
    // TODO: Implement actual analytics tracking
  },
}));

// Mock data for development
export const initializeMockData = () => {
  const store = useAppStore.getState();

  // Mock transactions
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'receive',
      amount: '100',
      valueUSD: '125.50',
      timestamp: Date.now() - 86400000, // 1 day ago
      description: 'Staking Reward',
      hash: '0x123...abc',
    },
    {
      id: '2',
      type: 'send',
      amount: '50',
      valueUSD: '62.75',
      timestamp: Date.now() - 172800000, // 2 days ago
      description: 'Transfer to 0x456...def',
      hash: '0x456...def',
    },
    {
      id: '3',
      type: 'stake',
      amount: '200',
      valueUSD: '251.00',
      timestamp: Date.now() - 259200000, // 3 days ago
      description: 'Staked HH Tokens',
    },
  ];

  // Mock proposals
  const mockProposals: Proposal[] = [
    {
      id: '1',
      title: 'Increase Staking Rewards',
      description: 'Proposal to increase staking APY from 12.5% to 15%',
      status: 'active',
      votesFor: 1250,
      votesAgainst: 340,
      endTime: Date.now() + 604800000, // 7 days from now
      creator: '0x789...ghi',
    },
    {
      id: '2',
      title: 'Add New Solar Project',
      description: 'Fund new solar installation in Uttarakhand valley',
      status: 'passed',
      votesFor: 2100,
      votesAgainst: 150,
      endTime: Date.now() - 86400000, // Ended 1 day ago
      creator: '0xabc...jkl',
    },
  ];

  store.setTransactions(mockTransactions);
  store.setProposals(mockProposals);
  store.setPortfolioValue('5420.75');
  store.setStakingRewards('245.30');
  store.setVotingPower('1250');
};