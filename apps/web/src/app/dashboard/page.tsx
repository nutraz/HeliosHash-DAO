"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, Settings, User, Gem, Wallet, Trophy, Zap, 
  Compass, Users, Shield, Sun, Moon, Send, Vote, 
  Search, Gift, MessageCircle, BarChart3, ShieldCheck,
  Battery, Sun as SunIcon, Copy
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { icpService } from '@/services/icpService';
import { useAuth } from '@/contexts/AuthContext';

function DashboardContent() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState('profile');
  const [notifications] = useState(0);
  const [solarData, setSolarData] = useState({ energy: 0, panels: 0, location: '' });
  const [loading, setLoading] = useState(false);

  // Identity comes from the connected Internet Identity principal — no fake name.
  const { principal } = useAuth();
  const router = useRouter();

  // Demo honesty: actions not wired to a real canister flow surface an inline,
  // styled notice (never a browser alert/prompt) instead of fabricating success.
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  };
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);
  const comingSoon = () => showToast('Demo action — coming soon. This isn’t wired up in the demo yet.');

  // Initialize theme and load real data
  useEffect(() => {
    const savedTheme = localStorage.getItem('hhdao-theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load real solar data from ICP canister
    loadSolarData();
  }, []);

  const loadSolarData = async () => {
    try {
      setLoading(true);
      const [energy, panels, location] = await Promise.all([
        icpService.getSolarEnergy(),
        icpService.getPanelCount(),
        icpService.getLocation()
      ]);
      
      setSolarData({
        energy: Number(energy),
        panels: Number(panels),
        location: String(location)
      });
    } catch (error) {
      console.error('Failed to load solar data:', error);
      // Fallback to demo data (MWh/year, consistent with ~1,200 panels)
      setSolarData({
        energy: 720,
        panels: 1200,
        location: "Baghpat, Uttar Pradesh, India"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hhdao-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hhdao-theme', 'light');
    }
  };

  // Demo honesty: these actions aren't wired to a real canister flow, so they
  // surface one honest "coming soon" rather than fabricating success.
  const handleSendTokens = () => comingSoon();
  const handleViewNFTs = () => comingSoon();
  const handleJoinVote = () => comingSoon();
  const handleExplore = () => comingSoon();
  const handleCreateProject = () => comingSoon();

  const handleNavClick = (navItem: string) => {
    setActiveNav(navItem);
    // Only "Explore Projects" has a real destination today; route there.
    if (navItem === 'projects') {
      router.push('/projects/helios-baghpat');
      return;
    }
    comingSoon();
  };

  const handleNotificationClick = () => comingSoon();

  const handleSettingsClick = () => {
    showToast(`Settings (demo): ${darkMode ? 'Dark' : 'Light'} theme · ${process.env.NEXT_PUBLIC_IC_HOST || 'Local'} network · HHDAO v1.0`);
  };

  const navItems = [
    { icon: User, label: 'Profile', id: 'profile' },
    { icon: Gem, label: 'My NFTs', id: 'nfts' },
    { icon: Wallet, label: 'Wallet', id: 'wallet' },
    { icon: Trophy, label: 'Rewards Hub', id: 'rewards' },
    { icon: Zap, label: 'Opportunities', id: 'opportunities' },
    { icon: Compass, label: 'Explore Projects', id: 'projects' },
    { icon: Users, label: 'Social Hub', id: 'social' },
    { icon: Shield, label: 'DAO Governance', id: 'governance' },
  ];

  const quickActions = [
    { label: 'Send Tokens', color: 'bg-blue-500 hover:bg-blue-600', icon: Send, action: handleSendTokens },
    { label: 'View NFTs', color: 'bg-purple-500 hover:bg-purple-600', icon: Gem, action: handleViewNFTs },
    { label: 'Join Vote', color: 'bg-green-500 hover:bg-green-600', icon: Vote, action: handleJoinVote },
    { label: 'Explore', color: 'bg-amber-500 hover:bg-amber-600', icon: Search, action: handleExplore },
  ];

  const modules = [
    { 
      title: 'Governance Engine', 
      description: 'Vote on proposals and shape the DAO', 
      status: 'Coming soon', 
      icon: Shield,
      action: () => handleNavClick('governance')
    },
    { 
      title: 'Treasury Manager', 
      description: 'Track and manage community funds', 
      status: 'Coming soon', 
      icon: BarChart3,
      action: () => handleNavClick('wallet')
    },
    { 
      title: 'NFT Marketplace', 
      description: 'Trade and collect community NFTs', 
      status: 'Coming soon', 
      icon: Gem,
      action: () => handleNavClick('nfts')
    },
    { 
      title: 'Project Hub', 
      description: 'Discover and fund new initiatives', 
      status: 'Coming soon', 
      icon: Compass,
      action: () => handleNavClick('projects')
    },
    { 
      title: 'Rewards System', 
      description: 'Earn and claim your rewards', 
      status: 'Coming soon', 
      icon: Gift,
      action: () => handleNavClick('rewards')
    },
    { 
      title: 'Create Project', 
      description: 'Launch new community initiatives', 
      status: 'Coming soon',
      icon: Zap,
      action: handleCreateProject
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* App Bar */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">HeliosHash DAO</h1>
            </div>

            {/* Center: connected Internet Identity principal (no fabricated name/rank/level) */}
            <div className="flex items-center space-x-2">
              {principal ? (
                <>
                  <span className="text-sm font-mono text-slate-700 dark:text-slate-300" title={principal}>
                    {`${principal.slice(0, 5)}...${principal.slice(-3)}`}
                  </span>
                  <button
                    onClick={() => { void navigator.clipboard?.writeText(principal); }}
                    className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    title="Copy full principal"
                    aria-label="Copy full principal"
                  >
                    <Copy size={14} />
                  </button>
                </>
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-400">Connecting…</span>
              )}
            </div>

            {/* Right: Controls */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button 
                onClick={handleNotificationClick}
                className="relative p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-xs rounded-full flex items-center justify-center text-white">
                    {notifications}
                  </span>
                )}
              </button>
              
              <button 
                onClick={handleSettingsClick}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <Settings size={20} />
              </button>
              
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Side Navigation */}
          <div className="lg:col-span-1">
            <nav className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">Navigation</h3>
              
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        title={item.label}
                        aria-label={item.label}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                          activeNav === item.id 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm' 
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:translate-x-1'
                        }`}
                      >
                        <item.icon size={18} />
                        <span className="font-medium">{item.label}</span>
                      </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Main Dashboard Area */}
          <div className="lg:col-span-3 space-y-6">

            {/* Demo Polish (MVP2): the one clear next action — explore the
                flagship solar project. Links to the presentable project page. */}
            <Link
              href="/projects/helios-baghpat"
              className="block rounded-xl p-5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Explore the Baghpat solar project</h3>
                  <p className="text-sm text-cyan-50">See live solar yield, the community, and open opportunities →</p>
                </div>
                <Compass size={28} className="shrink-0" />
              </div>
            </Link>

            {/* Real Solar Data Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-md cursor-pointer"
                onClick={loadSolarData}
              >
                <div className="flex items-center justify-between">
                  <Battery className="text-green-500" size={20} />
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {loading ? '...' : solarData.energy}
                  </p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Solar Energy (MWh/year) (demo)</p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <SunIcon className="text-amber-500" size={20} />
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {loading ? '...' : solarData.panels}
                  </p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">Solar Panels</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`${action.color} text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2`}
                  >
                    <action.icon size={18} />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Real ICP Modules */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">DAO Modules</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((module, index) => (
                  <div 
                    key={index} 
                    onClick={module.action}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <module.icon size={20} className="text-blue-500 group-hover:text-blue-600 transition-colors" />
                      <h4 className="font-semibold text-slate-900 dark:text-white">{module.title}</h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{module.description}</p>
                    <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">
                      {module.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity with Real Data */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-white text-sm">Connected to HeliosHash DAO</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">Just now</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-white text-sm">
                      Solar Data: {loading ? 'Loading...' : `${solarData.energy} MWh/year (demo) from ${solarData.panels} panels`}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{solarData.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline demo notice — replaces browser alert/prompt for placeholder actions. */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex max-w-[90vw] items-center gap-3 rounded-lg bg-slate-900 dark:bg-slate-700 px-4 py-3 text-white shadow-lg"
        >
          <span className="text-sm">{toast}</span>
          <button onClick={() => setToast(null)} aria-label="Dismiss notice" className="text-slate-300 hover:text-white">✕</button>
        </div>
      )}
    </div>
  );
}

// H0c.2: gate the dashboard behind Internet Identity auth. Unauthenticated
// visitors can load the route but see only a connect gate; private dashboard
// content is never rendered (and its data-fetching hooks never mount) unless
// the session is authenticated.
export default function DashboardPage() {
  const { isAuthenticated, isLoading, login } = useAuth();

  // While auth state is resolving, render a neutral placeholder so private
  // dashboard content never flashes for an unauthenticated/unknown session.
  if (isLoading) {
    return (
      <div
        data-testid="dashboard-auth-loading"
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800"
      >
        <p className="text-slate-600 dark:text-slate-400">Checking sign-in status…</p>
      </div>
    );
  }

  // Unauthenticated visitors get the connect gate only — no dashboard content.
  if (!isAuthenticated) {
    return (
      <div
        data-testid="dashboard-auth-gate"
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6"
      >
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Connect Internet Identity to continue
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
            The HeliosHash DAO dashboard is available to authenticated members.
            Connect your Internet Identity to view it.
          </p>
          <button
            onClick={() => { void login('/dashboard'); }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Connect Internet Identity
          </button>
        </div>
      </div>
    );
  }

  // Authenticated: render the full dashboard.
  return <DashboardContent />;
}
