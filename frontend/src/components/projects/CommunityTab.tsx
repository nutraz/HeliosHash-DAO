"use client"
import React from 'react';

const CommunityTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold">Community Hub</h2>
      <p className="text-sm text-slate-600 mt-2">Community posts, local stakeholders, and co-ownership details (stub).</p>

      <div className="mt-4 space-y-3">
        <div className="p-3 bg-white rounded shadow-sm">Post 1 — Community meeting summary</div>
        <div className="p-3 bg-white rounded shadow-sm">Post 2 — Farmer onboarding details</div>
      </div>
    </div>
  );
}

export default CommunityTab;
