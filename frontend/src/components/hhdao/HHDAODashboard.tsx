"use client"

import React, { useState } from 'react';
import ProfileSection from './ProfileSection';
import SidebarNavigation from './SidebarNavigation';
import ProjectsPanel from './ProjectsPanel';
import RewardsPanel from './RewardsPanel';
import SocialHubPanel from './SocialHubPanel';
import DAOCenterPanel from './DAOCenterPanel';
import NFTCollection from './NFTCollection';
import OpportunitiesPanel from './OpportunitiesPanel';
import UrgamUDelhiPanel from './UrgamUDelhiPanel';

export default function HHDAODashboard() {
  const [activePanel, setActivePanel] = useState('projects');

  // Mock user data for ProfileSection
  const mockUserData = {
    user: { name: 'Guest User', rank: 'Visitor' },
    balance: 0,
    stats: { contributions: 0, rewards: 0, projectCount: 0 }
  };

  const renderPanel = () => {
    switch (activePanel) {
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
        // Create a simple wallet view instead of using WalletPanel with complex props
        return (
          <div className="p-6 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Wallet</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-700 rounded">
                <h3 className="text-lg font-semibold mb-2">Balance</h3>
                <p className="text-3xl font-bold text-green-400">0 HHU</p>
                <p className="text-sm text-gray-400">HeliosHash Utility Tokens</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-700 rounded text-center">
                  <div className="text-sm text-gray-400">Contributions</div>
                  <div className="text-xl font-bold">0</div>
                </div>
                <div className="p-4 bg-gray-700 rounded text-center">
                  <div className="text-sm text-gray-400">Rewards</div>
                  <div className="text-xl font-bold">0 HHU</div>
                </div>
                <div className="p-4 bg-gray-700 rounded text-center">
                  <div className="text-sm text-gray-400">Projects</div>
                  <div className="text-xl font-bold">0</div>
                </div>
              </div>

              <div className="p-4 bg-gray-700 rounded">
                <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
                <p className="text-gray-400 text-center py-4">No transactions yet</p>
              </div>
            </div>
          </div>
        );
      case 'opportunities':
        return <OpportunitiesPanel />;
      case 'urgam':
        return <UrgamUDelhiPanel />;
      default:
        return <ProjectsPanel />;
    }
  };

  // Handle navigation from sidebar
  const handleNavigation = (panel: string) => {
    setActivePanel(panel);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex gap-6">
        <aside className="w-72">
          <ProfileSection 
            user={mockUserData.user}
            balance={mockUserData.balance}
            stats={mockUserData.stats}
          />
          {/* SidebarNavigation likely handles its own navigation internally */}
          <SidebarNavigation />
        </aside>
        <main className="flex-1">
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}
