 'use client';

import { useState, useEffect } from 'react';
import { fetchUserTokens, fetchProposals, createProposal } from '../lib/dfinity';
import { 
  Zap, Sun, Flame, Skull, Sword, Crown, Coins, 
  TrendingUp, Users, Sparkles, Rocket, Gem,
  // icons
  Bitcoin, Cpu, Wifi, Shield, Target
} from 'lucide-react';
import styles from './HHDAODashboard.module.css';

export default function BadassHHDAODashboard() {
  const [tokens, setTokens] = useState<number | null>(null);
  const [proposals, setProposals] = useState<any[] | null>(null);
  const [isCreatingProposal, setIsCreatingProposal] = useState(false);

  const [liveStats, setLiveStats] = useState({
    hashRate: '335 TH/s',
    btcMined: '0.0034 BTC',
    energyOutput: '4.8 MW',
    activeMiners: 47,
    daoPower: '89%',
    treasury: '2.5M HHU'
  });

  // Additional live UI state
  const [miningAnimation, setMiningAnimation] = useState(false);
  const [liveBitcoinPrice, setLiveBitcoinPrice] = useState('$43,250');
  const [activeMiners, setActiveMiners] = useState(47);

  useEffect(() => {
    void loadData();

    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        hashRate: `${Math.floor(Math.random() * 100 + 300)} TH/s`,
        btcMined: `0.00${Math.floor(Math.random() * 40 + 30)} BTC`,
        energyOutput: `${(Math.random() * 2 + 4.5).toFixed(1)} MW`
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Mining animation, BTC price and active miners simulation
  useEffect(() => {
    const miningInterval = setInterval(() => {
      setMiningAnimation(true);
      setTimeout(() => setMiningAnimation(false), 500);
    }, 3000);

    const priceInterval = setInterval(() => {
      const change = (Math.random() - 0.5) * 1000;
      const newPrice = 43250 + change;
      setLiveBitcoinPrice(`$${newPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
    }, 5000);

    const minersInterval = setInterval(() => {
      setActiveMiners(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 10000);

    return () => {
      clearInterval(miningInterval);
      clearInterval(priceInterval);
      clearInterval(minersInterval);
    };
  }, []);

  const loadData = async () => {
    try {
      const [userTokens, proposalsData] = await Promise.all([
        fetchUserTokens(),
        fetchProposals()
      ]);
      setTokens(typeof userTokens === 'number' ? userTokens : Number(userTokens ?? 0));
      setProposals(Array.isArray(proposalsData) ? proposalsData : []);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load data', err);
      setTokens(25000);
      setProposals([]);
    }
  };

  const createBadassProposal = async () => {
    setIsCreatingProposal(true);
    try {
      await createProposal(
        '⚡ EXPAND MINING OPERATIONS',
        'Scale our solar-powered Bitcoin mining to 10MW. More hash rate, more power, more profits for the DAO!',
        5000000
      );
      await loadData();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('create proposal failed', err);
    } finally {
      setIsCreatingProposal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent animate-pulse" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto p-4 space-y-6">
        <div className="text-center space-y-4 relative">
          {/* Mining animation overlay */}
          {miningAnimation && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent animate-pulse rounded-full" />
          )}
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl animate-ping" />
              <div className="relative bg-gradient-to-br from-orange-400 to-red-500 p-3 rounded-full">
                <Zap className="text-white w-8 h-8" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-orange-400 via-yellow-400 to-red-500 bg-clip-text text-transparent animate-pulse">HELIOSHASH</h1>
          </div>
          <p className="text-xl text-gray-300 font-mono tracking-widest border border-orange-500/50 inline-block px-6 py-2 rounded-full bg-black/50 backdrop-blur-sm">⚡ SOLAR-POWERED BITCOIN MINING DAO</p>
        </div>

        {/* Bitcoin price ticker */}
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black p-3 rounded-xl mb-6">
          <div className="flex items-center justify-center space-x-4 font-mono font-black text-sm">
            <Bitcoin className="w-5 h-5" />
            <span>BTC: {liveBitcoinPrice}</span>
            <span className="text-green-600">↑ 2.3%</span>
            <span>•</span>
            <span>ACTIVE MINERS: {activeMiners}</span>
            <span>•</span>
            <span className="flex items-center space-x-1"><span>NETWORK: </span><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span>LIVE</span></span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border border-orange-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=miner&backgroundColor=ff6b35,ff8e53" className="w-16 h-16 rounded-full border-2 border-orange-500" alt="Miner" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                  <Crown className="w-3 h-3 text-black" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">MINER #047</h2>
                <p className="text-orange-300 font-mono">TOP 5% HASH CONTRIBUTOR</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-orange-300">ACTIVE MINER</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-gray-400 text-sm">POWER BALANCE</p>
              <p className="text-3xl font-black text-white font-mono">{tokens?.toLocaleString() || '25,000'} HHU</p>
              <div className="flex space-x-2 mt-3">
                <button className="bg-orange-500 hover:bg-orange-600 text-black px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105">⚡ SEND</button>
                <button className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg font-bold text-sm transition-all hover:scale-105">💰 RECEIVE</button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-black/50 border border-green-500/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-green-400 mb-2"><Cpu className="w-5 h-5" /><span className="text-sm font-mono">HASH RATE</span></div>
            <p className="text-2xl font-black text-white font-mono">{liveStats.hashRate}</p>
            <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
              <div className={`bg-green-500 h-2 rounded-full animate-pulse ${styles.progressInner} ${styles.pct85}`} />
            </div>
          </div>

          <div className="bg-black/50 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-yellow-400 mb-2"><Bitcoin className="w-5 h-5" /><span className="text-sm font-mono">BTC MINED</span></div>
            <p className="text-2xl font-black text-white font-mono">{liveStats.btcMined}</p>
            <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
              <div className={`bg-yellow-500 h-2 rounded-full animate-pulse ${styles.progressInner} ${styles.pct67 || styles.pct65}`} />
            </div>
          </div>

          <div className="bg-black/50 border border-orange-500/30 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-2 text-orange-400 mb-2"><Zap className="w-5 h-5" /><span className="text-sm font-mono">SOLAR POWER</span></div>
            <p className="text-2xl font-black text-white font-mono">{liveStats.energyOutput}</p>
            <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
              <div className={`bg-orange-500 h-2 rounded-full animate-pulse ${styles.progressInner} ${styles.pct90 || styles.pct95}`} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-gradient-to-r from-orange-500 to-red-500 text-black p-4 rounded-xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-orange-500/50">🚀 BOOST POWER</button>
          <button onClick={createBadassProposal} disabled={isCreatingProposal} className="bg-gradient-to-r from-green-500 to-emerald-500 text-black p-4 rounded-xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-green-500/50 disabled:opacity-50">{isCreatingProposal ? '⚡ CREATING...' : '💎 NEW PROPOSAL'}</button>
          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-black p-4 rounded-xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-blue-500/50">🔧 MINING RIGS</button>
          <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-black p-4 rounded-xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-purple-500/50">📊 ANALYTICS</button>
        </div>

        <div className="bg-black/50 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white flex items-center space-x-3"><Target className="text-purple-400" /><span>LIVE PROPOSALS • {proposals?.length || 0} ACTIVE</span></h2>
            <div className="flex items-center space-x-2 bg-red-500/20 border border-red-500 px-3 py-1 rounded-full"><div className="w-2 h-2 bg-red-500 rounded-full animate-ping" /><span className="text-red-400 font-mono text-sm">LIVE VOTING</span></div>
          </div>

          <div className="space-y-4">
            {proposals?.map((proposal, index) => {
              const percent = Math.min(100, ((proposal.votes || 0) / 200) * 100);
              const bucket = Math.round(percent / 5) * 5;
              const cls = styles[`pct${bucket}`] || styles.pct100;
              return (
                <div key={index} className="bg-gradient-to-r from-gray-900 to-black border-2 border-orange-500/50 rounded-xl p-4 hover:border-orange-500 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-white mb-2">{proposal.title}</h3>
                      <p className="text-gray-300 mb-3">{proposal.description}</p>

                      {/* Progress bar */}
                      <div className="w-full bg-gray-800 rounded-full h-2 mb-3">
                        <div className={`bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-1000 ${styles.progressInner} ${cls}`} />
                      </div>

                      <div className="flex items-center space-x-6 text-sm">
                        <span className="text-orange-400 font-mono">💰 {proposal.amount?.toLocaleString()} HHU</span>
                        <span className="text-green-400 font-mono">🗳️ {proposal.votes || Math.floor(Math.random() * 200)} VOTES</span>
                        <span className="text-purple-400 font-mono">⏰ 24H LEFT</span>
                        <span className="text-cyan-400 font-mono">📈 {Math.floor(Math.random() * 30 + 50)}% SUPPORT</span>
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-black px-6 py-3 rounded-lg font-black hover:scale-105 transition-transform hover:shadow-2xl hover:shadow-green-500/50">VOTE NOW</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border border-orange-500/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-black text-white">⚡ SOLAR BITCOIN MINING HUB</h3><div className="flex items-center space-x-2 bg-green-500/20 border border-green-500 px-3 py-1 rounded-full"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><span className="text-green-400 text-sm font-mono">MINING LIVE</span></div></div>
            <div className="space-y-3"><div className="flex justify-between"><span className="text-gray-400">FUNDING</span><span className="text-white font-black">₹2.5 CR</span></div><div className="flex justify-between"><span className="text-gray-400">HASH RATE</span><span className="text-orange-400 font-black">335 TH/S</span></div><div className="flex justify-between"><span className="text-gray-400">STATUS</span><span className="text-green-400 font-black">100% ONLINE</span></div></div>
          </div>

          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500/50 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-black text-white">🌍 HELIOS#BAGHPAT VILLAGE DAO</h3><div className="flex items-center space-x-2 bg-blue-500/20 border border-blue-500 px-3 py-1 rounded-full"><div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" /><span className="text-blue-400 text-sm font-mono">COMMUNITY LIVE</span></div></div>
            <div className="space-y-3"><div className="flex justify-between"><span className="text-gray-400">FUNDING</span><span className="text-white font-black">₹85L</span></div><div className="flex justify-between"><span className="text-gray-400">ENERGY OUTPUT</span><span className="text-green-400 font-black">35.1 MWH</span></div><div className="flex justify-between"><span className="text-gray-400">HOUSEHOLDS</span><span className="text-blue-400 font-black">35 POWERED</span></div></div>
          </div>
        </div>

        <div className="text-center py-8">
          <p className="text-gray-500 font-mono tracking-widest">⚡ POWERED BY HELIOSHASH DAO • SOLAR-POWERED BITCOIN MINING • BUILT ON INTERNET COMPUTER</p>
        </div>
      </div>
    </div>
  );
}
 