<<<<<<< HEAD
"use client"

import { useAuth } from '@/contexts/AuthContext'

export function Navigation() {
  const { isConnected, walletType, principal } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-900">HeliosHash DAO</h1>
            
            {isConnected && (
              <div className="flex gap-6 text-sm">
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                <a href="/proposals" className="text-gray-600 hover:text-gray-900">Proposals</a>
                <a href="/treasury" className="text-gray-600 hover:text-gray-900">Treasury</a>
                <a href="/members" className="text-gray-600 hover:text-gray-900">Members</a>
              </div>
            )}
          </div>

          {isConnected && (
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                {walletType}
              </span>
              <span className="text-gray-600 font-mono">
                {principal?.slice(0, 8)}...
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
=======
"use client";

import { ArrowLeft, Zap, Bell, Settings, Menu, X } from 'lucide-react';
import { UserData } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface NavigationProps {
  dashboard: any;
  userData: UserData;
}

export default function Navigation({ dashboard, userData }: NavigationProps) {
  const router = useRouter();
  return (
    <nav className="bg-gray-800 bg-opacity-50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Back Button */}
          <div className="flex items-center space-x-4">
            {(dashboard.currentView !== 'dashboard' || dashboard.selectedProject) && (
              <button 
                onClick={() => {
                  if (dashboard.selectedProject) {
                    dashboard.setSelectedProject(null);
                  } else {
                    dashboard.setCurrentView('dashboard');
                    dashboard.setShowSettings(false);
                  }
                }}
                className="text-blue-400 hover:text-blue-300 flex items-center space-x-2"
              >
                <ArrowLeft size={20} />
                <span className="hidden md:inline">Back</span>
              </button>
            )}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                <Zap className="text-white" size={20} />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white">HHDAO</h1>
            </div>
          </div>

          {/* Center: Main Navigation (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => { 
                router.push('/dashboard');
                if (dashboard) { dashboard.setCurrentView('dashboard'); dashboard.setShowSettings(false); dashboard.setSelectedProject(null); }
              }}
              className={`px-3 py-2 rounded-lg transition-colors ${dashboard.currentView === 'dashboard' && !dashboard.showSettings ? 'text-blue-400 bg-blue-900 bg-opacity-30' : 'text-gray-300 hover:text-white'}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => { 
                router.push('/projects'); 
                if (dashboard) { 
                  dashboard.setCurrentView('map'); 
                  dashboard.setShowSettings(false); 
                  dashboard.setSelectedProject(null); 
                } 
              }}
              className={`px-3 py-2 rounded-lg transition-colors ${dashboard.currentView === 'map' ? 'text-blue-400 bg-blue-900 bg-opacity-30' : 'text-gray-300 hover:text-white'}`}
            >
              Projects
            </button>
            <button 
              onClick={() => { router.push('/dashboard'); if (dashboard) { dashboard.setShowNFTCollection(!dashboard.showNFTCollection); dashboard.setCurrentView('dashboard'); dashboard.setShowSettings(false); } }}
              className={`px-3 py-2 rounded-lg transition-colors ${dashboard.showNFTCollection ? 'text-blue-400 bg-blue-900 bg-opacity-30' : 'text-gray-300 hover:text-white'}`}
            >
              NFTs
            </button>
            <button 
              onClick={() => { router.push('/social/communities'); if (dashboard) { dashboard.setCurrentView('community'); dashboard.setShowSettings(false); dashboard.setSelectedProject(null); } }}
              className={`px-3 py-2 rounded-lg transition-colors ${dashboard.currentView === 'community' ? 'text-blue-400 bg-blue-900 bg-opacity-30' : 'text-gray-300 hover:text-white'}`}
            >
              DAO
            </button>
          </div>

          {/* Right: Notifications and Settings */}
          <div className="flex items-center space-x-4">
            <button aria-label="Notifications" title="Notifications" className="text-gray-300 hover:text-white relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button 
              aria-label="Open settings"
              title="Settings"
              onClick={() => dashboard.setShowSettings(!dashboard.showSettings)}
              className="text-gray-300 hover:text-white"
            >
              <Settings size={20} />
            </button>
            <button 
              aria-label={dashboard.showMobileMenu ? 'Close menu' : 'Open menu'}
              title={dashboard.showMobileMenu ? 'Close menu' : 'Open menu'}
              onClick={() => dashboard.setShowMobileMenu(!dashboard.showMobileMenu)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              {dashboard.showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {dashboard.showMobileMenu && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => { dashboard.setCurrentView('dashboard'); dashboard.setShowMobileMenu(false); }}
                className="text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Dashboard
              </button>
              <button 
                onClick={() => { router.push('/projects'); if (dashboard) { dashboard.setCurrentView('map'); dashboard.setShowMobileMenu(false); } }}
                className="text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                Projects
              </button>
              <button 
                onClick={() => { dashboard.setShowNFTCollection(!dashboard.showNFTCollection); dashboard.setShowMobileMenu(false); }}
                className="text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                NFTs
              </button>
              <button 
                onClick={() => { router.push('/social/communities'); if (dashboard) { dashboard.setCurrentView('community'); dashboard.setShowMobileMenu(false); } }}
                className="text-left px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg"
              >
                DAO
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

>>>>>>> 954253d5 (docs: refresh and clean up all documentation (README, repo summary, critical fixes, copilot context))
