"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

type Props = {
  onAuth: () => void;
};

const AuthGate: React.FC<Props> = ({ onAuth }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const auth = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await auth.login();
      // If auth context reports authenticated, notify parent
      if (auth.isAuthenticated) {
        onAuth();
      } else {
        // Some identity providers redirect; best-effort call
        onAuth();
      }
    } catch (err) {
      console.error('Login failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Welcome to HeliosHash</h2>
        <p className="text-slate-300 mb-4">Sign in to continue to the DAO dashboard.</p>

        <label className="block mb-2 text-sm text-slate-300">Display name (optional)</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full mb-4 px-3 py-2 rounded bg-slate-700 text-white outline-none"
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogin}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <button
            onClick={() => {
              // Quick guest enter
              onAuth();
            }}
            className="px-3 py-2 rounded bg-slate-700 text-slate-300"
            disabled={loading}
          >
            Guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthGate;
