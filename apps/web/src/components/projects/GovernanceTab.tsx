"use client"
import React from 'react';

const GovernanceTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold">Governance</h2>
      <p className="text-sm text-slate-600 mt-2">Proposals, voting weight, and governance controls (stub).</p>

      <div className="mt-4">
        <div className="p-3 bg-white rounded shadow-sm">No active proposals (demo)</div>
      </div>
    </div>
  );
}

export default GovernanceTab;
