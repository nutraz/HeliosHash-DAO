"use client"

import React from 'react';

const navigationItems = [
  { id: 'projects', label: 'Projects', icon: '📋' },
  { id: 'rewards', label: 'Rewards', icon: '🎁' },
  { id: 'social', label: 'Social Hub', icon: '👥' },
  { id: 'dao', label: 'DAO Center', icon: '🏛️' },
  { id: 'nfts', label: 'NFT Collection', icon: '🖼️' },
  { id: 'wallet', label: 'Wallet', icon: '💰' },
  { id: 'opportunities', label: 'Opportunities', icon: '🔍' },
  { id: 'urgam', label: 'UrgamU Delhi', icon: '🌆' },
];

export default function SidebarNavigation() {
  // This component likely uses context or router for navigation
  // For now, we'll create a static sidebar that looks good
  
  return (
    <nav className="mt-4">
      <div className="space-y-1">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            onClick={() => {
              // Navigation would be handled by context or router in real implementation
              console.log(`Navigate to: ${item.id}`);
            }}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
