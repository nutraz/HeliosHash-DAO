"use client";

import React, { useState, useEffect } from 'react';
import { fetchUserTokens, fetchProposals } from '../lib/dfinity';

type Proposal = {
  id: number;
  title: string;
  description: string;
  amount: number;
  votes: number;
};

export default function WorkingDashboard(): JSX.Element {
  const [tokens, setTokens] = useState<number | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);

  // ACTUAL DATA LOADING
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userTokens, proposalsData] = await Promise.all([
          fetchUserTokens(),
          fetchProposals()
        ]);
        setTokens(userTokens ?? null);
        setProposals((proposalsData as Proposal[]) || []);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Fallback data
        setTokens(25000);
        setProposals([
          {
            id: 1,
            title: 'Solar Farm Expansion',
            description: 'Expand our solar mining operations',
            amount: 100000,
            votes: 150
          },
          {
            id: 2,
            title: 'Village Microgrid',
            description: 'Build community energy infrastructure',
            amount: 50000,
            votes: 80
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        
        {/* SIMPLE HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-500">HELIOSHASH DAO</h1>
          <p className="text-gray-400">Solar-Powered Bitcoin Mining</p>
        </div>

        {/* USER INFO - SIMPLE CARD */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold">Miner #047</h2>
              <p className="text-gray-400">{(tokens ?? 0).toLocaleString()} HHU</p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-orange-500 px-4 py-2 rounded">Send</button>
              <button className="bg-green-500 px-4 py-2 rounded">Receive</button>
            </div>
          </div>
        </div>

        {/* STATS GRID - RESPONSIVE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded text-center">
            <p className="text-gray-400">Hash Rate</p>
            <p className="text-xl font-semibold">352 TH/s</p>
          </div>
          <div className="bg-gray-800 p-4 rounded text-center">
            <p className="text-gray-400">BTC Mined</p>
            <p className="text-xl font-semibold">0.0034 BTC</p>
          </div>
          <div className="bg-gray-800 p-4 rounded text-center">
            <p className="text-gray-400">Solar Power</p>
            <p className="text-xl font-semibold">4.8 MW</p>
          </div>
        </div>

        {/* ACTIONS - SIMPLE BUTTONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <button className="bg-blue-500 p-3 rounded text-sm">Boost Power</button>
          <button className="bg-green-500 p-3 rounded text-sm">New Proposal</button>
          <button className="bg-purple-500 p-3 rounded text-sm">Mining Rigs</button>
          <button className="bg-cyan-500 p-3 rounded text-sm">Analytics</button>
        </div>

        {/* PROPOSALS LIST - CLEAN AND SIMPLE */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Live Proposals ({proposals.length})</h3>
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="bg-gray-700 p-4 rounded">
                <h4 className="font-semibold">{proposal.title}</h4>
                <p className="text-gray-400 text-sm mb-2">{proposal.description}</p>
                <div className="flex justify-between text-sm items-center">
                  <span>{proposal.amount.toLocaleString()} HHU</span>
                  <span>{proposal.votes} votes</span>
                  <button className="bg-orange-500 px-3 py-1 rounded text-xs">Vote</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
