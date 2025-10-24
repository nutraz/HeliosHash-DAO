'use client';

import { formatOWP } from '@/utils/currency';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/session')
      .then(res => res.json())
      .then(data => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <main role='main'>
  <div className='min-h-screen bg-background'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {/* Dashboard Header */}
          <div className='mb-8' data-testid='dashboard-header'>
            <h1 className='text-3xl font-bold text-foreground'>Dashboard</h1>
            <p className='mt-2 text-muted-foreground'>Welcome to your HeliosHash DAO dashboard</p>
            {user?.isWoman && (
              <div
                className='mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary'
                data-testid='women-bonus-badge'
              >
                20% Bonus
              </div>
            )}
          </div>

          {/* Search */}
          <div className='mb-8'>
            <input data-testid='search-input' placeholder='Search...'
              className='w-full max-w-xs px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary' />
          </div>

          {/* Tabs */}
          <div className='mb-8'>
            <nav className='flex space-x-8'>
              {['overview', 'projects', 'governance', 'energy'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                  data-testid={`${tab}-tab`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {/* Energy Stats */}
              <div className='bg-card text-card-foreground p-6 rounded-lg shadow' data-testid='energy-stats'>
                <h3 className='text-lg font-medium text-foreground mb-4'>Energy Statistics</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Solar Generation</span>
                    <span className='font-semibold'>1,250 kWh</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>CO2 Saved</span>
                    <span className='font-semibold'>850 kg</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Efficiency</span>
                    <span className='font-semibold'>92%</span>
                  </div>
                </div>
              </div>

              {/* Token Balance */}
              <div className='bg-card text-card-foreground p-6 rounded-lg shadow' data-testid='token-balance'>
                <h3 className='text-lg font-medium text-foreground mb-4'>Token Balance</h3>
                <div className='text-3xl font-bold text-secondary mb-2'>
                  {formatOWP(user?.isWoman ? 2930 : 2450)}
                </div>
                <p className='text-muted-foreground'>One World Protocol Tokens</p>
              </div>

              {/* Governance Section */}
              <div className='bg-card text-card-foreground p-6 rounded-lg shadow' data-testid='governance-section'>
                <h3 className='text-lg font-medium text-foreground mb-4'>Active Proposals</h3>
                <div className='space-y-2'>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground'>Solar Panel Upgrade</span>
                    <span className='bg-primary/10 text-primary px-2 py-1 rounded text-xs'>
                      Voting
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-muted-foreground'>Community Fund</span>
                    <span className='bg-secondary/10 text-secondary px-2 py-1 rounded text-xs'>
                      Passed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div data-testid='projects-section'>
              <h2 className='text-2xl font-bold mb-4 text-foreground'>Projects</h2>
              <p className='text-muted-foreground'>Projects content here</p>
            </div>
          )}

          {activeTab === 'governance' && (
            <div data-testid='governance-proposals'>
              <h2 className='text-2xl font-bold mb-4 text-foreground'>Governance</h2>
              <p className='text-muted-foreground'>Governance proposals here</p>
            </div>
          )}

          {activeTab === 'energy' && (
            <div data-testid='energy-dashboard'>
              <h2 className='text-2xl font-bold mb-4 text-foreground'>Energy Dashboard</h2>
              <p className='text-muted-foreground'>Energy monitoring here</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
