"use client";

import { useState } from 'react';
import type { Project, NFT, Post } from '@/lib/types';
import { projects as mockProjects, nfts as mockNFTs, posts as mockPosts } from '@/lib/data';

export function useDashboard() {
  const [projects] = useState<Project[]>(mockProjects);
  const [nfts] = useState<NFT[]>(mockNFTs);
  const [posts] = useState<Post[]>(mockPosts);
  const [selected, setSelected] = useState<Project | null>(projects[0] || null);

  const [currentView, setCurrentView] = useState<'dashboard' | 'rewards' | 'map' | 'community' | 'create-project' | 'project-detail'>('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState<string | null>(null);

  function selectProject(p: Project | null) {
    setSelected(p);
  }

  return {
    projects,
    nfts,
    posts,
    selectedProject: selected,
    selectProject,
    currentView,
    setCurrentView,
    showSettings,
    setShowSettings,
    activeSetting,
    setActiveSetting,
  } as const;
}

export default useDashboard;
