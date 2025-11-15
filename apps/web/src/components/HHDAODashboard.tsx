"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Gift, ShoppingBag, MapPin } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardHeader from './DashboardHeader';

type Stage = 'planning' | 'development' | 'testing' | 'deployment' | 'completed';

interface Opportunity { id: string; title: string; description: string; budget: number; status: 'Open' | 'Closed' }
interface Project { id: string; title: string; description: string; stage: Stage; opportunities: Opportunity[] }

const HHDAODashboard: React.FC = () => {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [filterStage, setFilterStage] = useState<Stage | 'all'>('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Load projects (mock data for now)
    setProjects([
      { id: 'p1', title: 'Baghpat Solar Grid', description: 'Village solar microgrid', stage: 'development', opportunities: [{ id: 'o1', title: 'Panel Supplier', description: 'Supply PV panels', budget: 50000, status: 'Open' }] },
      { id: 'p2', title: 'Mining Farm (pilot)', description: 'Renewable-powered mining pilot', stage: 'planning', opportunities: [] }
    ]);
  }, []);

  const filtered = useMemo(() => (filterStage === 'all' ? projects : projects.filter(p => p.stage === filterStage)), [projects, filterStage]);

  if (!user || !isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // Get user stats (mock for now, will connect to canister later)
  const userStats = {
    contributions: 42,
    rewards: 320,
    projectCount: projects.length
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="container mx-auto p-6">
        <DashboardHeader />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded shadow-sm bg-white dark:bg-gray-800">
            <div className="text-sm text-gray-500">Contributions</div>
            <div className="text-xl font-bold">{userStats.contributions}</div>
          </div>
          <div className="p-4 rounded shadow-sm bg-white dark:bg-gray-800">
            <div className="text-sm text-gray-500">Rewards</div>
            <div className="text-xl font-bold">{userStats.rewards} HHU</div>
          </div>
          <div className="p-4 rounded shadow-sm bg-white dark:bg-gray-800">
            <div className="text-sm text-gray-500">Projects</div>
            <div className="text-xl font-bold">{userStats.projectCount}</div>
          </div>
        </div>

        {/* Projects & Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="p-4 rounded bg-white dark:bg-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">Projects</h2>
                <div className="space-x-2">
                  <button onClick={() => setFilterStage('all')} className={`px-2 py-1 rounded text-sm ${filterStage === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>All</button>
                  <button onClick={() => setFilterStage('development')} className={`px-2 py-1 rounded text-sm ${filterStage === 'development' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>Development</button>
                  <button onClick={() => setFilterStage('planning')} className={`px-2 py-1 rounded text-sm ${filterStage === 'planning' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>Planning</button>
                </div>
              </div>

              <div className="space-y-3">
                {filtered.map(p => (
                  <div key={p.id} onClick={() => setSelectedProject(p)} className="p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{p.title}</div>
                        <div className="text-sm text-gray-500">{p.description}</div>
                      </div>
                      <MapPin className="text-blue-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="p-4 rounded bg-white dark:bg-gray-800">
              <h3 className="font-semibold mb-2">Quick Actions</h3>
              <button className="w-full mb-2 px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 flex items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition" onClick={() => router.push('/rewards')}><Gift className="mr-2" /> Rewards</button>
              <button className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 flex items-center hover:bg-gray-200 dark:hover:bg-gray-600 transition" onClick={() => router.push('/opportunities')}><ShoppingBag className="mr-2" /> Vendors</button>
            </div>
          </div>
        </div>

        {/* Selected Project Detail */}
        {selectedProject && (
          <div className="mt-6 p-4 rounded bg-white dark:bg-gray-800">
            <h3 className="font-semibold">{selectedProject.title}</h3>
            <p className="text-sm text-gray-500">{selectedProject.description}</p>
            <div className="mt-3">
              <h4 className="font-medium">Opportunities</h4>
              <div className="space-y-2 mt-2">
                {selectedProject.opportunities.length > 0 ? (
                  selectedProject.opportunities.map(o => (
                    <div key={o.id} className="p-2 border rounded">
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">{o.title}</div>
                          <div className="text-xs text-gray-500">{o.description}</div>
                        </div>
                        <div className="text-sm">${o.budget.toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No opportunities available yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HHDAODashboard;

