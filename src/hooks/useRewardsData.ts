import { ServiceFactory } from '@/services/factory';
import type { RewardsSource, RewardsData as ServiceRewardsData } from '@/services/types';
import { useCallback, useEffect, useState } from 'react';

export interface UseRewardsDataResult {
  summary: ServiceRewardsData | null;
  sources: RewardsSource[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRewardsData(): UseRewardsDataResult {
  const [summary, setSummary] = useState<ServiceRewardsData | null>(null);
  const [sources, setSources] = useState<RewardsSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rewardsService = ServiceFactory.getRewardsService();
      const [summaryData, sourcesData] = await Promise.all([
        rewardsService.getRewardsSummary(),
        rewardsService.getRewardsBySource(),
      ]);
      setSummary(summaryData);
      setSources(sourcesData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load rewards data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { summary, sources, isLoading, error, refetch: fetchData };
}
