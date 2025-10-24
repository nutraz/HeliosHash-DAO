import React, { useState } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, icon, trend }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
      {icon && <span className="text-lg">{icon}</span>}
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    {trend && (
      <div className={`text-xs mt-1 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
        {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} Trending
      </div>
    )}
  </div>
);

interface VoteButtonProps {
  proposalId: number;
  onVote: (proposalId: number, approve: boolean) => void;
  disabled?: boolean;
}

const VoteButton: React.FC<VoteButtonProps> = ({ proposalId, onVote, disabled }) => (
  <div className="flex gap-2">
    <button
      onClick={() => onVote(proposalId, true)}
      disabled={disabled}
      className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors touch-manipulation"
    >
      ✅ Approve
    </button>
    <button
      onClick={() => onVote(proposalId, false)}
      disabled={disabled}
      className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium text-sm transition-colors touch-manipulation"
    >
      ❌ Reject
    </button>
  </div>
);

const MobileDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'voting' | 'rewards'>('overview');

  // Mock data - replace with real canister data
  const baghpatMetrics = {
    currentCapacity: '5kW',
    targetCapacity: '50kW',
    efficiency: 92,
    households: 127,
    revenue: '$2,450',
    co2Saved: '15.2 tons'
  };

  const urgamUMetrics = {
    totalDonations: '$12,340',
    projectsFunded: 8,
    beneficiaries: 234,
    impactScore: 94
  };

  const owpRewards = {
    balance: 1250,
    earnedThisMonth: 340,
    pending: 85,
    tier: 'Community'
  };

  const activeProposals = [
    {
      id: 1,
      title: 'Expand Baghpat Solar Grid',
      description: 'Scale up from 5kW to 15kW capacity',
      votesFor: 45,
      votesAgainst: 12,
      timeLeft: '2 days',
      category: 'Infrastructure'
    },
    {
      id: 2,
      title: 'UrgamU Education Program',
      description: 'Fund STEM education for 50 rural students',
      votesFor: 78,
      votesAgainst: 5,
      timeLeft: '5 days',
      category: 'Education'
    }
  ];

  const handleVote = (proposalId: number, approve: boolean) => {
    // TODO: Implement voting logic with canister
    console.log(`Voted ${approve ? 'for' : 'against'} proposal ${proposalId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ALPHA WARNING BANNER - HIGH PRIORITY */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">⚠️</span>
          <span className="font-bold text-lg">ALPHA VERSION</span>
        </div>
        <p className="text-sm font-medium">NO REAL FUNDS • TEST ENVIRONMENT ONLY</p>
        <p className="text-xs mt-1 opacity-90">All transactions use test tokens</p>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">HeliosHash DAO</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Mobile Dashboard</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-gray-200 dark:border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'voting', label: 'Voting', icon: '🗳️' },
            { id: 'rewards', label: 'Rewards', icon: '🏆' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex-1 py-3 px-2 text-center text-sm font-medium transition-colors touch-manipulation ${
                selectedTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className="text-lg mb-1">{tab.icon}</div>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {selectedTab === 'overview' && (
          <>
            {/* Baghpat Operational Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">☀️</span>
                Baghpat Solar Operations
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <MetricCard
                  title="Current Capacity"
                  value={baghpatMetrics.currentCapacity}
                  description={`Scaling to ${baghpatMetrics.targetCapacity}`}
                  trend="up"
                />
                <MetricCard
                  title="Efficiency"
                  value={`${baghpatMetrics.efficiency}%`}
                  description="System performance"
                  trend="up"
                />
                <MetricCard
                  title="Households"
                  value={baghpatMetrics.households}
                  description="Powered homes"
                />
                <MetricCard
                  title="CO₂ Saved"
                  value={baghpatMetrics.co2Saved}
                  description="Monthly impact"
                  trend="up"
                />
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Scalability Progress:</strong> 5kW → 50kW expansion in progress.
                  Phase 1 complete, Phase 2 funding approved.
                </p>
              </div>
            </div>

            {/* UrgamU Charitable Initiative */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                UrgamU Initiative
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <MetricCard
                  title="Total Donations"
                  value={urgamUMetrics.totalDonations}
                  description="Community funded"
                  trend="up"
                />
                <MetricCard
                  title="Projects Funded"
                  value={urgamUMetrics.projectsFunded}
                  description="Active initiatives"
                />
                <MetricCard
                  title="Beneficiaries"
                  value={urgamUMetrics.beneficiaries}
                  description="People impacted"
                  trend="up"
                />
                <MetricCard
                  title="Impact Score"
                  value={`${urgamUMetrics.impactScore}%`}
                  description="Program effectiveness"
                  trend="up"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Education Fund</span>
                  <span className="font-medium">$8,200</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Healthcare Support</span>
                  <span className="font-medium">$4,140</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedTab === 'voting' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Proposals</h2>
            {activeProposals.map((proposal) => (
              <div key={proposal.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
                <div className="mb-3">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">{proposal.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{proposal.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{proposal.category}</span>
                    <span>⏰ {proposal.timeLeft} left</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-600">For: {proposal.votesFor}</span>
                    <span className="text-red-600">Against: {proposal.votesAgainst}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <VoteButton proposalId={proposal.id} onVote={handleVote} />
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'rewards' && (
          <div className="space-y-4">
            {/* OWP Token Rewards */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="text-2xl">🪙</span>
                OWP Token Rewards
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <MetricCard
                  title="Current Balance"
                  value={owpRewards.balance.toLocaleString()}
                  description="Available OWP"
                />
                <MetricCard
                  title="This Month"
                  value={`+${owpRewards.earnedThisMonth}`}
                  description="Tokens earned"
                  trend="up"
                />
                <MetricCard
                  title="Pending"
                  value={owpRewards.pending}
                  description="Unclaimed rewards"
                />
                <MetricCard
                  title="Membership Tier"
                  value={owpRewards.tier}
                  description="Current level"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Voting Reward</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Participated in 3 proposals</p>
                  </div>
                  <span className="font-bold text-green-800 dark:text-green-200">+25 OWP</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">Project Contribution</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Baghpat solar monitoring</p>
                  </div>
                  <span className="font-bold text-blue-800 dark:text-blue-200">+50 OWP</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-800 dark:text-purple-200">Community Service</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">UrgamU volunteer work</p>
                  </div>
                  <span className="font-bold text-purple-800 dark:text-purple-200">+30 OWP</span>
                </div>
              </div>

              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors touch-manipulation">
                Claim All Rewards
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Spacer */}
      <div className="h-16"></div>
    </div>
  );
};

export default MobileDashboard;
