"use client"
import React from 'react';

const RwaTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold">RWA & Yields</h2>
      <p className="text-sm text-slate-600 mt-2">Financial model, yield curves, and claim history (stub).</p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-3 bg-white rounded shadow-sm">Yield projection chart (placeholder)</div>
        <div className="p-3 bg-white rounded shadow-sm">Distribution schedule (placeholder)</div>
      </div>
    </div>
  );
}

export default RwaTab;
