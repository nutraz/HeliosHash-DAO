'use client';

import { formatOWP } from '@/utils/currency';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // TODO(PRIV-001): Replace localStorage-based user profile with secure, HttpOnly cookie or server-side session.
    // See .github/ISSUES/privacy/001-audit-dashboard-localstorage.md for remediation steps and acceptance criteria.
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <main role='main'>
      <div className='min-h-screen bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Dashboard Header */}
          <div className='mb-8' data-testid='dashboard-header'>
            <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
            <p className='mt-2 text-gray-600'>Welcome to your HeliosHash DAO dashboard</p>
            {user?.isWoman && (
              <div
                className='mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800'
                data-testid='women-bonus-badge'
              >
                20% Bonus
              </div>
            )}
          </div>

          {/* Search */}
          <div className='mb-8'>
            <input data-testid='search-input' placeholder='Search...' />
          </div>

          {/* Tabs */}
          <div className='mb-8'>
            <nav className='flex space-x-8'>
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-testid='dashboard-tab'
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'projects'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-testid='projects-tab'
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab('governance')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'governance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-testid='governance-tab'
              >
                Governance
              </button>
              <button
                onClick={() => setActiveTab('energy')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'energy'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-testid='energy-dashboard'
              >
                Energy
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {/* Energy Stats */}
              <div className='bg-white p-6 rounded-lg shadow' data-testid='energy-stats'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>Energy Statistics</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Solar Generation</span>
                    <span className='font-semibold'>1,250 kWh</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>CO2 Saved</span>
                    <span className='font-semibold'>850 kg</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Efficiency</span>
                    <span className='font-semibold'>92%</span>
                  </div>
                </div>
              </div>

              {/* Token Balance */}
              <div className='bg-white p-6 rounded-lg shadow' data-testid='token-balance'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>Token Balance</h3>
                <div className='text-3xl font-bold text-green-600 mb-2'>
                  {formatOWP(user?.isWoman ? 2930 : 2450)}
                </div>
                <p className='text-gray-600'>One World Protocol Tokens</p>
              </div>

              {/* Governance Section */}
              <div className='bg-white p-6 rounded-lg shadow' data-testid='governance-section'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>Active Proposals</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Solar Panel Upgrade</span>
                    <span className='bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs'>
                      Voting
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-gray-600'>Community Fund</span>
                    <span className='bg-green-100 text-green-800 px-2 py-1 rounded text-xs'>
                      Passed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div data-testid='projects-section'>
              <h2 className='text-2xl font-bold mb-4'>Projects</h2>
              <p>Projects content here</p>
            </div>
          )}

          {activeTab === 'governance' && (
            <div data-testid='governance-proposals'>
              <h2 className='text-2xl font-bold mb-4'>Governance</h2>
              <p>Governance proposals here</p>
            </div>
          )}

          {activeTab === 'energy' && (
            <div data-testid='energy-dashboard'>
              <h2 className='text-2xl font-bold mb-4'>Energy Dashboard</h2>
              <p>Energy monitoring here</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
