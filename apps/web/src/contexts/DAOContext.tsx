'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { daoService, type Proposal as ServiceProposal, type ContributionType } from '../services/daoService';

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'passed' | 'failed' | 'pending';
  creator: string;
  createdAt: Date;
  endDate: Date;
  votesFor: number;
  votesAgainst: number;
  totalVotes: number;
}

interface Vote {
  id: string;
  proposalId: string;
  voter: string;
  choice: 'for' | 'against';
  votingPower: string;
  timestamp: Date;
}

interface DAOContextType {
  proposals: Proposal[];
  votes: Vote[];
  createProposal: (title: string, description: string, category?: ContributionType) => Promise<void>;
  voteOnProposal: (proposalId: string, choice: 'for' | 'against') => Promise<void>;
  isLoading: boolean;
  refreshProposals: () => Promise<void>;
}

const DAOContext = createContext<DAOContextType | undefined>(undefined);

export function DAOProvider({ children }: { children: ReactNode }) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize DAO service
  useEffect(() => {
    daoService.initialize().catch(console.error);
  }, []);

  // Load proposals from service
  const loadProposals = async () => {
    try {
      const serviceProposals = await daoService.getAllProposals();
      const formattedProposals: Proposal[] = serviceProposals.map((p: ServiceProposal) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        status: p.status === 'Active' ? 'active' : p.status === 'Passed' ? 'passed' : p.status === 'Rejected' ? 'failed' : 'pending',
        creator: p.proposer,
        createdAt: p.createdAt,
        endDate: p.votingDeadline,
        votesFor: p.votesFor,
        votesAgainst: p.votesAgainst,
        totalVotes: p.votesFor + p.votesAgainst
      }));
      setProposals(formattedProposals);
    } catch (error) {
      console.error('Failed to load proposals:', error);
      // Keep existing mock data as fallback
      const mockProposals: Proposal[] = [
        {
          id: '1',
          title: 'Increase Solar Panel Efficiency Target',
          description: 'Proposal to increase the minimum efficiency requirement for new solar projects from 18% to 20%.',
          status: 'active',
          creator: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          createdAt: new Date('2024-01-01'),
          endDate: new Date('2024-01-31'),
          votesFor: 150,
          votesAgainst: 45,
          totalVotes: 195
        },
        {
          id: '2',
          title: 'Fund Community Education Program',
          description: 'Allocate 10,000 tokens to fund solar energy education programs in underserved communities.',
          status: 'active',
          creator: '0x8ba1f109551bD43280301264526176',
          createdAt: new Date('2024-01-05'),
          endDate: new Date('2024-02-05'),
          votesFor: 89,
          votesAgainst: 23,
          totalVotes: 112
        },
        {
          id: '3',
          title: 'Update Governance Token Distribution',
          description: 'Modify the token distribution algorithm to reward long-term holders more generously.',
          status: 'passed',
          creator: '0x9c2d45Ee6634C0532925a3b844Bc454e4438f44f',
          createdAt: new Date('2023-12-15'),
          endDate: new Date('2024-01-15'),
          votesFor: 234,
          votesAgainst: 67,
          totalVotes: 301
        }
      ];
      setProposals(mockProposals);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const createProposal = async (title: string, description: string, category?: ContributionType) => {
    setIsLoading(true);
    try {
      const defaultCategory: ContributionType = { Other: 'General' };
      const proposalId = await daoService.createProposal({
        title,
        description,
        category: category || defaultCategory
      });

      // Refresh proposals to show the new one
      await loadProposals();
    } catch (error) {
      console.error('Failed to create proposal:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const voteOnProposal = async (proposalId: string, choice: 'for' | 'against') => {
    setIsLoading(true);
    try {
      const approve = choice === 'for';
      await daoService.vote(BigInt(proposalId), approve);

      // Refresh proposals to show updated vote counts
      await loadProposals();
    } catch (error) {
      console.error('Failed to vote:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProposals = async () => {
    await loadProposals();
  };

  const value: DAOContextType = {
    proposals,
    votes,
    createProposal,
    voteOnProposal,
    isLoading,
    refreshProposals,
  };

  return <DAOContext.Provider value={value}>{children}</DAOContext.Provider>;
}

export function useDAO() {
  const context = useContext(DAOContext);
  if (context === undefined) {
    throw new Error('useDAO must be used within a DAOProvider');
  }
  return context;
}
