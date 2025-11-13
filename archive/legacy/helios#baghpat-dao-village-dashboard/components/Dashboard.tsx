
import React, { useState } from 'react';
import { ProjectNodeProps, LiveData, Tab } from '../types';
import ProjectNode from './ProjectNode';
import LiveDataView from './LiveDataView';
import CommunityHub from './CommunityHub';
import OpportunitiesBoard from './OpportunitiesBoard';
import { OwpLogo } from './IconComponents';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Overview);

  const projectData: ProjectNodeProps = {
    id: 'helios-baghpat',
    title: 'Helios#Baghpat',
    tagline: 'सूर्य से स्वावलंबन',
    icon: '☀️',
    status: 'live',
    energy: '847 kWh',
    members: '1,247',
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.LiveData:
        return <LiveDataView />;
      case Tab.Community:
        return <CommunityHub />;
      case Tab.Opportunities:
        return <OpportunitiesBoard />;
      case Tab.Overview:
      default:
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                    <ProjectNode {...projectData} />
                </div>
                <div className="lg:col-span-2">
                    <IntegrationDetails />
                </div>
                <div>
                    <AccessFlow />
                </div>
            </div>
        );
    }
  };

  const tabs = Object.values(Tab);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
            <OwpLogo className="h-10 w-10 text-cyan-400"/>
            <h1 className="text-2xl font-orbitron font-bold text-white">
                One World Project <span className="text-slate-400 font-normal">/</span> <span className="text-amber-400">Helios#Baghpat</span>
            </h1>
        </div>
        <button 
            onClick={onLogout}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 text-sm"
        >
            Disconnect
        </button>
      </header>

      <nav className="mb-6">
        <div className="border-b border-slate-700">
          <div className="flex space-x-4 sm:space-x-8 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-white hover:border-slate-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main>
        {renderContent()}
      </main>
        <footer className="text-center mt-12 text-slate-500 text-xs">
            Powered by ICP | Gated by OWP | Built for @nutraazz | 11 Nov 2025
        </footer>
    </div>
  );
};

const Card: React.FC<{title: string; children: React.ReactNode; className?: string}> = ({ title, children, className = '' }) => (
    <div className={`bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 shadow-lg ${className}`}>
        <div className="p-4 border-b border-slate-700">
            <h3 className="font-orbitron text-lg font-bold text-white">{title}</h3>
        </div>
        <div className="p-4">
            {children}
        </div>
    </div>
);


const IntegrationDetails: React.FC = () => (
    <Card title="Project Integration: Helios → OWP">
        <div className="space-y-3">
            {[
                { feature: 'NFT Access', impl: 'Only OWP NFT holders (OpenSea) can enter' },
                { feature: 'Cross-Chain Bridge', impl: 'OpenSea → ICP via ICRC-7 Adapter' },
                { feature: 'Live Project Node', impl: 'Interactive map at dapp.oneworldproject.io/map' },
                { feature: 'Real-Time IoT', impl: 'Solar output, temp, uptime via ICP Canister' },
                { feature: 'Governance', impl: 'HHDAO votes via ICRC-1 + ICRC-7 NFTs' },
            ].map(item => (
                <div key={item.feature} className="flex flex-col sm:flex-row justify-between p-3 bg-slate-900/50 rounded-lg">
                    <dt className="font-bold text-cyan-400">{item.feature}</dt>
                    <dd className="text-slate-300 text-left sm:text-right">{item.impl}</dd>
                </div>
            ))}
        </div>
    </Card>
);

const AccessFlow: React.FC = () => (
    <Card title="NFT-Gated Access Flow">
        <div className="space-y-2">
            <div className="p-2 text-center bg-slate-700 rounded-md">User Connects Wallet</div>
            <div className="text-center text-cyan-400">↓</div>
            <div className="p-2 text-center bg-slate-700 rounded-md">OWP NFT?</div>
            <div className="flex justify-around">
                <div className="text-center">
                    <span className="text-red-400">No ↘</span>
                    <div className="mt-1 p-2 bg-red-900/50 border border-red-700 text-red-300 rounded-md">Access Denied</div>
                </div>
                <div className="text-center">
                    <span className="text-green-400">↙ Yes</span>
                    <div className="mt-1 p-2 bg-slate-900/50 rounded-md">Bridge to ICP</div>
                    <div className="text-center text-cyan-400">↓</div>
                    <div className="mt-1 p-2 bg-slate-900/50 rounded-md">ICRC-7 NFT Minted</div>
                    <div className="text-center text-cyan-400">↓</div>
                    <div className="mt-1 p-2 bg-green-900/50 border border-green-700 text-green-300 rounded-md">Enter Helios Hub</div>
                </div>
            </div>
        </div>
    </Card>
);


export default Dashboard;
