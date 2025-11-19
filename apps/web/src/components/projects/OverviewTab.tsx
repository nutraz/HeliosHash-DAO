"use client"
import React from 'react';

const OverviewTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold">Overview</h2>
      <p className="text-sm text-slate-600 mt-2">Project summary, quick KPIs, and funding status (stub).</p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-3 bg-slate-50 rounded">Funding: <strong>65%</strong></div>
        <div className="p-3 bg-slate-50 rounded">Capacity: <strong>12.4 MWp</strong></div>
        <div className="p-3 bg-slate-50 rounded">Expected Yield: <strong>8.2% p.a.</strong></div>
      </div>
    </div>
  );
}

export default OverviewTab;
