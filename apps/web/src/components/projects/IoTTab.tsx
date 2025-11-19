"use client"
import React from 'react';

const IoTTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold">IoT & Live Data</h2>
      <p className="text-sm text-slate-600 mt-2">Live sensor feeds, oracle health, and telemetry (stub).</p>

      <div className="mt-4 space-y-2">
        <div className="p-3 bg-white rounded shadow-sm">Solar irradiance feed: 625 W/m² (placeholder)</div>
        <div className="p-3 bg-white rounded shadow-sm">Battery state: 82% (placeholder)</div>
      </div>
    </div>
  );
}

export default IoTTab;
