import { useWallet } from '@/hooks/useWallet';
import { initializeMockData, useAppStore } from '@/lib/store';
import { Bell, LogOut, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import GovernanceDashboard from './GovernanceDashboard';
import SecuritySettings from './SecuritySettings';
import StakingInterface from './StakingInterface';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, wallet, portfolioValue, stakingRewards, transactions } = useAppStore();
  const { disconnectWallet: walletDisconnect } = useWallet();

  useEffect(() => {
    // Initialize mock data for development
    initializeMockData();
  }, []);

  const handleDisconnect = async () => {
    await walletDisconnect();
  };

  const Logo = ({ small = false }) => (
    <div className={`${small ? 'w-8 h-8' : 'w-32 h-32'} flex items-center justify-center`}>
      <img
        src="https://i.postimg.cc/1XxQvGCg/image.png"
        alt="HeliosHash Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );

  const WalletInfo = () => (
    <div className="flex items-center space-x-2 bg-slate-700/50 rounded-lg px-3 py-2">
      <Wallet className="w-4 h-4 text-blue-400" />
      <span className="text-sm text-white font-mono">
        {wallet?.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : 'Not connected'}
      </span>
    </div>
  );

  const Navigation = () => (
    <nav className="bg-slate-800/50 backdrop-blur-lg border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Logo small={true} />
            <span className="ml-3 text-white font-semibold">HeliosHash</span>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'overview' ? 'text-blue-400' : 'text-blue-300 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('staking')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'staking' ? 'text-blue-400' : 'text-blue-300 hover:text-white'
              }`}
            >
              Staking
            </button>
            <button
              onClick={() => setActiveTab('governance')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'governance' ? 'text-blue-400' : 'text-blue-300 hover:text-white'
              }`}
            >
              Governance
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'settings' ? 'text-blue-400' : 'text-blue-300 hover:text-white'
              }`}
            >
              Settings
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <WalletInfo />
            <button className="text-blue-300 hover:text-white" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </button>
            <button
              onClick={handleDisconnect}
              className="text-red-400 hover:text-red-300 flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Disconnect</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );

  const PortfolioOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
        <h3 className="text-blue-300 text-sm mb-2">Total Balance</h3>
        <p className="text-3xl font-bold text-white">{wallet?.balance || '0'} ETH</p>
        <p className="text-green-400 text-sm mt-2">+12.5% (24h)</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
        <h3 className="text-blue-300 text-sm mb-2">Portfolio Value</h3>
        <p className="text-3xl font-bold text-white">${portfolioValue}</p>
        <p className="text-green-400 text-sm mt-2">+8.3% (24h)</p>
      </div>
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
        <h3 className="text-blue-300 text-sm mb-2">Staking Rewards</h3>
        <p className="text-3xl font-bold text-white">{stakingRewards} HH</p>
        <p className="text-blue-400 text-sm mt-2">Claim available</p>
      </div>
    </div>
  );

  const TransactionList = () => (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
      <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
      <div className="space-y-3">
        {transactions.slice(0, 5).map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.type === 'send' ? 'bg-red-500/20' : 'bg-green-500/20'
              }`}>
                {tx.type === 'send' ? '↑' : '↓'}
              </div>
              <div>
                <p className="text-white font-medium">{tx.description}</p>
                <p className="text-blue-300 text-sm">{new Date(tx.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${tx.type === 'send' ? 'text-red-400' : 'text-green-400'}`}>
                {tx.type === 'send' ? '-' : '+'}{tx.amount} HH
              </p>
              <p className="text-blue-300 text-sm">${tx.valueUSD}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const OverviewTab = () => (
    <div className="space-y-8">
      <PortfolioOverview />
      <TransactionList />
    </div>
  );

  const StakingTab = () => (
    <StakingInterface />
  );

  const GovernanceTab = () => (
    <GovernanceDashboard />
  );

  const SettingsTab = () => (
    <SecuritySettings />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'staking' && <StakingTab />}
        {activeTab === 'governance' && <GovernanceTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};

export default Dashboard;