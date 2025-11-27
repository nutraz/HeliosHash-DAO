"use client"

import React, { useState } from 'react';
import ProfileSection from './ProfileSection';
import ProjectsPanel from './ProjectsPanel';
import RewardsPanel from './RewardsPanel';
import SocialHubPanel from './SocialHubPanel';
import DAOCenterPanel from './DAOCenterPanel';
import NFTCollection from './NFTCollection';
import WalletPanel from './WalletPanel';
import OpportunitiesPanel from './OpportunitiesPanel';

export default function DashboardView() {
  const [activeView, setActiveView] = useState('profile');

  const renderView = () => {
    switch (activeView) {
      case 'profile':
        return <ProfileSection user={{}} balance={0} stats={{ contributions: 0, rewards: 0, projectCount: 0 }} />;
      case 'projects':
        return <ProjectsPanel />;
      case 'rewards':
        return <RewardsPanel />;
      case 'social':
        return <SocialHubPanel />;
      case 'dao':
        return <DAOCenterPanel />;
      case 'nfts':
        return <NFTCollection />;
      case 'wallet':
        // Create mock props for WalletPanel
        const mockStats = { contributions: 0, rewards: 0, projectCount: 0 };
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Wallet</h2>
            <p className="text-gray-600">Wallet functionality coming soon...</p>
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-gray-500">Contributions</div>
                  <div className="text-lg font-bold">{mockStats.contributions}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Rewards</div>
                  <div className="text-lg font-bold">{mockStats.rewards} HHU</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Projects</div>
                  <div className="text-lg font-bold">{mockStats.projectCount}</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'opportunities':
        return <OpportunitiesPanel />;
      default:
        return <ProfileSection user={{}} balance={0} stats={{ contributions: 0, rewards: 0, projectCount: 0 }} />;
    }
  };

  const navItems = [
    { id: 'profile', label: 'Profile' },
    { id: 'projects', label: 'Projects' },
    { id: 'rewards', label: 'Rewards' },
    { id: 'social', label: 'Social' },
    { id: 'dao', label: 'DAO Center' },
    { id: 'nfts', label: 'NFTs' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'opportunities', label: 'Opportunities' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium ${
                    activeView === item.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderView()}
      </main>
    </div>
  );
}
