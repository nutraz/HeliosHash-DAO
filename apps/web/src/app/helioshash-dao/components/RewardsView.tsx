import React, { useState } from "react";
import { 
  Gift, 
  Star, 
  TrendingUp, 
  Users, 
  Award, 
  Zap, 
  Clock, 
  CheckCircle, 
  ShoppingBag,
  Coins,
  Sparkles,
  Target,
  Calendar,
  Trophy,
  Shield,
  Heart
} from "lucide-react";

interface RewardItem {
  id: string;
  name: string;
  description: string;
  points: number;
  category: 'community' | 'contribution' | 'achievement' | 'governance';
  icon: React.ReactNode;
  status: 'available' | 'completed' | 'locked';
  progress?: number;
  deadline?: string;
}

interface RewardTier {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  name: string;
  pointsRequired: number;
  benefits: string[];
  color: string;
  icon: React.ReactNode;
}

const RewardsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'leaderboard' | 'marketplace' | 'my-rewards'>('rewards');
  const [userPoints, setUserPoints] = useState(1250);
  const [userTier, setUserTier] = useState<'bronze' | 'silver' | 'gold' | 'platinum'>('silver');

  const rewardTiers: RewardTier[] = [
    {
      tier: 'bronze',
      name: 'Bronze Member',
      pointsRequired: 0,
      benefits: ['Basic voting rights', 'Community access', 'Monthly newsletter'],
      color: 'bg-amber-600',
      icon: <Star className="w-6 h-6" />
    },
    {
      tier: 'silver',
      name: 'Silver Contributor',
      pointsRequired: 500,
      benefits: ['Enhanced voting power', 'Early feature access', 'Project participation'],
      color: 'bg-gray-400',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      tier: 'gold',
      name: 'Gold Partner',
      pointsRequired: 1000,
      benefits: ['Governance rights', 'Revenue sharing', 'Exclusive events'],
      color: 'bg-yellow-500',
      icon: <Award className="w-6 h-6" />
    },
    {
      tier: 'platinum',
      name: 'Platinum Founder',
      pointsRequired: 2000,
      benefits: ['Founder status', 'Decision making power', 'Maximum rewards'],
      color: 'bg-purple-600',
      icon: <Trophy className="w-6 h-6" />
    }
  ];

  const availableRewards: RewardItem[] = [
    {
      id: '1',
      name: 'Community Builder',
      description: 'Invite 5 new members to the DAO',
      points: 100,
      category: 'community',
      icon: <Users className="w-6 h-6" />,
      status: 'available',
      progress: 3
    },
    {
      id: '2',
      name: 'Project Contributor',
      description: 'Participate in 3 different projects',
      points: 150,
      category: 'contribution',
      icon: <Zap className="w-6 h-6" />,
      status: 'available',
      progress: 2
    },
    {
      id: '3',
      name: 'Governance Master',
      description: 'Vote on 10 proposals',
      points: 200,
      category: 'governance',
      icon: <Shield className="w-6 h-6" />,
      status: 'available',
      progress: 7
    },
    {
      id: '4',
      name: 'Early Adopter',
      description: 'Join within first month of project launch',
      points: 300,
      category: 'achievement',
      icon: <Sparkles className="w-6 h-6" />,
      status: 'completed'
    },
    {
      id: '5',
      name: 'Energy Champion',
      description: 'Complete solar project documentation',
      points: 250,
      category: 'contribution',
      icon: <Target className="w-6 h-6" />,
      status: 'locked'
    }
  ];

  const marketplaceItems = [
    {
      id: 'm1',
      name: 'HHDAO Exclusive NFT',
      description: 'Limited edition community NFT',
      cost: 500,
      type: 'nft',
      stock: 50
    },
    {
      id: 'm2',
      name: 'Project Governance Token',
      description: 'Additional voting power tokens',
      cost: 200,
      type: 'token',
      stock: 100
    },
    {
      id: 'm3',
      name: 'VIP Event Access',
      description: 'Access to exclusive community events',
      cost: 300,
      type: 'experience',
      stock: 25
    },
    {
      id: 'm4',
      name: 'Merchandise Pack',
      description: 'Official HHDAO merchandise',
      cost: 150,
      type: 'physical',
      stock: 75
    }
  ];

  const leaderboardUsers = [
    { rank: 1, name: 'SolarPioneer', points: 2450, tier: 'platinum' },
    { rank: 2, name: 'GreenWarrior', points: 1890, tier: 'gold' },
    { rank: 3, name: 'EcoBuilder', points: 1670, tier: 'gold' },
    { rank: 4, name: 'RenewableHero', points: 1420, tier: 'gold' },
    { rank: 5, name: 'CleanEnergy', points: 1250, tier: 'silver' }
  ];

  const getTierProgress = () => {
    const currentTierIndex = rewardTiers.findIndex(tier => tier.tier === userTier);
    const nextTier = rewardTiers[currentTierIndex + 1];
    const currentTier = rewardTiers[currentTierIndex];
    
    if (!nextTier) return 100; // Max tier
    
    const progress = ((userPoints - currentTier.pointsRequired) / 
                     (nextTier.pointsRequired - currentTier.pointsRequired)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const renderRewardsTab = () => (
    <div className="space-y-6">
      {/* Points Summary */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Your Rewards Dashboard</h3>
            <p className="text-purple-100 mt-2">Earn points and unlock exclusive benefits</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{userPoints}</div>
            <div className="text-purple-200">Total Points</div>
          </div>
        </div>
        
        {/* Tier Progress */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-purple-200">Current Tier: {userTier.charAt(0).toUpperCase() + userTier.slice(1)}</span>
            <span className="text-purple-200">{getTierProgress().toFixed(0)}% to next tier</span>
          </div>
          <div className="w-full bg-purple-800 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${getTierProgress()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableRewards.map((reward) => (
          <div key={reward.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  reward.status === 'completed' ? 'bg-green-500' : 
                  reward.status === 'locked' ? 'bg-gray-600' : 'bg-blue-500'
                }`}>
                  {reward.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{reward.name}</h4>
                  <p className="text-sm text-gray-400">{reward.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-yellow-400">{reward.points}</div>
                <div className="text-xs text-gray-400">points</div>
              </div>
            </div>
            
            {reward.progress && (
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-gray-400">{reward.progress}/5</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(reward.progress / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <button 
              className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                reward.status === 'completed' 
                  ? 'bg-green-600 text-white' 
                  : reward.status === 'locked'
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              disabled={reward.status === 'locked'}
            >
              {reward.status === 'completed' ? 'Claimed' : 
               reward.status === 'locked' ? 'Locked' : 'Start Earning'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLeaderboardTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Community Leaderboard</h3>
        <div className="space-y-3">
          {leaderboardUsers.map((user, index) => (
            <div key={user.rank} className={`flex items-center justify-between p-4 rounded-lg ${
              index < 3 ? 'bg-gradient-to-r from-yellow-900 to-amber-900' : 'bg-gray-700'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  user.rank === 1 ? 'bg-yellow-500' :
                  user.rank === 2 ? 'bg-gray-400' :
                  user.rank === 3 ? 'bg-amber-700' : 'bg-gray-600'
                }`}>
                  {user.rank}
                </div>
                <div>
                  <div className="font-semibold text-white">{user.name}</div>
                  <div className="text-sm text-gray-400 capitalize">{user.tier} Tier</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-yellow-400">{user.points}</div>
                <div className="text-sm text-gray-400">points</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMarketplaceTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {marketplaceItems.map((item) => (
          <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="font-semibold text-white text-lg">{item.name}</h4>
                <p className="text-gray-400 mt-1">{item.description}</p>
              </div>
              <ShoppingBag className="text-purple-400" size={24} />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl font-bold text-yellow-400">{item.cost}</div>
              <div className="text-sm text-gray-400">{item.stock} remaining</div>
            </div>
            
            <button 
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              disabled={item.cost > userPoints}
            >
              {item.cost > userPoints ? 'Insufficient Points' : 'Redeem Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMyRewardsTab = () => (
    <div className="space-y-6">
      {/* Tier Benefits */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Your Tier Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewardTiers.map((tier) => (
            <div key={tier.tier} className={`border-2 rounded-xl p-4 ${
              userTier === tier.tier 
                ? 'border-purple-500 bg-purple-900 bg-opacity-20' 
                : 'border-gray-600'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${tier.color}`}>
                  {tier.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{tier.name}</h4>
                  <p className="text-sm text-gray-400">{tier.pointsRequired} points</p>
                </div>
              </div>
              <ul className="space-y-2">
                {tier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                    <CheckCircle size={16} className="text-green-400" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Recent Rewards Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'Project Contribution', points: 50, date: '2 hours ago' },
            { action: 'Community Vote', points: 25, date: '1 day ago' },
            { action: 'Member Referral', points: 100, date: '3 days ago' },
            { action: 'Documentation', points: 75, date: '1 week ago' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <div>
                  <div className="font-medium text-white">{activity.action}</div>
                  <div className="text-sm text-gray-400">{activity.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">+{activity.points}</div>
                <div className="text-sm text-gray-400">points</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">HHDAO Rewards</h1>
          <p className="text-gray-400 text-lg">
            Earn points, unlock benefits, and shape the future of sustainable energy
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { id: 'rewards', label: 'Available Rewards', icon: <Gift size={18} /> },
            { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
            { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag size={18} /> },
            { id: 'my-rewards', label: 'My Rewards', icon: <Coins size={18} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'rewards' && renderRewardsTab()}
        {activeTab === 'leaderboard' && renderLeaderboardTab()}
        {activeTab === 'marketplace' && renderMarketplaceTab()}
        {activeTab === 'my-rewards' && renderMyRewardsTab()}

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-500">
          <p className="flex items-center justify-center space-x-2">
            <Heart size={16} className="text-red-400" />
            <span>Built for the HHDAO community • Points reset quarterly</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RewardsView;