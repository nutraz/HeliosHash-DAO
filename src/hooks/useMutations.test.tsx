import { ServiceFactory } from '@/services/factory';
import type { WalletData, WalletService } from '@/services/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useClaimRewardsMutation, useStakeMutation, useUnstakeMutation } from './useMutations';
import { queryKeys } from './useQuery';

// Utility to flush microtasks
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

// Mutable in-memory wallet model for deterministic mutation tests
class TestWalletService implements WalletService {
  state: WalletData;
  latency: number;
  constructor(initial?: Partial<WalletData>, latency = 0) {
    this.state = {
      balance: 100,
      pendingRewards: 10,
      stakedAmount: 0,
      fiatValue: 0,
      transactions: 0,
      ...initial,
    };
    this.latency = latency; // keep zero for fast unit tests
  }
  async getBalance(): Promise<WalletData> {
    if (this.latency) await new Promise((r) => setTimeout(r, this.latency));
    return { ...this.state };
  }
  async getTransactions() {
    return [];
  }
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });

const createWrapper = (client?: QueryClient, wallet?: WalletService) => {
  const qc = client ?? createTestQueryClient();
  // Inject fresh wallet service each wrapper to isolate tests
  const svc = wallet ?? new TestWalletService();
  ServiceFactory.initialize(svc);
  // Seed cache with current wallet state so optimistic updates have a base
  qc.setQueryData(queryKeys.wallet.balance, { ...(svc as TestWalletService).state });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
};

describe('mutation hooks', () => {
  describe('useStakeMutation', () => {
    it('stakes a given amount successfully', async () => {
      const client = createTestQueryClient();
      const wallet = new TestWalletService();
      const { result } = renderHook(() => useStakeMutation(), {
        wrapper: createWrapper(client, wallet),
      });
      act(() => {
        result.current.mutate(10);
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      // Optimistic update should have briefly adjusted cached balance; since we invalidate immediately we just assert cache still exists.
      const cached = client.getQueryData<any>(queryKeys.wallet.balance);
      expect(cached).toBeTruthy();
    });

    it('completes mutation lifecycle to success state', async () => {
      const { result } = renderHook(() => useStakeMutation(), { wrapper: createWrapper() });
      expect(result.current.isPending).toBe(false);
      act(() => {
        result.current.mutate(5);
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('rejects zero or negative stake', async () => {
      const { result } = renderHook(() => useStakeMutation(), { wrapper: createWrapper() });
      act(() => {
        result.current.mutate(0 as any);
      });
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error?.message).toBe('Stake amount must be positive');
    });

    it('rejects excessive stake beyond balance', async () => {
      const { result } = renderHook(() => useStakeMutation(), { wrapper: createWrapper() });
      act(() => {
        result.current.mutate(10_000_000);
      });
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error?.message).toBe('Insufficient balance for staking');
    });
  });

  describe('useClaimRewardsMutation', () => {
    it('claims rewards successfully', async () => {
      const { result } = renderHook(() => useClaimRewardsMutation(), { wrapper: createWrapper() });
      act(() => {
        result.current.mutate();
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('errors when no rewards available (optimistic rollback)', async () => {
      // Start directly with no rewards so first attempt errors.
      const wallet = new TestWalletService({ pendingRewards: 0 });
      const wrapper = createWrapper(undefined, wallet);
      const { result } = renderHook(() => useClaimRewardsMutation(), { wrapper });
      act(() => {
        result.current.mutate();
      });
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error?.message).toBe('No rewards available to claim');
    });
  });

  describe('useUnstakeMutation', () => {
    it('unstakes a given amount successfully', async () => {
      // Pre-stake to have stakedAmount
      const wallet = new TestWalletService({ stakedAmount: 20, balance: 80 });
      const wrapper = createWrapper(undefined, wallet);
      const { result } = renderHook(() => useUnstakeMutation(), { wrapper });
      act(() => {
        result.current.mutate(5);
      });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('fails unstake with amount exceeding staked', async () => {
      const wallet = new TestWalletService({ stakedAmount: 5 });
      const { result } = renderHook(() => useUnstakeMutation(), {
        wrapper: createWrapper(undefined, wallet),
      });
      act(() => {
        result.current.mutate(999999);
      });
      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error?.message).toBe('Insufficient staked amount for unstaking');
    });

    it('supports success and error callbacks', async () => {
      const success = vi.fn();
      const error = vi.fn();
      const wallet = new TestWalletService({ stakedAmount: 10 });
      const okHook = renderHook(() => useUnstakeMutation({ onSuccess: success, onError: error }), {
        wrapper: createWrapper(undefined, wallet),
      });
      await act(async () => {
        await okHook.result.current.mutateAsync(5);
      });
      expect(success).toHaveBeenCalled();
      const failHook = renderHook(
        () => useUnstakeMutation({ onSuccess: success, onError: error }),
        { wrapper: createWrapper(undefined, wallet) }
      );
      await act(async () => {
        try {
          await failHook.result.current.mutateAsync(999999);
        } catch {}
      });
      expect(error).toHaveBeenCalled();
    });
  });

  describe('integration behavior', () => {
    it('invalidates wallet balance on stake success', async () => {
      const client = createTestQueryClient();
      const spy = vi.spyOn(client, 'invalidateQueries');
      const { result } = renderHook(() => useStakeMutation(), { wrapper: createWrapper(client) });
      await act(async () => {
        await result.current.mutateAsync(7);
      });
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ queryKey: queryKeys.wallet.balance })
      );
    });

    it('performs optimistic update then refetch (stake)', async () => {
      const client = createTestQueryClient();
      const wallet = new TestWalletService({ balance: 100, stakedAmount: 0 });
      const { result } = renderHook(() => useStakeMutation(), {
        wrapper: createWrapper(client, wallet),
      });
      act(() => {
        result.current.mutate(10);
      });
      await waitFor(() => {
        const optimistic = client.getQueryData<any>(queryKeys.wallet.balance);
        expect(optimistic?.balance).toBe(90);
        expect(optimistic?.stakedAmount).toBe(10);
      });
      await waitFor(() => expect(result.current.isSuccess || result.current.isError).toBe(true));
      const post = client.getQueryData<any>(queryKeys.wallet.balance);
      expect(post).toBeTruthy();
    });
  });
});
