'use client'

import React from 'react'
import { Coins, Gift, Trophy, Zap, TrendingUp, Award, Star, Target } from 'lucide-react'

interface RewardsHubProps {
  user?: any
  onNavigate?: (view: string) => void
}

export default function RewardsHub({ user, onNavigate }: RewardsHubProps) {
  const rewards = [
    { id: 1, title: 'Early Adopter', points: 500, icon: Star, status: 'earned', date: '2025-01-15' },
    { id: 2, title: 'Community Builder', points: 1000, icon: Award, status: 'earned', date: '2025-02-20' },
    { id: 3, title: 'Project Supporter', points: 750, icon: Trophy, status: 'earned', date: '2025-03-10' },
    { id: 4, title: 'Green Energy Champion', points: 2000, icon: Zap, status: 'locked', progress: 60 },
    { id: 5, title: 'DAO Governance Leader', points: 1500, icon: Target, status: 'locked', progress: 35 },
  ]

  const totalPoints = rewards.filter(r => r.status === 'earned').reduce((sum, r) => sum + r.points, 0)
  const hhuBalance = 2450
  const weeklyEarnings = 320

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => onNavigate?.('dashboard')}
            className="text-blue-600 dark:text-blue-400 hover:underline mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-clip-text text-transparent mb-2">
            Rewards Hub
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Earn HHU tokens and unlock exclusive benefits</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-amber-500">
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-8 h-8 text-amber-500" />
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">HHU</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{hhuBalance.toLocaleString()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">+12%</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{weeklyEarnings}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalPoints.toLocaleString()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Reward Points</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{rewards.filter(r => r.status === 'earned').length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Badges Earned</p>
          </div>
        </div>

        {/* Earning Opportunities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Gift className="w-6 h-6 text-orange-500" />
            Earning Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Vote on Proposals</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Earn 50 HHU per vote</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                Start Voting
              </button>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Complete Projects</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Earn 500-2000 HHU</p>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors">
                View Projects
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Exchange Tokens</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Get vouchers & credits</p>
              <button 
                onClick={() => onNavigate?.('exchange')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
              >
                Exchange Hub
              </button>
            </div>
          </div>
        </div>

        {/* Badges & Achievements */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Badges & Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => {
              const Icon = reward.icon
              const isEarned = reward.status === 'earned'
              
              return (
                <div 
                  key={reward.id}
                  className={`rounded-lg p-6 border-2 transition-all ${
                    isEarned 
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-300 dark:border-amber-700 shadow-lg' 
                      : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-75'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${isEarned ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-gray-200 dark:bg-gray-800'}`}>
                      <Icon className={`w-8 h-8 ${isEarned ? 'text-amber-600 dark:text-amber-400' : 'text-gray-400'}`} />
                    </div>
                    {isEarned && (
                      <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full">
                        Earned ✓
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{reward.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-amber-600 dark:text-amber-400">{reward.points} HHU</span>
                  </div>
                  
                  {isEarned ? (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Earned on {new Date(reward.date!).toLocaleDateString()}
                    </p>
                  ) : (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{reward.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${reward.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Top Contributors This Month
          </h2>
          <div className="space-y-4">
            {[
              { rank: 1, name: 'SolarPioneer_2024', points: 5420, badge: '🥇' },
              { rank: 2, name: 'GreenEnergy_Pro', points: 4890, badge: '🥈' },
              { rank: 3, name: 'DaoBuilder_456', points: 4230, badge: '🥉' },
              { rank: 4, name: user?.name || 'You', points: totalPoints, badge: '', highlight: true },
            ].map((item) => (
              <div 
                key={item.rank}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  item.highlight 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500' 
                    : 'bg-gray-50 dark:bg-gray-900'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-gray-400 dark:text-gray-600 w-8">
                    {item.badge || `#${item.rank}`}
                  </span>
                  <span className={`font-semibold ${item.highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {item.points.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
