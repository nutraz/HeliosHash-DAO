import { useCallback, useState } from 'react';
import { getRevocationActor } from '@/lib/canisters/revocation';

export function useRevocation() {
  const [revoked, setRevoked] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const actor = getRevocationActor();
      const list = await actor.listRevoked();
      setRevoked((list as string[]) || []);
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const revoke = useCallback(async (vcHash: string, issuer = 'web-ui') => {
    setLoading(true);
    setError(null);
    try {
      const actor = getRevocationActor();
      await actor.revoke(vcHash, issuer, BigInt(Math.floor(Date.now() / 1000)), 'revoked-from-ui');
      await fetchList();
      return true;
    } catch (e: any) {
      setError(String(e));
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchList]);

  return { revoked, loading, error, fetchList, revoke } as const;
}
