// Lightweight API client for Helios#Baghpat project data.
// Tries to call an HTTP proxy endpoint (configure NEXT_PUBLIC_HELIOS_API),
// otherwise falls back to mocked data.

import { useState, useEffect } from 'react';

export interface LiveStats {
  solar_kwh: number;
  btc_mined: number;
  crop_yield_percent: number;
  members: number;
  updated_at: number;
}

// Minimal actor config and mining stats typings to reduce explicit `any` usage
export interface ActorConfig {
  canisterId: string;
  interfaceFactory: unknown;
  options?: { agent?: unknown };
}

export interface MiningStats {
  hashrate: number;
  powerConsumption: number;
  efficiency: number;
  temperature?: number;
}

const CACHE_TTL = 10_000; // ms

const mockStats: LiveStats = {
  solar_kwh: 248.3,
  btc_mined: 0.0032,
  crop_yield_percent: 87,
  members: 1825,
  updated_at: Date.now(),
};

function cacheKey(projectId: string) {
  return `helios_stats_${projectId}`;
}

export async function fetchLiveStats(
  projectId = "helios-baghpat",
  force = false
): Promise<LiveStats> {
  // Try in-memory/localStorage cache first
  try {
    const key = cacheKey(projectId);
    const raw =
      typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
    if (raw && !force) {
      const parsed = JSON.parse(raw) as LiveStats;
      if (Date.now() - parsed.updated_at < CACHE_TTL) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // Try direct canister actor call first using a programmatic IDL.
  // This avoids relying on generated bindings being present, but still
  // keeps the HTTP proxy and mock as fallbacks.
  try {
  const { Actor, HttpAgent } = await import("@dfinity/agent");
    // Import IDL builder (we only need it to construct an idlFactory function
    // which we pass to Actor.createActor — the real actor implementation may
    // ignore it in tests/mocks).
    const idlFactory = ({ IDL: _IDL }: { IDL: unknown }) => {
      // We keep this dynamic because Candid IDL builders have complex types
      // which are awkward to express here. Narrow locally to `any` for the
      // builder implementation only.
      const _ = _IDL as any;
      const ProjectStats = _.Record({
        efficiency_percentage: _.Nat,
        last_production_date: _.Opt(_.Int),
        operational_days: _.Nat,
        revenue_generated_usd: _.Nat,
        total_energy_kwh: _.Nat,
      });
      const Result4 = _.Variant({ err: _.Text, ok: ProjectStats });
      return _.Service({
        get_project_stats: _.Func([_.Text], [Result4], ["query"]),
      });
    };

    // Create an HttpAgent and, if available on the client, attempt to wire an
    // authenticated identity from @dfinity/auth-client. If not authenticated
    // or unavailable, fall back to an unauthenticated agent.
    let agent: unknown = new HttpAgent({
      host: process.env.NEXT_PUBLIC_IC_HOST || undefined,
    });
    try {
      if (typeof window !== "undefined") {
        const { AuthClient } = await import("@dfinity/auth-client");
        const authClient = await AuthClient.create();
        if (await authClient.isAuthenticated()) {
          const identity = await authClient.getIdentity();
          agent = new HttpAgent({
            host: process.env.NEXT_PUBLIC_IC_HOST || undefined,
            identity,
          });
        }
      }
    } catch {
      // if auth-client isn't available or not authenticated, continue with unauthenticated agent
    }

    const canisterId = process.env.NEXT_PUBLIC_PROJECT_HUB_CANISTER_ID;
    if (canisterId) {
      const actor = Actor.createActor(idlFactory, { agent: agent as any, canisterId });
      if (actor && typeof (actor as unknown as { get_project_stats?: Function }).get_project_stats === "function") {
        const res: unknown = await (actor as unknown as any).get_project_stats(projectId);
        if (res && typeof res === 'object' && 'ok' in (res as Record<string, unknown>)) {
          const proj = (res as any).ok as Record<string, unknown>;
          const stats: LiveStats = {
            solar_kwh: Number((proj.total_energy_kwh as unknown) as number) || mockStats.solar_kwh,
            btc_mined: 0,
            crop_yield_percent: Number((proj.efficiency_percentage as unknown) as number) || mockStats.crop_yield_percent,
            members: Number((proj.operational_days as unknown) as number) || mockStats.members,
            updated_at: Date.now(),
          };
          try {
            window.localStorage.setItem(
              cacheKey(projectId),
              JSON.stringify(stats)
            );
          } catch {}
          return stats;
        }
      }
    }
  } catch {
    // ignore actor errors and fallback to proxy/mock
    // console.debug('actor call failed')
  }

  // If WebSocket push endpoint provided, we don't need to fetch here — but keep HTTP fallback
  const base = process.env.NEXT_PUBLIC_HELIOS_API;
  if (base) {
    try {
      const res = await fetch(
        `${base.replace(/\/$/, "")}/projects/${projectId}/stats`,
        {
          headers: { Accept: "application/json" },
        }
      );
      if (!res.ok) throw new Error("Network error");
      const body = await res.json();
      const stats: LiveStats = {
        solar_kwh: Number(body.solar_kwh) || 0,
        btc_mined: Number(body.btc_mined) || 0,
        crop_yield_percent: Number(body.crop_yield_percent) || 0,
        members: Number(body.members) || 0,
        updated_at: Date.now(),
      };
      try {
        window.localStorage.setItem(cacheKey(projectId), JSON.stringify(stats));
      } catch {}
      return stats;
    } catch {
      // fallback to mock on error
      return { ...mockStats, updated_at: Date.now() };
    }
  }

  // No proxy configured — return mock data
  return { ...mockStats, updated_at: Date.now() };
}

// React hook for polling + caching
export function useHeliosLiveStats(
  projectId = "helios-baghpat",
  intervalMs = 10_000
) {
  const [data, setData] = useState<LiveStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    // Setup BroadcastChannel to sync across tabs
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        // Use the DOM BroadcastChannel directly. In test environments jsdom
        // will provide a polyfill (we set that up in tests). Cast locally to
        // `any` to avoid the lint rule complaining about DOM-lib mismatch.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bc = new (BroadcastChannel as any)('helios_stats')
        if (bc) {
          bc.onmessage = (ev: MessageEvent) => {
            try {
              const msg = ev.data;
              if (msg?.projectId === projectId && msg?.stats) {
                if (!mounted) return;
                setData(msg.stats);
                setLoading(false);
              }
            } catch {
              // ignore
            }
          };
        }
      }
    } catch {
      bc = null;
    }

    // Optionally connect to websocket push endpoint with simple reconnection/backoff
    let ws: WebSocket | null = null;
    let reconnectTimer: number | null = null;
    let reconnectAttempts = 0;
    const maxReconnect = 6;
    const baseReconnectMs = 1000;

    const openWs = () => {
      try {
        const wsUrl = process.env.NEXT_PUBLIC_HELIOS_WS;
        if (wsUrl && typeof window !== "undefined") {
          ws = new WebSocket(wsUrl);
          ws.onopen = () => {
            reconnectAttempts = 0;
          };
          ws.onmessage = (evt) => {
            try {
              const payload = JSON.parse(evt.data);
              if (payload?.projectId === projectId && payload?.stats) {
                if (!mounted) return;
                setData(payload.stats);
                setLoading(false);
                try {
                  window.localStorage.setItem(
                    cacheKey(projectId),
                    JSON.stringify(payload.stats)
                  );
                } catch {}
              }
            } catch {
              // ignore
            }
          };
          ws.onclose = () => {
            ws = null;
            if (!mounted) return;
            if (reconnectAttempts < maxReconnect) {
              const delay = Math.min(
                30000,
                baseReconnectMs * 2 ** reconnectAttempts
              );
              reconnectAttempts += 1;
              reconnectTimer = window.setTimeout(() => {
                reconnectTimer = null;
                openWs();
              }, delay);
            }
          };
          ws.onerror = () => {
            // let onclose handle reconnect
          };
        }
      } catch {
        ws = null;
      }
    };
    openWs();

    async function load() {
      setLoading(true);
      try {
        const stats = await fetchLiveStats(projectId);
        if (!mounted) return;
        setData(stats);
        setError(null);
        // Broadcast to other tabs
        if (bc) {
          try {
            bc.postMessage({ projectId, stats });
          } catch {}
        }
      } catch (_e: any) {
        if (!mounted) return;
        setError(_e);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();
    const t = setInterval(load, intervalMs);
    return () => {
      mounted = false;
      clearInterval(t);
      try {
        if (bc) bc.close();
      } catch {}
      try {
        if (ws) ws.close();
      } catch {}
      try {
        if (reconnectTimer) window.clearTimeout(reconnectTimer);
      } catch {}
    };
  }, [projectId, intervalMs]);

  return { data, loading, error };
}
