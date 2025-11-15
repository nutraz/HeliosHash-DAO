'use client';

import React, { useEffect, useState } from 'react';
import AuthGate from './AuthGate';
import SimpleDashboard from './SimpleDashboard';

const SplashScreen: React.FC = () => {
  const [isSplash, setIsSplash] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    // Keep a short splash for pleasant entry, then show auth
    const t = setTimeout(() => setIsSplash(false), 1800);
    return () => clearTimeout(t);
  }, []);

  if (isSplash) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-blue-900">HH</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">HeliosHash DAO</h1>
          <p className="text-xl mb-8 max-w-md mx-auto">
            Decentralized renewable energy management platform
          </p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  // After splash: show auth gate if not authenticated, otherwise dashboard
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {!isAuthed ? (
        <AuthGate onAuth={() => setIsAuthed(true)} />
      ) : (
        <SimpleDashboard onLogout={() => setIsAuthed(false)} />
      )}
    </div>
  );
};

export default SplashScreen;