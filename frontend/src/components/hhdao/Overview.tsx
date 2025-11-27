"use client";
import React from 'react';

export interface OverviewProps {
  title?: string;
  subtitle?: string;
}

const Overview: React.FC<OverviewProps> = ({ title = 'Overview', subtitle = 'Summary of activity' }) => {
  return (
    <section className="bg-gray-800 p-4 rounded-md">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
        <div className="text-sm text-gray-300">Updated: just now</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-gray-900 rounded">Projects: <span className="font-bold">12</span></div>
        <div className="p-3 bg-gray-900 rounded">Active Devices: <span className="font-bold">42</span></div>
  <div className="p-3 bg-gray-900 rounded">Today&apos;s kWh: <span className="font-bold">318</span></div>
      </div>
    </section>
  );
};

export default Overview;
