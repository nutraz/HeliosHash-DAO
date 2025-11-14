// apps/web/src/modules/UrgamUDelhi/UrgamUDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import { useHeliosLiveStats } from '@/lib/api/heliosBaghpat';

enum Tab {
  Overview = 'Overview',
  Mining = 'Mining Stats',
  Energy = 'Energy Monitor',
  ROI = 'ROI Tracker'
}

interface EnergyStats {
  solarOutput: string;
  batteryLevel: string;
  gridUsage: string;
  surplus: string;
}

interface UrgamUDashboardProps {
  language?: string;
}

export default function UrgamUDelhiDashboard({ language }: UrgamUDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Overview);
  const { data } = useHeliosLiveStats('urgamu-delhi');
  
  // State for rate-based power calculation
  const [previousSolarKwh, setPreviousSolarKwh] = useState<number | undefined>();
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | undefined>();
  const [energyStats, setEnergyStats] = useState<EnergyStats>({
    solarOutput: '45.2 kW',
    batteryLevel: '87%',
    gridUsage: '2.1 kW',
    surplus: '39.3 kW'
  });

  // Rate-based power calculation
  const calculateInstantPower = (solarKwh: number, prevKwh?: number, timeDiffHours?: number): number => {
    if (prevKwh !== undefined && timeDiffHours && timeDiffHours > 0) {
      const powerKW = (solarKwh - prevKwh) / timeDiffHours;
      return Math.max(0, Math.min(50, powerKW));
    }
    
    const hour = new Date().getHours();
    const solarProfile = [0, 0, 0, 0, 0.1, 0.3, 0.6, 0.8, 0.9, 1.0, 0.95, 0.85, 0.7, 0.5, 0.3, 0.1, 0, 0, 0, 0, 0, 0, 0, 0];
    const estimatedKW = 50 * solarProfile[hour];
    return estimatedKW;
  };

  // Update energy stats when live data changes
  useEffect(() => {
    if (data?.solar_kwh && typeof data.solar_kwh === 'number') {
      const now = new Date();
      let timeDiffHours = 1;

      if (previousSolarKwh !== undefined && lastUpdateTime) {
        timeDiffHours = (now.getTime() - lastUpdateTime.getTime()) / (1000 * 60 * 60);
        timeDiffHours = Math.max(0.1, Math.min(24, timeDiffHours));
      }

      const instantKW = calculateInstantPower(data.solar_kwh, previousSolarKwh, timeDiffHours);
      setEnergyStats(prev => ({
        ...prev,
        solarOutput: `${instantKW.toFixed(1)} kW`
      }));

      setPreviousSolarKwh(data.solar_kwh);
      setLastUpdateTime(now);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.solar_kwh]);

  // Demo simulation (fluctuating stats)
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyStats(prev => ({
        ...prev,
        solarOutput: `${(Math.random() * 10 + 45).toFixed(1)} kW`,
        batteryLevel: `${Math.floor(Math.random() * 10 + 80)}%`,
        gridUsage: `${(Math.random() * 1 + 1.5).toFixed(1)} kW`,
        surplus: `${(Math.random() * 10 + 35).toFixed(1)} kW`
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div data-language={language} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {Object.values(Tab).map(tab => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-6">
          {activeTab === Tab.Overview && (
            <div className="space-y-6">
              {/* Banner */}
              <div className="bg-gradient-to-r from-orange-900/50 to-amber-900/50 backdrop-blur-md rounded-xl border border-orange-500/30 p-6">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">⛏️</div>
                  <div>
                    <h2 className="text-2xl font-bold text-white font-orbitron">
                      UrgamU Delhi Mining Center
                    </h2>
                    <p className="text-slate-300 mt-1">
                      Solar-Powered Bitcoin Mining • 3 Acres • 50 kW Capacity
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(energyStats).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-4"
                  >
                    <div className="text-slate-400 text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    <div className="text-2xl font-bold text-yellow-400 mt-1">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === Tab.Mining && <div className="text-white">Mining Stats Content</div>}
          {activeTab === Tab.Energy && <div className="text-white">Energy Monitor Content</div>}
          {activeTab === Tab.ROI && <div className="text-white">ROI Tracker Content</div>}
        </div>
      </div>
    </div>
  );
}
