"use client";

import React from 'react';
import Navigation from '@/components/layout/Navigation';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import Footer from '@/components/layout/Footer';
import ProjectMap from './ProjectMap';
import NFTCollection from '@/components/shared/NFTCollection';
import ProjectDetail from './ProjectDetail';
import CommunityHub from './CommunityHub';
import RewardsMarketplace from './RewardsMarketplace';
import ProjectCreation from './ProjectCreation';
import SettingsMenu from './SettingsMenu';
import useDashboard from '@/hooks/useDashboard';
import { userData as mockUserData } from '@/lib/data';

type Props = {
  dashboard?: any;
  userData?: any;
  projects?: any;
};

const DashboardView: React.FC<Props> = (_props) => {
  const dashboard = useDashboard();
  const { projects, nfts, selectedProject, selectProject, posts } = dashboard;

  return (
    <div className="space-y-6">
      <Navigation dashboard={dashboard} userData={mockUserData as any} />
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-gray-800/40 rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-2">Project Map</h2>
            <ProjectMap projects={projects || []} onSelect={selectProject} />
          </section>

          <section className="bg-gray-800/40 rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-2">Project Detail</h2>
            {selectedProject ? (
              <ProjectDetail project={selectedProject} onBack={() => {}} onCommunityClick={() => {}} />
            ) : (
              <p className="text-gray-400">Select a project to see details.</p>
            )}
          </section>

          <section className="bg-gray-800/40 rounded-2xl p-4">
            <h2 className="text-xl font-semibold mb-2">Community Hub</h2>
            <CommunityHub posts={posts || []} selectedProject={selectedProject} />
          </section>
        </div>

        <aside className="space-y-6">
          <section className="bg-gray-800/40 rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-2">NFT Collection</h3>
            <NFTCollection userData={{ nftCollection: nfts || [] } as any} projects={projects || []} showNFTCollection={true} setShowNFTCollection={() => {}} setSelectedProject={() => {}} setCurrentView={() => {}} />
          </section>

          <section className="bg-gray-800/40 rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-2">Rewards Marketplace</h3>
            <RewardsMarketplace />
          </section>

          <section className="bg-gray-800/40 rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-2">Create Project</h3>
            <ProjectCreation />
          </section>

          <section className="bg-gray-800/40 rounded-2xl p-4">
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <SettingsMenu />
          </section>
        </aside>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardView;
