import { useCallback, useEffect, useState } from 'react';
import { getAuditLogActor } from '@/lib/canisters/auditLog';

export function useAuditLog() {
  const [logs, setLogs] = useState<Array<{ id: number; text: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTail = useCallback(async (limit = 20) => {
    setLoading(true);
    setError(null);
    try {
      const actor = getAuditLogActor();
      const res = await actor.tail(BigInt(limit));
      // candid returns vec of records: record { nat; text }
      const parsed = (res as any[]).map((r) => ({ id: Number(r[0]), text: String(r[1]) }));
      setLogs(parsed);
    } catch (e: any) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const append = useCallback(async (text: string) => {
    setLoading(true);
    setError(null);
    try {
      const actor = getAuditLogActor();
      const id = await actor.append(text);
      await fetchTail();
      return Number(id);
    } catch (e: any) {
      setError(String(e));
      return null;
    } finally {
      setLoading(false);
    }
  }, [fetchTail]);

  useEffect(() => { fetchTail(); }, [fetchTail]);

  return { logs, loading, error, fetchTail, append } as const;
}
