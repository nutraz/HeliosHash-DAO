import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { useCallback, useEffect, useState } from 'react';

// Import generated canister interface (will be created after dfx deploy)
// import { hhdao_compute } from '../declarations/hhdao_compute';

interface ComputeStats {
  mode: 'Bitcoin' | 'AI' | 'Hybrid';
  hashRate: number;
  aiWorkloads: number;
  powerConsumption: number;
  efficiency: number;
  revenue: number;
  lastUpdated: bigint;
}

interface PivotDecision {
  trigger: string;
  threshold: number;
  newMode: 'Bitcoin' | 'AI' | 'Hybrid';
  estimatedImpact: number;
  timestamp: bigint;
}

interface PivotRecommendation {
  recommendedMode: 'Bitcoin' | 'AI' | 'Hybrid';
  reason: string;
  estimatedGain: number;
  confidence: number;
}

interface ComputeStatus {
  mode: 'Bitcoin' | 'AI' | 'Hybrid';
  stats: ComputeStats | null;
  pivotHistory: [bigint, PivotDecision][];
}

interface HealthStatus {
  status: string;
  activeUsers: bigint;
  totalHashRate: number;
  totalAIWorkloads: bigint;
  averageEfficiency: number;
}

export const useCompute = () => {
  const [computeStatus, setComputeStatus] = useState<ComputeStatus | null>(null);
  const [recommendations, setRecommendations] = useState<PivotRecommendation[]>([]);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize canister connection
  const [computeActor, setComputeActor] = useState<any>(null);

  useEffect(() => {
    const initializeActor = async () => {
      try {
        // In production, this would use the actual canister ID
        const canisterId =
          process.env.NEXT_PUBLIC_COMPUTE_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai';

        const agent = new HttpAgent({
          host:
            process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://ic0.app',
        });

        // For development, fetch root key
        if (process.env.NODE_ENV === 'development') {
          await agent.fetchRootKey();
        }

        // Create actor (using mock interface for now)
        const actor = Actor.createActor(idlFactory, {
          agent,
          canisterId: Principal.fromText(canisterId),
        });

        setComputeActor(actor);
      } catch (err) {
        console.error('Failed to initialize compute actor:', err);
        setError('Failed to connect to compute canister');
      }
    };

    initializeActor();
  }, []);

  // Pivot compute mode
  const pivotComputeMode = useCallback(
    async (targetMode: string, trigger: string, threshold: number): Promise<boolean> => {
      if (!computeActor) {
        setError('Compute actor not initialized');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await computeActor.pivotComputeMode(targetMode, trigger, threshold);

        if ('ok' in result) {
          // Refresh status after successful pivot
          await fetchComputeStatus();
          return result.ok;
        } else {
          setError(result.err);
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Pivot failed');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [computeActor]
  );

  // Update compute statistics
  const updateComputeStats = useCallback(
    async (
      hashRate: number,
      aiWorkloads: number,
      powerConsumption: number,
      revenue: number
    ): Promise<boolean> => {
      if (!computeActor) {
        setError('Compute actor not initialized');
        return false;
      }

      try {
        const result = await computeActor.updateComputeStats(
          hashRate,
          BigInt(aiWorkloads),
          powerConsumption,
          revenue
        );

        if ('ok' in result) {
          await fetchComputeStatus();
          return true;
        } else {
          setError(result.err);
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Update failed');
        return false;
      }
    },
    [computeActor]
  );

  // Fetch current compute status
  const fetchComputeStatus = useCallback(
    async (userPrincipal?: string) => {
      if (!computeActor) return;

      try {
        const user = userPrincipal ? [Principal.fromText(userPrincipal)] : [];
        const status = await computeActor.getComputeStatus(user);
        setComputeStatus(status);
      } catch (err) {
        console.error('Failed to fetch compute status:', err);
        setError('Failed to fetch status');
      }
    },
    [computeActor]
  );

  // Get pivot recommendations
  const fetchRecommendations = useCallback(async () => {
    if (!computeActor) return;

    try {
      const recs = await computeActor.getPivotRecommendations();
      setRecommendations(recs);
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
      setError('Failed to fetch recommendations');
    }
  }, [computeActor]);

  // Get system health
  const fetchHealthStatus = useCallback(async () => {
    if (!computeActor) return;

    try {
      const health = await computeActor.healthCheck();
      setHealthStatus(health);
    } catch (err) {
      console.error('Failed to fetch health status:', err);
      setError('Failed to fetch health status');
    }
  }, [computeActor]);

  // Emergency shutdown
  const emergencyShutdown = useCallback(
    async (reason: string): Promise<boolean> => {
      if (!computeActor) {
        setError('Compute actor not initialized');
        return false;
      }

      setLoading(true);
      try {
        const result = await computeActor.emergencyShutdown(reason);
        if (result) {
          await fetchComputeStatus();
          await fetchHealthStatus();
        }
        return result;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Shutdown failed');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [computeActor, fetchComputeStatus, fetchHealthStatus]
  );

  // Auto-refresh data
  useEffect(() => {
    if (!computeActor) return;

    const interval = setInterval(() => {
      fetchComputeStatus();
      fetchRecommendations();
      fetchHealthStatus();
    }, 30000); // Refresh every 30 seconds

    // Initial fetch
    fetchComputeStatus();
    fetchRecommendations();
    fetchHealthStatus();

    return () => clearInterval(interval);
  }, [computeActor, fetchComputeStatus, fetchRecommendations, fetchHealthStatus]);

  return {
    // State
    computeStatus,
    recommendations,
    healthStatus,
    loading,
    error,

    // Actions
    pivotComputeMode,
    updateComputeStats,
    fetchComputeStatus,
    fetchRecommendations,
    fetchHealthStatus,
    emergencyShutdown,

    // Utilities
    isConnected: !!computeActor,
  };
};

// Mock IDL factory (replace with actual generated interface)
const idlFactory = ({ IDL }: any) => {
  const ComputeMode = IDL.Variant({
    Bitcoin: IDL.Null,
    AI: IDL.Null,
    Hybrid: IDL.Null,
  });

  const ComputeStats = IDL.Record({
    mode: ComputeMode,
    hashRate: IDL.Float64,
    aiWorkloads: IDL.Nat,
    powerConsumption: IDL.Float64,
    efficiency: IDL.Float64,
    revenue: IDL.Float64,
    lastUpdated: IDL.Int,
  });

  const PivotDecision = IDL.Record({
    trigger: IDL.Text,
    threshold: IDL.Float64,
    newMode: ComputeMode,
    estimatedImpact: IDL.Float64,
    timestamp: IDL.Int,
  });

  return IDL.Service({
    pivotComputeMode: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Float64],
      [IDL.Variant({ ok: IDL.Bool, err: IDL.Text })],
      []
    ),
    updateComputeStats: IDL.Func(
      [IDL.Float64, IDL.Nat, IDL.Float64, IDL.Float64],
      [IDL.Variant({ ok: IDL.Null, err: IDL.Text })],
      []
    ),
    getComputeStatus: IDL.Func(
      [IDL.Opt(IDL.Principal)],
      [
        IDL.Record({
          mode: ComputeMode,
          stats: IDL.Opt(ComputeStats),
          pivotHistory: IDL.Vec(IDL.Tuple(IDL.Nat, PivotDecision)),
        }),
      ],
      ['query']
    ),
    getPivotRecommendations: IDL.Func(
      [],
      [
        IDL.Vec(
          IDL.Record({
            recommendedMode: ComputeMode,
            reason: IDL.Text,
            estimatedGain: IDL.Float64,
            confidence: IDL.Float64,
          })
        ),
      ],
      ['query']
    ),
    healthCheck: IDL.Func(
      [],
      [
        IDL.Record({
          status: IDL.Text,
          activeUsers: IDL.Nat,
          totalHashRate: IDL.Float64,
          totalAIWorkloads: IDL.Nat,
          averageEfficiency: IDL.Float64,
        }),
      ],
      ['query']
    ),
    emergencyShutdown: IDL.Func([IDL.Text], [IDL.Bool], []),
  });
};
