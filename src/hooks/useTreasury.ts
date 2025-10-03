import { ServiceFactory } from '@/services/factory';
import { useQuery } from '@tanstack/react-query';

export const treasuryQueryKeys = {
  meta: ['treasury', 'meta'] as const,
  balance: (principal: string) => ['treasury', 'balance', principal] as const,
};

export function useTreasuryMeta() {
  return useQuery({
    queryKey: treasuryQueryKeys.meta,
    queryFn: () => ServiceFactory.getTreasuryService().getMeta(),
    staleTime: 30_000,
  });
}

export function useTreasuryBalance(principal: string | undefined) {
  return useQuery({
    queryKey: treasuryQueryKeys.balance(principal || 'anonymous'),
    enabled: !!principal,
    queryFn: () => ServiceFactory.getTreasuryService().getBalance(principal!),
    staleTime: 15_000,
  });
}
