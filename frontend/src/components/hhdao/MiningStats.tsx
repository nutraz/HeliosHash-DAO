"use client";
import React, { useEffect, useState } from 'react';
import { hhdaoService } from '@/lib/api/hhdao';

export interface MiningStatsData {
  hashRate?: string;
  miners?: number;
  today_kWh?: number;
}

const DEFAULTS: MiningStatsData = {
  hashRate: '120 GH/s',
  miners: 8,
  today_kWh: 318
};

function timeoutPromise<T>(ms: number, value?: T): Promise<T> {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value as T), ms));
}

const MiningStats: React.FC = () => {
  // show static defaults immediately so render is synchronous and never blocks
  const [data, setData] = useState<MiningStatsData>(DEFAULTS);
  const [loading, setLoading] = useState<boolean>(false);
  const [stale, setStale] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setStale(false);

    // Primary attempt: try an internal API route first (fast, abortable)
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchTimeout = setTimeout(() => controller.abort(), 1200);

    fetch('/api/hhdao/mining-stats', { signal })
      .then(async (res) => {
        if (!mounted) return;
        if (!res.ok) throw new Error('non-OK');
        const json = await res.json();
        // expect { hashRate, miners, today_kWh }
        setData((prev) => ({ ...prev, ...(json || {}) }));
        setLoading(false);
      })
      .catch(async () => {
        // Primary fetch failed or no route -> try hhdaoService fallback but with a timeout
        try {
          // race the service call against a short timeout to avoid long hang
          const svcPromise = hhdaoService.getDashboardData();
          const result = await Promise.race([svcPromise, timeoutPromise(1500, null)]);
          if (!mounted) return;
          if (result && typeof result === 'object') {
            // Derive simple metrics from DashboardData if available
            const maybe = result as unknown;
            let projects: unknown[] = [];
            let devices: unknown[] = [];
            if (maybe && typeof maybe === 'object') {
              const obj = maybe as Record<string, unknown>;
              if (Array.isArray(obj.projects)) projects = obj.projects as unknown[];
              if (Array.isArray(obj.devices)) devices = obj.devices as unknown[];
            }
            setData((prev) => ({
              ...prev,
              hashRate: prev.hashRate, // no reliable hashRate from canister
              miners: (projects && projects.length) ? projects.length : prev.miners,
              today_kWh: (devices && devices.length) ? devices.length * 10 : prev.today_kWh
            }));
            setLoading(false);
            return;
          }

          // timed out or no useful result
          if (mounted) {
            setStale(true);
            setLoading(false);
          }
        } catch {
          if (mounted) {
            setStale(true);
            setLoading(false);
          }
        }
      })
      .finally(() => {
        clearTimeout(fetchTimeout);
      });

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return (
    <section className="bg-gray-800 p-4 rounded-md">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">Mining / Energy Stats</h3>
          <p className="text-sm text-gray-400">Hybrid: static first, then non-blocking fetch</p>
        </div>
        <div className="text-sm text-gray-300">{loading ? 'Refreshing…' : stale ? 'Stale' : 'Live'}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-gray-900 rounded">Hash rate: <span className="font-bold">{data.hashRate}</span></div>
        <div className="p-3 bg-gray-900 rounded">Miners: <span className="font-bold">{data.miners}</span></div>
        <div className="p-3 bg-gray-900 rounded">Today&apos;s kWh: <span className="font-bold">{data.today_kWh}</span></div>
      </div>

      <div className="mt-3 text-xs text-gray-400">This panel renders immediately with defaults and attempts a timed fetch. Failures are handled silently.</div>
    </section>
  );
};

export default MiningStats;
