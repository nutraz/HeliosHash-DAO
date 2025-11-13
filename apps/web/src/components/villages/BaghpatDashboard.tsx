'use client';

import { useState, useEffect } from 'react';
import CommunityHub from './CommunityHub';
import LiveDataView from './LiveDataView';
import OpportunitiesBoard from './OpportunitiesBoard';
import ProjectNode from './ProjectNode';
import { OwpLogo } from './IconComponents';

enum Tab {
  Overview = 'Overview',
  Community = 'Community',
  Opportunities = 'Opportunities',
  LiveData = 'Live Data',
}

interface LiveData {
  panels: number;
  current_kW: number;
  today_kWh: number;
  uptime: string;
  temp: string;
}

export default function BaghpatDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Overview);
  const [liveData, setLiveData] = useState<LiveData>({
    panels: 42,
    current_kW: 18.5,
    today_kWh: 124.3,
    uptime: '99.8%',
    temp: '28°C'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        current_kW: parseFloat((Math.random() * 5 + 15).toFixed(1)),
        today_kWh: Number((prev.today_kWh + (Math.random() * 0.5)).toFixed(2)),
        temp: `${Math.floor(Math.random() * 5 + 26)}°C`
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Community:
        return <CommunityHub />;
      case Tab.Opportunities:
        return <OpportunitiesBoard />;
      case Tab.LiveData:
        return <LiveDataView data={liveData} />;
      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 backdrop-blur-md rounded-xl border border-cyan-500/30 p-6">
              <div className="flex items-center gap-4">
                <OwpLogo className="h-16 w-16 text-cyan-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white font-orbitron">Welcome to Helios#Baghpat</h2>
                  <p className="text-slate-300 mt-1">India&apos;s first ICP-powered solar village DAO</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-4">
                <div className="text-slate-400 text-sm">Solar Panels</div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">{liveData.panels}</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-4">
                <div className="text-slate-400 text-sm">Current Output</div>
                <div className="text-2xl font-bold text-green-400 mt-1">{liveData.current_kW} kW</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-4">
                <div className="text-slate-400 text-sm">Today&apos;s Energy</div>
                <div className="text-2xl font-bold text-purple-400 mt-1">{liveData.today_kWh.toFixed(1)} kWh</div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-4">
                <div className="text-slate-400 text-sm">Uptime</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">{liveData.uptime}</div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Connected Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProjectNode
                  id="solar-1"
                  title="Solar Panel Array A"
                  tagline="Main power generation unit"
                  icon="☀️"
                  status="live"
                  energy="12.3 kW"
                  members="45"
                />
                <ProjectNode
                  id="solar-2"
                  title="Solar Panel Array B"
                  tagline="Secondary power unit"
                  icon="🔋"
                  status="live"
                  energy="6.2 kW"
                  members="32"
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900">
      <nav className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto">
            {Object.values(Tab).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${activeTab === tab ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  );
}
