'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BaghpatDashboard from '@/components/villages/BaghpatDashboard';

interface Village {
  id: string;
  name: string;
  location: string;
  status: 'live' | 'offline' | 'maintaining';
  panels: number;
  currentKw: number;
  members: number;
  icon: string;
}

export default function VillagesPage() {
  const router = useRouter();
  const [selectedVillage, setSelectedVillage] = useState<string | null>(null);

  const villages: Village[] = [
    {
      id: 'baghpat',
      name: 'Helios#Baghpat',
      location: 'Baghpat, India',
      status: 'live',
      panels: 42,
      currentKw: 18.5,
      members: 125,
      icon: '🏛️'
    },
    {
      id: 'solar-valley',
      name: 'Solar Valley',
      location: 'Coming Soon',
      status: 'offline',
      panels: 0,
      currentKw: 0,
      members: 0,
      icon: '🌄'
    },
    {
      id: 'energy-hub',
      name: 'Energy Hub',
      location: 'Coming Soon',
      status: 'offline',
      panels: 0,
      currentKw: 0,
      members: 0,
      icon: '⚡'
    }
  ];

  if (selectedVillage === 'baghpat') {
    return (
      <div className="min-h-screen">
        {/* Back Button */}
        <div className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700 p-4">
          <button
            onClick={() => setSelectedVillage(null)}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-all"
          >
            <span>←</span>
            <span>Back to Villages</span>
          </button>
        </div>
        
        {/* Full Baghpat Dashboard */}
        <BaghpatDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white font-orbitron">
                🌍 Village Dashboards
              </h1>
              <p className="text-slate-400 mt-2">
                Decentralized Solar Communities • Powered by ICP
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Villages Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {villages.map((village) => (
            <div
              key={village.id}
              className={`
                bg-slate-800/50 backdrop-blur-md rounded-xl border 
                ${village.status === 'live' 
                  ? 'border-cyan-500/30 hover:border-cyan-500 cursor-pointer' 
                  : 'border-slate-700'
                }
                p-6 transition-all duration-300
                ${village.status === 'live' ? 'hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20' : ''}
              `}
              onClick={() => village.status === 'live' && setSelectedVillage(village.id)}
            >
              {/* Village Icon */}
              <div className="text-5xl mb-4">{village.icon}</div>

              {/* Village Info */}
              <h2 className="text-2xl font-bold text-white mb-2 font-orbitron">
                {village.name}
              </h2>
              <p className="text-slate-400 text-sm mb-4">📍 {village.location}</p>

              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`
                  w-2 h-2 rounded-full 
                  ${village.status === 'live' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}
                `} />
                <span className={`
                  text-xs font-semibold uppercase
                  ${village.status === 'live' ? 'text-green-400' : 'text-red-400'}
                `}>
                  {village.status}
                </span>
              </div>

              {/* Stats */}
              {village.status === 'live' ? (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Solar Panels:</span>
                    <span className="text-white font-semibold">{village.panels}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Power:</span>
                    <span className="text-cyan-400 font-semibold">{village.currentKw} kW</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Community:</span>
                    <span className="text-purple-400 font-semibold">{village.members} members</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Coming Soon...</p>
              )}

              {/* Action Button */}
              {village.status === 'live' && (
                <button className="mt-4 w-full py-2 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  Open Dashboard →
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add Village Button (for admins) */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all">
            + Add New Village
          </button>
        </div>
      </main>
    </div>
  );
}
