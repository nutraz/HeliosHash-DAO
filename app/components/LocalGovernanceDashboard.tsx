import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{value}</p>
    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
  </div>
);

interface ActivityItemProps {
  action: string;
  timestamp: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ action, timestamp }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
    <span className="text-gray-900 dark:text-white">{action}</span>
    <span className="text-sm text-gray-500 dark:text-gray-400">{timestamp}</span>
  </div>
);

const LocalGovernanceDashboard: React.FC = () => {
  // Placeholder data - replace with real data from canisters
  const metrics = {
    proposalCount: 42,
    activeVoters: 128,
    totalVotes: 1567,
  };

  const recentActivity = [
    { action: 'Proposal #42 approved', timestamp: '2 hours ago' },
    { action: 'New voter registered', timestamp: '4 hours ago' },
    { action: 'Proposal #41 submitted', timestamp: '1 day ago' },
    { action: 'Voting period ended', timestamp: '2 days ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Local Governance Dashboard
      </h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Active Proposals"
          value={metrics.proposalCount}
          description="Currently open for voting"
        />
        <MetricCard
          title="Active Voters"
          value={metrics.activeVoters}
          description="Participating this month"
        />
        <MetricCard
          title="Total Votes Cast"
          value={metrics.totalVotes}
          description="All time"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-2">
          {recentActivity.map((activity, index) => (
            <ActivityItem
              key={index}
              action={activity.action}
              timestamp={activity.timestamp}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocalGovernanceDashboard;
