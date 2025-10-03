import { getHealthSnapshot, HealthSnapshot } from '@/services/healthService';
import { useQuery } from '@tanstack/react-query';

export function useCanisterHealth(options?: { refetchInterval?: number }) {
  return useQuery<HealthSnapshot, Error>({
    queryKey: ['canister-health'],
    queryFn: () => getHealthSnapshot(),
    refetchInterval: options?.refetchInterval ?? 60_000, // 1 min
    staleTime: 30_000,
  });
}
