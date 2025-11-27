"use client";

import React, { useState } from 'react';
import HHDAODashboard from '@/components/HHDAODashboard';

type Props = {
  onLogout?: () => void;
};

const SimpleDashboard: React.FC<Props> = ({ onLogout }) => {
  const [view, setView] = useState<'dashboard' | 'map' | 'community'>('dashboard');

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-900">HH</div>
            <h1 className="text-2xl">HeliosHash Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setView('dashboard')} className={`px-3 py-1 rounded ${view==='dashboard'?'bg-slate-700':'bg-slate-600'}`}>
              Dashboard
            </button>
            <button onClick={() => setView('map')} className={`px-3 py-1 rounded ${view==='map'?'bg-slate-700':'bg-slate-600'}`}>
              Map
            </button>
            <button onClick={() => setView('community')} className={`px-3 py-1 rounded ${view==='community'?'bg-slate-700':'bg-slate-600'}`}>
              Community
            </button>
            {onLogout && (
              <button onClick={onLogout} className="ml-4 px-3 py-1 rounded bg-rose-600">Logout</button>
            )}
          </div>
        </header>

        <main>
          {view === 'dashboard' && (
            // Prefer the richer HHDAODashboard if available; fallback content handled inside that component
            <div className="bg-slate-800 p-6 rounded">
              <HHDAODashboard />
            </div>
          )}

          {view === 'map' && (
            <section className="bg-slate-800 p-6 rounded">
              <h2 className="text-xl font-semibold mb-2">Project Map</h2>
              <div className="h-64 bg-slate-700 rounded flex items-center justify-center">Map placeholder</div>
            </section>
          )}

          {view === 'community' && (
            <section className="bg-slate-800 p-6 rounded">
              <h2 className="text-xl font-semibold mb-2">Community</h2>
              <div className="space-y-3">
                <div className="p-3 bg-slate-700 rounded">Post 1: Welcome to HeliosHash</div>
                <div className="p-3 bg-slate-700 rounded">Post 2: New microgrant awarded</div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default SimpleDashboard;
