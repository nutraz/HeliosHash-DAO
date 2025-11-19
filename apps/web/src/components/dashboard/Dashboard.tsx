"use client";

import React, { useState } from 'react';
import AuthButtons from '@/components/auth/AuthButtons';
import { useRouter } from 'next/navigation';
import {
  Award, Users, TrendingUp, Gift, Map, MessageSquare,
  Send, ArrowDownLeft, Image, ChevronRight, CheckCircle, Zap
} from 'lucide-react';

const Dashboard = () => {
  const [showNFTCollection, setShowNFTCollection] = useState(false);
  const router = useRouter();
  
  const [userData, setUserData] = React.useState<any>(null);

  React.useEffect(() => {
    let mounted = true;
    fetch('/api/users')
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        const u = json?.ok;
        if (u) setUserData(u);
      })
      .catch(() => {
        // fallback static
        setUserData({ name: 'Rahul Kumar', pfp: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', rank: 'Investor & Collaborator', communityRole: 'Community Manager', stats: { projectsStarted: 3, projectsHelped: 12, membersAdded: 45 }, tokenBalance: 15000, nftCollection: [] });
      });
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Zap className="text-white" size={20} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold">HHDAO</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button aria-label="Notifications" className="p-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
            <button aria-label="Quick actions" className="p-2 rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 9.96l4.24 4.24M1 12h6m6 0h6"></path>
              </svg>
            </button>
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img src={userData?.pfp || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anon'} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <AuthButtons />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* User Profile Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 sm:p-6 text-white shadow-xl mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <img 
                src={userData?.pfp || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anon'} 
                alt="Profile" 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-lg"
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">{userData?.name ?? '—'}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-blue-100 text-sm">{userData?.rank ?? ''}</span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <Users className="w-4 h-4" />
                  <span className="text-xs sm:text-sm text-blue-100">{userData?.communityRole ?? ''}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 bg-white bg-opacity-20 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-blue-100">Token Balance</p>
                <p className="text-2xl sm:text-3xl font-bold">{(userData?.tokenBalance ?? 0).toLocaleString()} HHD</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => router.push('/wallet/send')} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <Send size={16} />
                  <span>Send</span>
                </button>
                <button onClick={() => router.push('/wallet/receive')} className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-300">
                  <ArrowDownLeft size={16} />
                  <span>Receive</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="card">
            <div className="flex items-center space-x-2 text-green-400 mb-2">
              <TrendingUp size={20} />
              <span className="text-sm font-medium">Projects Started</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{userData?.stats?.projectsStarted ?? 0}</p>
          </div>
          <div className="card">
            <div className="flex items-center space-x-2 text-blue-400 mb-2">
              <CheckCircle size={20} />
              <span className="text-sm font-medium">Projects Helped</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{userData?.stats?.projectsHelped ?? 0}</p>
          </div>
          <div className="card">
            <div className="flex items-center space-x-2 text-purple-400 mb-2">
              <Users size={20} />
              <span className="text-sm font-medium">Members Added</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white">{userData?.stats?.membersAdded ?? 0}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button onClick={() => router.push('/rewards')} className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl p-4 sm:p-6 hover:shadow-2xl hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-orange-300">
            <Gift className="w-6 h-6 sm:w-8 sm:h-8 mb-2 mx-auto" />
            <p className="font-bold">Rewards Exchange</p>
            <p className="text-xs mt-1 opacity-90">Redeem tokens</p>
          </button>
          <button onClick={() => router.push('/projects')} className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-4 sm:p-6 hover:shadow-2xl hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-green-300">
            <Map className="w-6 h-6 sm:w-8 sm:h-8 mb-2 mx-auto" />
            <p className="font-bold">Explore Projects</p>
            <p className="text-xs mt-1 opacity-90">Map view</p>
          </button>
          <button onClick={() => router.push('/social/communities')} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-4 sm:p-6 hover:shadow-2xl hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-purple-300">
            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 mb-2 mx-auto" />
            <p className="font-bold">Global Community</p>
            <p className="text-xs mt-1 opacity-90">All projects feed</p>
          </button>
        </div>

        {/* NFT Collection Section */}
        <div className="card overflow-hidden mb-6">
          <button 
            onClick={() => setShowNFTCollection(!showNFTCollection)}
            className="w-full p-4 sm:p-6 text-left hover:bg-gray-750 transition-colors focus:outline-none focus:bg-gray-750"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Image className="text-purple-400" size={24} />
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">My NFT Collection</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {(userData?.nftCollection ?? []).length} projects • Click any NFT to explore project community and real-time data feed
                  </p>
                </div>
              </div>
              <div className={`transform transition-transform ${showNFTCollection ? 'rotate-180' : ''}`}>
                <ChevronRight className="text-gray-400" size={20} />
              </div>
            </div>
          </button>

          {showNFTCollection && (
            <div className="p-4 sm:p-6 pt-0 border-t border-gray-700">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {(userData?.nftCollection ?? []).map((nft) => (
                  <button
                    key={nft.id}
                    onClick={() => {
                      if (nft.projectId) router.push(`/projects/${nft.projectId}`);
                      else router.push('/projects');
                    }}
                    className="group relative bg-gray-900 border-2 border-gray-700 rounded-xl p-3 hover:border-blue-500 hover:shadow-2xl transition-all overflow-hidden focus:outline-none focus:border-blue-500"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-gradient-to-br from-gray-800 to-gray-900">
                      <img 
                        src={nft.image} 
                        alt={nft.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2">{nft.name}</h4>
                    <p className="text-xs text-gray-400 mb-2 line-clamp-1">{nft.community}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-400 font-medium">View Project</span>
                      <ChevronRight className="text-gray-600 group-hover:text-blue-400" size={16} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Zap className="text-blue-400" size={20} />
              <span className="text-gray-400 text-sm">HHDAO v1.0 - Built on Internet Computer</span>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 sm:gap-6 text-sm">
              <button className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:text-white">Privacy</button>
              <button className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:text-white">Terms</button>
              <button className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:text-white">Docs</button>
              <button className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:text-white">Support</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
