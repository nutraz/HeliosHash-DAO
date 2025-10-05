'use client';

import {
  Award,
  Briefcase,
  Coins,
  DollarSign,
  Gift,
  Heart,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from 'lucide-react';
import { useState } from 'react';

// Mock data - replace with actual canister calls
const mockStats = {
  totalWomenMembers: 142,
  totalBonusDistributed: 85600,
  totalGrantsDisbursed: 12,
  totalNFTsMinted: 267,
  averageParticipation: 0.41,
};

const mockLeaderboard = [
  { name: 'Sunita Devi', owpBalance: 15420 },
  { name: 'Priya Sharma', owpBalance: 12890 },
  { name: 'Kavita Singh', owpBalance: 11250 },
  { name: 'Meera Gupta', owpBalance: 9870 },
  { name: 'Asha Patel', owpBalance: 8940 },
];

const mockPendingGrants = [
  {
    grantId: 'GRANT_001',
    projectTitle: 'Solar Kitchen Setup',
    description: 'Community solar cooking facility for 20 families',
    requestedAmount: 15000000, // ₹15,000
    appliedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    status: 'Pending',
  },
  {
    grantId: 'GRANT_002',
    projectTitle: 'Women Solar Technician Training',
    description: 'Technical training program for 15 women',
    requestedAmount: 18000000, // ₹18,000
    appliedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    status: 'UnderReview',
  },
];

const GenderIncentivesDashboard = () => {
  const [stats, setStats] = useState(mockStats);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [pendingGrants, setPendingGrants] = useState(mockPendingGrants);
  const [selectedTab, setSelectedTab] = useState('overview');

  // Format currency for Indian Rupees
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount / 1000000); // Convert from micro-units
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex items-center gap-4 mb-4'>
            <div className='w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center'>
              <Award className='w-6 h-6 text-white' />
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-800'>
                Gender Equity & Incentives Dashboard
              </h1>
              <p className='text-gray-600'>
                महिला सशक्तिकरण कार्यक्रम | Women's Empowerment Program
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className='bg-white rounded-xl shadow-lg mb-6'>
          <div className='flex border-b border-gray-200'>
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'grants', label: 'Micro-Grants', icon: DollarSign },
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'mentorship', label: 'Mentorship', icon: Heart },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                    selectedTab === tab.id
                      ? 'border-b-2 border-pink-500 text-pink-600 bg-pink-50'
                      : 'text-gray-600 hover:text-pink-600 hover:bg-pink-50'
                  }`}
                >
                  <IconComponent className='w-5 h-5' />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className='space-y-6'>
            {/* Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              <div className='bg-white rounded-xl shadow-lg p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center'>
                    <Users className='w-6 h-6 text-pink-600' />
                  </div>
                  <span className='text-2xl font-bold text-gray-800'>
                    {stats.totalWomenMembers}
                  </span>
                </div>
                <h3 className='font-semibold text-gray-700'>Women Members</h3>
                <p className='text-sm text-gray-500'>
                  {(stats.averageParticipation * 100).toFixed(1)}% participation rate
                </p>
              </div>

              <div className='bg-white rounded-xl shadow-lg p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                    <Coins className='w-6 h-6 text-green-600' />
                  </div>
                  <span className='text-2xl font-bold text-gray-800'>
                    {(stats.totalBonusDistributed / 1000).toFixed(0)}K
                  </span>
                </div>
                <h3 className='font-semibold text-gray-700'>Bonus Distributed</h3>
                <p className='text-sm text-gray-500'>OWP tokens earned</p>
              </div>

              <div className='bg-white rounded-xl shadow-lg p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                    <DollarSign className='w-6 h-6 text-blue-600' />
                  </div>
                  <span className='text-2xl font-bold text-gray-800'>
                    {stats.totalGrantsDisbursed}
                  </span>
                </div>
                <h3 className='font-semibold text-gray-700'>Grants Disbursed</h3>
                <p className='text-sm text-gray-500'>Micro-grant projects</p>
              </div>

              <div className='bg-white rounded-xl shadow-lg p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
                    <Star className='w-6 h-6 text-purple-600' />
                  </div>
                  <span className='text-2xl font-bold text-gray-800'>{stats.totalNFTsMinted}</span>
                </div>
                <h3 className='font-semibold text-gray-700'>NFT Badges</h3>
                <p className='text-sm text-gray-500'>Achievement badges minted</p>
              </div>
            </div>

            {/* Incentive Types */}
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <h2 className='text-xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                <Gift className='w-6 h-6 text-pink-600' />
                Women's Participation Incentives
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                <div className='text-center p-4 bg-pink-50 rounded-lg'>
                  <div className='w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                    <Coins className='w-8 h-8 text-pink-600' />
                  </div>
                  <h3 className='font-semibold text-gray-800 mb-2'>20% Token Bonus</h3>
                  <p className='text-sm text-gray-600'>
                    Extra OWP tokens on all purchases and governance participation
                  </p>
                </div>

                <div className='text-center p-4 bg-blue-50 rounded-lg'>
                  <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                    <Briefcase className='w-8 h-8 text-blue-600' />
                  </div>
                  <h3 className='font-semibold text-gray-800 mb-2'>Priority Jobs</h3>
                  <p className='text-sm text-gray-600'>
                    +30 priority points for solar technician and data steward roles
                  </p>
                </div>

                <div className='text-center p-4 bg-green-50 rounded-lg'>
                  <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                    <DollarSign className='w-8 h-8 text-green-600' />
                  </div>
                  <h3 className='font-semibold text-gray-800 mb-2'>Micro-Grants</h3>
                  <p className='text-sm text-gray-600'>
                    ₹5,000 - ₹20,000 project funding for women entrepreneurs
                  </p>
                </div>

                <div className='text-center p-4 bg-purple-50 rounded-lg'>
                  <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3'>
                    <Star className='w-8 h-8 text-purple-600' />
                  </div>
                  <h3 className='font-semibold text-gray-800 mb-2'>Exclusive NFTs</h3>
                  <p className='text-sm text-gray-600'>
                    Solar Sister, Urgam Changemaker, and Green Mentor badges
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Micro-Grants Tab */}
        {selectedTab === 'grants' && (
          <div className='space-y-6'>
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
                  <DollarSign className='w-6 h-6 text-green-600' />
                  Pending Micro-Grant Applications
                </h2>
                <div className='text-sm text-gray-600'>
                  Grant Pool Balance: {formatINR(8000000)}
                </div>
              </div>

              <div className='space-y-4'>
                {pendingGrants.map((grant) => (
                  <div key={grant.grantId} className='border border-gray-200 rounded-lg p-4'>
                    <div className='flex items-start justify-between mb-3'>
                      <div>
                        <h3 className='font-semibold text-gray-800 mb-1'>{grant.projectTitle}</h3>
                        <p className='text-gray-600 text-sm mb-2'>{grant.description}</p>
                        <div className='flex items-center gap-4 text-sm text-gray-500'>
                          <span>Grant ID: {grant.grantId}</span>
                          <span>Applied: {formatDate(grant.appliedAt)}</span>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-lg font-bold text-gray-800 mb-1'>
                          {formatINR(grant.requestedAmount)}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            grant.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {grant.status}
                        </span>
                      </div>
                    </div>

                    <div className='flex gap-2'>
                      <button className='px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors'>
                        Approve Grant
                      </button>
                      <button className='px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300 transition-colors'>
                        Review Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grant Application Form */}
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <h2 className='text-xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                <Target className='w-6 h-6 text-purple-600' />
                Apply for Micro-Grant
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Project Title *
                  </label>
                  <input
                    type='text'
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                    placeholder='Enter project title...'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Requested Amount (₹5,000 - ₹20,000) *
                  </label>
                  <input
                    type='number'
                    min='5000'
                    max='20000'
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                    placeholder='Enter amount...'
                  />
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Project Description *
                  </label>
                  <textarea
                    rows={4}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent'
                    placeholder='Describe your project and its community impact...'
                  ></textarea>
                </div>

                <div className='md:col-span-2 flex gap-4'>
                  <button className='px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all'>
                    Submit Application
                  </button>
                  <button className='px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors'>
                    Save Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {selectedTab === 'leaderboard' && (
          <div className='bg-white rounded-xl shadow-lg p-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
              <Trophy className='w-6 h-6 text-yellow-600' />
              Women's Leadership Board
            </h2>

            <div className='space-y-3'>
              {leaderboard.map((member, index) => (
                <div
                  key={member.name}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
                      : index === 2
                      ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className='flex items-center gap-4'>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? 'bg-yellow-400 text-yellow-900'
                          : index === 1
                          ? 'bg-gray-400 text-gray-900'
                          : index === 2
                          ? 'bg-orange-400 text-orange-900'
                          : 'bg-gray-300 text-gray-700'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-800'>{member.name}</h3>
                      <p className='text-sm text-gray-600'>Community Member</p>
                    </div>
                  </div>

                  <div className='text-right'>
                    <div className='text-lg font-bold text-gray-800'>
                      {member.owpBalance.toLocaleString()} OWP
                    </div>
                    <div className='text-sm text-gray-600'>
                      +{Math.floor(member.owpBalance * 0.2).toLocaleString()} bonus earned
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mentorship Tab */}
        {selectedTab === 'mentorship' && (
          <div className='space-y-6'>
            <div className='bg-white rounded-xl shadow-lg p-6'>
              <h2 className='text-xl font-bold text-gray-800 mb-6 flex items-center gap-2'>
                <Heart className='w-6 h-6 text-red-500' />
                Mentorship Program
              </h2>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg border border-red-100'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Become a Mentor</h3>
                  <ul className='space-y-2 text-sm text-gray-600 mb-4'>
                    <li>• Minimum 6 months membership required</li>
                    <li>• Monthly OWP stipend for active mentoring</li>
                    <li>• Exclusive "Green Mentor" NFT badge</li>
                    <li>• Priority consideration for leadership roles</li>
                  </ul>
                  <button className='w-full px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors'>
                    Apply to Mentor
                  </button>
                </div>

                <div className='p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>Find a Mentor</h3>
                  <ul className='space-y-2 text-sm text-gray-600 mb-4'>
                    <li>• Get guidance from experienced members</li>
                    <li>• Learn solar technology and DAO governance</li>
                    <li>• Career development support</li>
                    <li>• Monthly check-ins and progress tracking</li>
                  </ul>
                  <button className='w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors'>
                    Request Mentor
                  </button>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-xl shadow-lg p-6'>
              <h3 className='text-lg font-bold text-gray-800 mb-4'>Active Mentorship Pairs</h3>

              <div className='space-y-4'>
                {[
                  {
                    mentor: 'Sunita Devi',
                    mentee: 'Priya Sharma',
                    topic: 'Solar Technology',
                    duration: '3 months',
                  },
                  {
                    mentor: 'Kavita Singh',
                    mentee: 'Meera Gupta',
                    topic: 'Business Development',
                    duration: '2 months',
                  },
                  {
                    mentor: 'Asha Patel',
                    mentee: 'Radha Kumar',
                    topic: 'DAO Governance',
                    duration: '1 month',
                  },
                ].map((pair, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'
                  >
                    <div className='flex items-center gap-4'>
                      <div className='text-center'>
                        <div className='w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mb-1'>
                          <Heart className='w-5 h-5 text-pink-600' />
                        </div>
                        <div className='text-xs text-gray-500'>Mentor</div>
                      </div>
                      <div>
                        <div className='font-semibold text-gray-800'>{pair.mentor}</div>
                        <div className='text-sm text-gray-600'>→ {pair.mentee}</div>
                      </div>
                    </div>

                    <div className='text-right text-sm'>
                      <div className='font-medium text-gray-800'>{pair.topic}</div>
                      <div className='text-gray-500'>{pair.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenderIncentivesDashboard;
