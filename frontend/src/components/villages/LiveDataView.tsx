'use client';

import React, { useState, useEffect } from 'react';
import { SunIcon, ZapIcon, ClockIcon, ThermometerIcon, ChipIcon } from './IconComponents';

type LiveData = {
  panels: number;
  current_kW: number;
  today_kWh: number;
  uptime: string;
  temp: string;
};

interface Props {
  data?: LiveData;
}

const LiveDataView: React.FC<Props> = ({ data: initialData }) => {
  const [liveData, setLiveData] = useState<LiveData>(
    initialData || {
      panels: 240,
      current_kW: 94.2,
      today_kWh: 847,
      uptime: '99.8%',
      temp: '42°C'
    }
  );
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // If data was passed in from a parent, treat it as controlled and don't
    // start the internal simulation interval. Otherwise, simulate updates.
    if (initialData) return;

    const interval = setInterval(() => {
      setLiveData(prevData => ({
        ...prevData,
        current_kW: parseFloat((prevData.current_kW + (Math.random() - 0.5) * 2).toFixed(2)),
        today_kWh: Math.round(prevData.today_kWh + Math.random() * 2),
        temp: `${(42 + (Math.random() - 0.5) * 2).toFixed(1)}°C`
      }));
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [initialData]);

  const dataPoints = [
    { icon: ZapIcon, label: 'Current Output', value: `${liveData.current_kW} kW`, color: 'text-green-400' },
    { icon: SunIcon, label: 'Energy Today', value: `${liveData.today_kWh} kWh`, color: 'text-yellow-400' },
    { icon: ThermometerIcon, label: 'Panel Temp', value: liveData.temp, color: 'text-red-400' },
    { icon: ClockIcon, label: 'System Uptime', value: liveData.uptime, color: 'text-blue-400' },
    { icon: ChipIcon, label: 'Active Panels', value: liveData.panels, color: 'text-purple-400' },
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 shadow-lg">
       <div className="p-4 flex justify-between items-center border-b border-slate-700">
            <div>
                 <h3 className="font-orbitron text-lg font-bold text-white">Live IoT Dashboard</h3>
                 <p className="text-sm text-slate-400">Data signed by IoT device & streamed from ICP Canister</p>
            </div>
            <div className="text-right text-xs text-slate-400">
                <div className="flex items-center gap-2">
                     <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>
            </div>
        </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {dataPoints.map(({ icon: Icon, label, value, color }, index) => (
          <div key={index} className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-lg border border-slate-700 text-center transform transition-transform hover:scale-105 hover:bg-slate-800">
            <Icon className={`w-10 h-10 mb-3 ${color}`} />
            <p className="text-sm text-slate-400">{label}</p>
            <p className={`text-2xl font-bold font-orbitron ${color}`}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveDataView;
