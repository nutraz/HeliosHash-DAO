import { act, renderHook } from '@testing-library/react';
import { ServiceFactory } from '../services/factory';
import type { RewardsData, RewardsService, RewardsSource } from '../services/types';
import { useRewardsData } from './useRewardsData';

class MockRewardsService implements RewardsService {
  async getRewardsSummary(): Promise<RewardsData> {
    return { totalEarned: 200, thisMonth: 30, lastMonth: 40, projected: 35 };
  }
  async getRewardsBySource(): Promise<RewardsSource[]> {
    return [
      { name: 'Mining', amount: 150, percentage: 60 },
      { name: 'Staking', amount: 75, percentage: 30 },
      { name: 'Community', amount: 25, percentage: 10 },
    ];
  }
}

class FailingRewardsService implements RewardsService {
  async getRewardsSummary(): Promise<RewardsData> {
    throw new Error('Network error');
  }
  async getRewardsBySource(): Promise<RewardsSource[]> {
    return [];
  }
}

class TrackingRewardsService implements RewardsService {
  private call = 0;
  async getRewardsSummary(): Promise<RewardsData> {
    this.call++;
    return { totalEarned: 200 + this.call, thisMonth: 30, lastMonth: 40, projected: 35 };
  }
  async getRewardsBySource(): Promise<RewardsSource[]> {
    return [
      { name: 'Mining', amount: 150, percentage: 60 },
      { name: 'Staking', amount: 75, percentage: 30 },
      { name: 'Community', amount: 25, percentage: 10 },
    ];
  }
}

describe('useRewardsData', () => {
  beforeEach(() => {
    ServiceFactory.reset();
  });

  it('returns initial loading state', () => {
    const { result } = renderHook(() => useRewardsData());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.summary).toBeNull();
    expect(result.current.sources).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });

  it('resolves rewards data', async () => {
    ServiceFactory.initialize(undefined, new MockRewardsService());
    const { result } = renderHook(() => useRewardsData());
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.summary?.totalEarned).toBe(200);
    expect(result.current.sources.length).toBe(3);
  });

  it('handles errors', async () => {
    ServiceFactory.initialize(undefined, new FailingRewardsService());
    const { result } = renderHook(() => useRewardsData());
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Network error');
    expect(result.current.summary).toBeNull();
  });

  it('refetch updates data', async () => {
    ServiceFactory.initialize(undefined, new TrackingRewardsService());
    const { result } = renderHook(() => useRewardsData());
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.summary?.totalEarned).toBe(201);
    await act(async () => {
      await result.current.refetch();
    });
    expect(result.current.summary?.totalEarned).toBe(202);
  });
});
