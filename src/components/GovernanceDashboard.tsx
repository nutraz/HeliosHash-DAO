// === HHDAO Governance Dashboard ===
// Main governance interface for community proposals and voting
// Designed for farmers, teachers, and villagers in Urgam Valley

'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { MembershipInfo, Proposal, ProposalStats } from '../services/daoService';
import { daoService, HHDAOError, HHDAOService } from '../services/daoService';
import ProposalMap from './governance/ProposalMap';

interface GovernanceDashboardProps {
  className?: string;
}

export const GovernanceDashboard: React.FC<GovernanceDashboardProps> = ({ className = '' }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [stats, setStats] = useState<ProposalStats | null>(null);
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateProposal, setShowCreateProposal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    type: 'solar' as 'solar' | 'mining' | 'infrastructure' | 'education' | 'other',
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Initialize service if not done yet
      await daoService.initialize();

      // Load all dashboard data in parallel
      const [proposalsData, statsData, membershipData] = await Promise.all([
        daoService.getAllProposals(),
        daoService.getProposalStats(),
        daoService.getMembershipInfo(),
      ]);

      setProposals(proposalsData);
      setStats(statsData);
      setMembership(membershipData);
    } catch (err) {
      const errorMessage =
        err instanceof HHDAOError ? err.message : 'Failed to load governance data';
      setError(errorMessage);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinDAO = async () => {
    try {
      setError(null);
      await daoService.joinDAO();

      // Reload membership info
      const membershipData = await daoService.getMembershipInfo();
      setMembership(membershipData);

      // Show success message (you could add a toast here)
      alert('Welcome to HHDAO! You can now participate in governance.');
    } catch (err) {
      const errorMessage = err instanceof HHDAOError ? err.message : 'Failed to join DAO';
      setError(errorMessage);
    }
  };

  const handleCreateProposal = async () => {
    if (!newProposal.title.trim() || !newProposal.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setCreating(true);
      setError(null);

      await daoService.createProposal({
        title: newProposal.title,
        description: newProposal.description,
        category: { [newProposal.type]: null } as any, // Convert string to ContributionType variant
      });

      // Reset form and close dialog
      setNewProposal({
        title: '',
        description: '',
        type: 'solar',
      });
      setShowCreateProposal(false);

      // Reload proposals
      await loadDashboardData();

      alert('Proposal created successfully!');
    } catch (err) {
      const errorMessage = err instanceof HHDAOError ? err.message : 'Failed to create proposal';
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className={`governance-dashboard ${className}`}>
        <div className='loading-spinner'>
          <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto'></div>
          <p className='text-center mt-4 text-gray-600'>Loading governance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`governance-dashboard ${className}`}>
        <div className='error-state bg-red-50 border border-red-200 rounded-lg p-6'>
          <h3 className='text-red-800 font-semibold mb-2'>Error Loading Governance</h3>
          <p className='text-red-600 mb-4'>{error}</p>
          <button
            onClick={loadDashboardData}
            className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`governance-dashboard ${className}`}>
      {/* Header */}
      <div className='dashboard-header mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>🌞 HHDAO Governance</h1>
        <p className='text-gray-600'>
          Community governance for solar energy projects in Urgam Valley
        </p>
      </div>

      {/* Membership Status */}
      {membership && (
        <div className='membership-section mb-6'>
          {membership.isMember ? (
            <div className='member-info bg-green-50 border border-green-200 rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-green-800 font-semibold'>✅ DAO Member</h3>
                  <p className='text-green-600'>
                    Contribution Score: {membership.contributionScore} | Voting Power: 1 vote (equal
                    for all members)
                  </p>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-green-600'>
                    Community Size: {membership.memberCount} members
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className='non-member-info bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-blue-800 font-semibold'>Join the Community</h3>
                  <p className='text-blue-600'>
                    Become a member to create proposals and vote on community decisions
                  </p>
                </div>
                <button
                  onClick={handleJoinDAO}
                  className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
                >
                  Join DAO
                </button>
              </div>
              <div className='mt-2'>
                <p className='text-sm text-blue-600'>
                  Current Community: {membership.memberCount} members
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      {stats && (
        <div className='stats-section grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <StatCard title='Total Proposals' value={stats.totalProposals} icon='📋' color='blue' />
          <StatCard title='Active Voting' value={stats.activeProposals} icon='🗳️' color='green' />
          <StatCard title='Approved' value={stats.approvedProposals} icon='✅' color='orange' />
          <StatCard
            title='Participation'
            value={`${stats.participationRate}%`}
            icon='🤝'
            color='purple'
          />
        </div>
      )}

      {/* Project Map */}
      <div className='map-section mb-8'>
        <ProposalMap proposals={proposals} className='w-full' />
      </div>

      {/* Proposals List */}
      <div className='proposals-section'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold text-gray-900'>Community Proposals</h2>
          {membership?.isMember && (
            <Dialog open={showCreateProposal} onOpenChange={setShowCreateProposal}>
              <DialogTrigger asChild>
                <Button
                  data-testid='create-proposal-button'
                  className='bg-orange-500 hover:bg-orange-600 text-white'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  Create Proposal
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[500px]'>
                <DialogHeader>
                  <DialogTitle>Create New Proposal</DialogTitle>
                  <DialogDescription>
                    Submit a proposal for community consideration. All proposals require 60%
                    approval to pass.
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='title'>Title *</Label>
                    <Input
                      id='title'
                      placeholder='Enter proposal title'
                      value={newProposal.title}
                      onChange={(e) =>
                        setNewProposal((prev) => ({ ...prev, title: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='type'>Category</Label>
                    <Select
                      value={newProposal.type}
                      onValueChange={(
                        value: 'solar' | 'mining' | 'infrastructure' | 'education' | 'other'
                      ) => setNewProposal((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select proposal type' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='solar'>Solar Energy</SelectItem>
                        <SelectItem value='mining'>Mining</SelectItem>
                        <SelectItem value='infrastructure'>Infrastructure</SelectItem>
                        <SelectItem value='education'>Education</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='description'>Description *</Label>
                    <Textarea
                      id='description'
                      placeholder='Describe your proposal in detail...'
                      value={newProposal.description}
                      onChange={(e) =>
                        setNewProposal((prev) => ({ ...prev, description: e.target.value }))
                      }
                      rows={4}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant='outline'
                    onClick={() => setShowCreateProposal(false)}
                    disabled={creating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateProposal}
                    disabled={
                      creating || !newProposal.title.trim() || !newProposal.description.trim()
                    }
                    className='bg-orange-500 hover:bg-orange-600'
                  >
                    {creating ? 'Creating...' : 'Create Proposal'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {proposals.length === 0 ? (
          <div className='no-proposals bg-gray-50 border border-gray-200 rounded-lg p-8 text-center'>
            <h3 className='text-gray-700 font-semibold mb-2'>No Proposals Yet</h3>
            <p className='text-gray-600'>Be the first to create a proposal for the community!</p>
          </div>
        ) : (
          <div data-testid='dao-proposals-list' className='proposals-grid space-y-4'>
            {proposals.map((proposal) => (
              <ProposalCard
                key={proposal.id.toString()}
                proposal={proposal}
                totalMembers={membership?.memberCount || 0}
                onVote={() => loadDashboardData()} // Reload after vote
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// === Statistics Card Component ===
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
  };

  return (
    <div className={`stat-card border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-sm font-medium opacity-75'>{title}</p>
          <p className='text-2xl font-bold'>{value}</p>
        </div>
        <span className='text-2xl'>{icon}</span>
      </div>
    </div>
  );
};

// === Proposal Card Component ===
interface ProposalCardProps {
  proposal: Proposal;
  totalMembers: number;
  onVote: () => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, totalMembers, onVote }) => {
  const [voting, setVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    checkVoteStatus();
  }, [proposal.id]);

  const checkVoteStatus = async () => {
    try {
      const voted = await daoService.hasVoted(BigInt(proposal.id));
      setHasVoted(voted);
    } catch (err) {
      console.error('Failed to check vote status:', err);
    }
  };

  const handleVote = async (approve: boolean) => {
    try {
      setVoting(true);
      await daoService.vote(BigInt(proposal.id), approve);
      setHasVoted(true);
      onVote(); // Trigger parent refresh
    } catch (err) {
      const errorMessage = err instanceof HHDAOError ? err.message : 'Failed to vote';
      alert(`Vote failed: ${errorMessage}`);
    } finally {
      setVoting(false);
    }
  };

  const approvalPercentage = HHDAOService.calculateApprovalPercentage(proposal, totalMembers);
  const meetsThreshold = HHDAOService.meetsApprovalThreshold(proposal, totalMembers);

  return (
    <div className='proposal-card bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'>
      {/* Proposal Header */}
      <div className='proposal-header mb-4'>
        <div className='flex items-center justify-between mb-2'>
          <h3 className='text-xl font-bold text-gray-900'>{proposal.title}</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              proposal.finalized
                ? proposal.approved
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {proposal.finalized
              ? proposal.approved
                ? '✅ Approved'
                : '❌ Rejected'
              : '🗳️ Voting Open'}
          </span>
        </div>

        <p className='text-gray-600 mb-2'>{proposal.description}</p>

        <div className='flex items-center gap-4 text-sm text-gray-500'>
          <span>📁 {proposal.type}</span>
          <span>📅 {proposal.createdAt.toLocaleDateString()}</span>
          <span>ID: #{proposal.id.toString()}</span>
        </div>
      </div>

      {/* Voting Stats */}
      <div className='voting-stats mb-4'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm font-medium text-gray-700'>Community Support</span>
          <span className='text-sm font-medium text-gray-900'>{approvalPercentage}%</span>
        </div>

        <div className='progress-bar bg-gray-200 rounded-full h-3 mb-2'>
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              meetsThreshold ? 'bg-green-500' : 'bg-orange-500'
            }`}
            style={{ width: `${Math.min(approvalPercentage, 100)}%` }}
          />
        </div>

        <div className='flex justify-between text-sm text-gray-600'>
          <span>👍 {Number(proposal.votesFor)} YES</span>
          <span>👎 {Number(proposal.votesAgainst)} NO</span>
          <span>🎯 Need 60% ({Math.ceil(totalMembers * 0.6)})</span>
        </div>
      </div>

      {/* Voting Actions */}
      {!proposal.finalized && (
        <div className='voting-actions'>
          {hasVoted ? (
            <div className='text-center py-3'>
              <span className='text-green-600 font-medium'>✅ You have voted on this proposal</span>
            </div>
          ) : (
            <div className='flex gap-3'>
              <button
                onClick={() => handleVote(true)}
                disabled={voting}
                className='flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium'
              >
                {voting ? 'Voting...' : '👍 Vote YES'}
              </button>
              <button
                onClick={() => handleVote(false)}
                disabled={voting}
                className='flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium'
              >
                {voting ? 'Voting...' : '👎 Vote NO'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GovernanceDashboard;
