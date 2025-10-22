import { ServiceFactory } from '@/services/factory';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from './useQuery';

interface MutationCallbacks<TData = any, TVariables = any> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  onSettled?: () => void;
}

type WalletBalanceShape =
  | {
      balance: number;
      pendingRewards: number;
      stakedAmount: number;
      [k: string]: any;
    }
  | undefined;

// Enhanced staking mutation with validation & optimistic updates
export function useStakeMutation(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amount: number) => {
      if (amount <= 0) throw new Error('Stake amount must be positive');
      const walletService = ServiceFactory.getWalletService();
      const current = await walletService.getBalance();
      if (current.balance < amount) throw new Error('Insufficient balance for staking');
      return {
        success: true,
        amount,
        newBalance: current.balance - amount,
        newStakedAmount: current.stakedAmount + amount,
        timestamp: Date.now(),
      };
    },
    onMutate: async (amount) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wallet.balance });
      const previousData = queryClient.getQueryData<WalletBalanceShape>(queryKeys.wallet.balance);
      if (previousData) {
        queryClient.setQueryData(queryKeys.wallet.balance, {
          ...previousData,
          balance: previousData.balance - amount,
          stakedAmount: previousData.stakedAmount + amount,
        });
      }
      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.wallet.balance, context.previousData);
      }
      options.onError?.(error as Error, variables);
    },
    onSuccess: (data, variables) => {
      options.onSuccess?.(data, variables);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance });
      options.onSettled?.();
    },
  });
}

// Enhanced claim rewards mutation
export function useClaimRewardsMutation(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const walletService = ServiceFactory.getWalletService();
      const current = await walletService.getBalance();
      if (current.pendingRewards <= 0) throw new Error('No rewards available to claim');
      return {
        success: true,
        amount: current.pendingRewards,
        newBalance: current.balance + current.pendingRewards,
        newPendingRewards: 0,
        timestamp: Date.now(),
      };
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wallet.balance });
      const previousData = queryClient.getQueryData<WalletBalanceShape>(queryKeys.wallet.balance);
      if (previousData) {
        queryClient.setQueryData(queryKeys.wallet.balance, {
          ...previousData,
          balance: previousData.balance + previousData.pendingRewards,
          pendingRewards: 0,
        });
      }
      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.wallet.balance, context.previousData);
      }
      options.onError?.(error as Error, variables);
    },
    onSuccess: (data, variables) => {
      options.onSuccess?.(data, variables);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance });
      queryClient.invalidateQueries({ queryKey: queryKeys.rewards.summary });
      options.onSettled?.();
    },
  });
}

// Enhanced unstake mutation
export function useUnstakeMutation(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amount: number) => {
      if (amount <= 0) throw new Error('Unstake amount must be positive');
      const walletService = ServiceFactory.getWalletService();
      const current = await walletService.getBalance();
      if (current.stakedAmount < amount)
        throw new Error('Insufficient staked amount for unstaking');
      return {
        success: true,
        amount,
        newBalance: current.balance + amount,
        newStakedAmount: current.stakedAmount - amount,
        timestamp: Date.now(),
      };
    },
    onMutate: async (amount) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wallet.balance });
      const previousData = queryClient.getQueryData<WalletBalanceShape>(queryKeys.wallet.balance);
      if (previousData) {
        queryClient.setQueryData(queryKeys.wallet.balance, {
          ...previousData,
          balance: previousData.balance + amount,
          stakedAmount: previousData.stakedAmount - amount,
        });
      }
      return { previousData };
    },
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKeys.wallet.balance, context.previousData);
      }
      options.onError?.(error as Error, variables);
    },
    onSuccess: (data, variables) => {
      options.onSuccess?.(data, variables);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wallet.balance });
      options.onSettled?.();
    },
  });
}
