"use client";
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuditLogWidget from '@/components/AuditLogWidget';
import VCManager from '@/components/VCManager';

export default function RebuildDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">HHDAO — Dashboard (Rebuild Preview)</h1>
        <div>
          {user ? (
            <span>Member: {user.name || user.email || 'Authenticated User'}</span>
          ) : (
            <span>Guest</span>
          )}
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Status Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">Helios#Baghpat</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-400">Phase 1 - Planning</span>
            </div>
            <div className="flex justify-between">
              <span>Members:</span>
              <span>2/1500</span>
            </div>
            <div className="flex justify-between">
              <span>Funding:</span>
              <span>167.4/300.0K USDC</span>
            </div>
          </div>
        </div>

        {/* Audit Log Widget */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">Audit Trail</h2>
          <AuditLogWidget />
        </div>

        {/* VC Manager */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">Identity Management</h2>
          <VCManager />
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors">
              Join DAO
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors">
              Start KYC
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors">
              View Projects
            </button>
            <button className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg transition-colors">
              Connect Wallet
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
