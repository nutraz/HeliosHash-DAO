"use client"
import React from 'react';

const OpportunitiesTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold">Opportunities</h2>
      <p className="text-sm text-slate-600 mt-2">Available investments, grants, and supplier opportunities (stub).</p>

      <ul className="mt-4 space-y-2">
        <li className="p-3 bg-white rounded shadow-sm">Opportunity: Local operations contract</li>
        <li className="p-3 bg-white rounded shadow-sm">Opportunity: Community revenue share</li>
      </ul>
    </div>
  );
}

export default OpportunitiesTab;
