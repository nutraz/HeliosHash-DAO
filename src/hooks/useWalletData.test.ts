import { act, renderHook } from '@testing-library/react';
import { ServiceFactory } from '../services/factory';
import type { WalletData, WalletService } from '../services/types';
import { useWalletData } from './useWalletData';

class MockWalletService implements WalletService {
  async getBalance(): Promise<WalletData> {
    return {
      balance: 100,
      pendingRewards: 5,
      stakedAmount: 50,
      fiatValue: 15000,
      transactions: 10,
    };
  }
  async getTransactions() {
    return [];
  }
}

class FailingWalletService implements WalletService {
  async getBalance(): Promise<WalletData> {
    throw new Error('Network error');
  }
  async getTransactions() {
    return [];
  }
}

class TrackingWalletService implements WalletService {
  private call = 0;
  async getBalance(): Promise<WalletData> {
    this.call++;
    return {
      balance: 100 + this.call,
      pendingRewards: 5,
      stakedAmount: 50,
      fiatValue: 15000,
      transactions: 10,
    };
  }
  async getTransactions() {
    return [];
  }
}

describe('useWalletData', () => {
  beforeEach(() => {
    ServiceFactory.reset();
  });

  it('returns initial loading state', () => {
    const { result } = renderHook(() => useWalletData());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('resolves wallet data', async () => {
    ServiceFactory.initialize(new MockWalletService());
    const { result } = renderHook(() => useWalletData());
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toMatchObject({ balance: 100, pendingRewards: 5 });
  });

  it('handles errors', async () => {
    ServiceFactory.initialize(new FailingWalletService());
    const { result } = renderHook(() => useWalletData());
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Network error');
    expect(result.current.data).toBeNull();
  });

  it('refetch updates data', async () => {
    ServiceFactory.initialize(new TrackingWalletService());
    const { result } = renderHook(() => useWalletData());
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.data?.balance).toBe(101);
    await act(async () => {
      await result.current.refetch();
    });
    expect(result.current.data?.balance).toBe(102);
  });
});
