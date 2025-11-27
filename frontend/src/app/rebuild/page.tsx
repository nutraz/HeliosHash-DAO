"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RebuildLanding() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">HeliosHash DAO — Rebuild Preview</h1>
        <div>
          {isAuthenticated ? (
            <>
              <span className="mr-4">Welcome, {user?.name ?? 'Member'}</span>
              <button onClick={() => logout()} className="px-3 py-1 bg-gray-800 text-white rounded">Sign out</button>
            </>
          ) : (
            <>
              <button onClick={() => login()} className="px-3 py-1 bg-blue-600 text-white rounded">Sign in</button>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-3 text-sm text-slate-600">This is a development preview for the rebuilt landing and dashboard focused on canister integration and a working onboarding flow.</p>
            <div className="mt-4 space-x-2">
              <Link href="/rebuild/dashboard" className="px-4 py-2 bg-emerald-600 text-white rounded">Open Dashboard</Link>
              <Link href="/dev-canisters" className="px-4 py-2 bg-gray-200 text-slate-800 rounded">Dev Canisters</Link>
            </div>
          </div>

          <div className="p-6 bg-white rounded shadow">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>- Connect Internet Identity</li>
              <li>- View wallet & balances</li>
              <li>- Open proposal flows</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
