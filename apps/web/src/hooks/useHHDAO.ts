"use client"

import { useState, useEffect } from 'react';
import { hhdaoService } from '@/lib/api/hhdao';

export interface Document {
  id: string;
  documentType?: string;
  url?: string;
  title?: string;
  // Common optional fields used in dashboard rendering
  image?: string;
  status?: string;
  name?: string;
}

export interface Device {
  id: string;
  type?: string;
  status?: string;
}

export interface UserProfile {
  principal: string;
  username?: string;
  displayName?: string;
  tier?: number;
}

export interface DashboardData {
  projects: Project[];
  documents: Document[];
  userProfile?: UserProfile[];
  devices: Device[];
}

// Wallet and context typing for consumers that may integrate wallets
export interface WalletState {
  isConnected: boolean;
  principal?: string;
  accountId?: string;
}

export interface HHDAOContextType {
  wallet: WalletState;
  connectWallet: (options?: { provider?: string }) => Promise<void>;
  disconnectWallet: () => void;
}

export interface Project {
  id: bigint;
  title: string;
  description: string;
  status: string;
  createdAt: bigint;
  updatedAt: bigint;
  budget?: bigint;
  location?: string;
}

export function useHHDAO() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = (await hhdaoService.getDashboardData()) as DashboardData;
      setDashboardData(data);
    } catch (_err) {
      setError(_err instanceof Error ? _err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = (await hhdaoService.getProjects()) as Project[];
      setProjects(data);
    } catch (_err) {
      setError(_err instanceof Error ? _err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const getProject = async (id: bigint) => {
    try {
      setLoading(true);
      setError(null);
      const project = (await hhdaoService.getProject(id)) as Project | null;
      return project;
    } catch (_err) {
      setError(_err instanceof Error ? _err.message : 'Failed to fetch project');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createProposal = async (proposalData: {
    title: string;
    description: string;
    category: { Governance: null } | { Project: null } | { Treasury: null };
    votesRequired: bigint;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const result = await hhdaoService.createProposal(proposalData);
      return result;
    } catch (_err) {
      setError(_err instanceof Error ? _err.message : 'Failed to create proposal');
      throw _err;
    } finally {
      setLoading(false);
    }
  };

  const getCyclesBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const balance = await hhdaoService.getCyclesBalance();
      return balance;
    } catch (_err) {
      setError(_err instanceof Error ? _err.message : 'Failed to fetch cycles balance');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-fetch dashboard data on mount
    fetchDashboardData();
    fetchProjects();
  }, []);

  return {
    dashboardData,
    projects,
    loading,
    error,
    fetchDashboardData,
    fetchProjects,
    getProject,
    createProposal,
    getCyclesBalance,
    refetch: () => {
      fetchDashboardData();
      fetchProjects();
    }
  };
}