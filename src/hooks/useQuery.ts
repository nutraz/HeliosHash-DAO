import { ServiceFactory } from '@/services/factory';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const queryKeys = {
  wallet: {
    balance: ['wallet', 'balance'] as const,
    transactions: ['wallet', 'transactions'] as const,
  },
  rewards: {
    summary: ['rewards', 'summary'] as const,
    sources: ['rewards', 'sources'] as const,
  },
};

export function useWalletBalance() {
  return useQuery({
    queryKey: queryKeys.wallet.balance,
    queryFn: () => ServiceFactory.getWalletService().getBalance(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useWalletTransactions() {
  return useQuery({
    queryKey: queryKeys.wallet.transactions,
    queryFn: () => ServiceFactory.getWalletService().getTransactions(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

export function useRewardsSummary() {
  return useQuery({
    queryKey: queryKeys.rewards.summary,
    queryFn: () => ServiceFactory.getRewardsService().getRewardsSummary(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useRewardsSources() {
  return useQuery({
    queryKey: queryKeys.rewards.sources,
    queryFn: () => ServiceFactory.getRewardsService().getRewardsBySource(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInvalidateQueries() {
  const queryClient = useQueryClient();
  return {
    invalidateWallet: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance });
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.transactions });
    },
    invalidateRewards: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rewards.summary });
      queryClient.invalidateQueries({ queryKey: queryKeys.rewards.sources });
    },
    invalidateAll: () => queryClient.invalidateQueries(),
  };
}
