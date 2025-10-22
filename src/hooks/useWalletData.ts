import { ServiceFactory } from '@/services/factory';
import type { WalletData as ServiceWalletData } from '@/services/types';
import { useCallback, useEffect, useState } from 'react';

export interface UseWalletDataResult {
  data: ServiceWalletData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWalletData(): UseWalletDataResult {
  const [data, setData] = useState<ServiceWalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const balance = await ServiceFactory.getWalletService().getBalance();
      // Potential future parallel fetch: transactions detail list separate from summary
      setData(balance);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load wallet data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
