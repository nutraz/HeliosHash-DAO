"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Gift, ShoppingBag, MapPin } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardHeader from './DashboardHeader';
import UserProfileCard from './dashboard/UserProfileCard';
import StatsCards from './dashboard/StatsCards';
import TokenTransfer from './dashboard/TokenTransfer';
import LoadingSpinner from './dashboard/LoadingSpinner';
import { ICPAuthService, ICPCanisterService } from '@/lib/services/icpService';
import { SecurityService } from '@/lib/services/securityService';
import { useDashboardStore } from '@/lib/stores/dashboardStore';

type Stage = string;

interface Opportunity { id: string; title: string; description?: string; budget: number; status: 'Open' | 'Closed' }
interface Project { id: number; name: string; title?: string; description?: string; stage: Stage; opportunities?: Opportunity[] }

const HHDAODashboard: React.FC = () => {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [filterStage, setFilterStage] = useState<Stage | 'all'>('all');
  // Use store for projects (single source of truth)
  const projects = useDashboardStore((s) => s.projects);
  const userStore = useDashboardStore((s) => s.user);
  const tokenBalance = useDashboardStore((s) => s.tokenBalance);
  const setUserStore = useDashboardStore((s) => s.setUser);
  const setTokenBalance = useDashboardStore((s) => s.setTokenBalance);
  const setProjects = useDashboardStore((s) => s.setProjects);
  const setAuthenticated = useDashboardStore((s) => s.setAuthenticated);
  const setLoadingStore = useDashboardStore((s) => s.setLoading);
  const setError = useDashboardStore((s) => s.setError);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    // Migrate old mocked project list into the store
    const mock = [
      { id: 1, name: 'Baghpat Solar Grid', stage: 'development', size: '5 MW', completion: 80, funding: '₹2.1 Cr' },
      { id: 2, name: 'Mining Farm (pilot)', stage: 'planning', size: '2 MW', completion: 25, funding: '₹50 L' }
    ];
    setProjects(mock as any);
  }, [setProjects]);

  const filtered = useMemo(() => (filterStage === 'all' ? projects : projects.filter((p: any) => p.stage === filterStage)), [projects, filterStage]);

  // Services must be created before any early returns so hooks order is stable
  const authService = useMemo(() => new ICPAuthService(), []);
  const canisterService = useMemo(() => new ICPCanisterService(), []);
  const securityService = useMemo(() => new SecurityService(), []);

  if (!user || !isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  // services
  

  // Get fresh user/project/token data when needed
  const refreshBalance = async () => {
    const principal = authService.getPrincipal();
    if (principal) {
      const balance = await canisterService.getTokenBalance(principal);
      setTokenBalance(balance);
    }
  };

  // Initialize via canister when user signs in
  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated) return;
      setLoadingStore(true);
      try {
        const principal = authService.getPrincipal();
        if (!principal) {
          setLoadingStore(false);
          return;
        }
        const [userData, balance, projectsData] = await Promise.all([
          canisterService.getUserData(principal),
          canisterService.getTokenBalance(principal),
          canisterService.getProjects(),
        ]);

        setUserStore(userData as any);
        setTokenBalance(balance);
  setProjects(projectsData as any);
        setAuthenticated(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoadingStore(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

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

        <div className="space-y-6">
          <UserProfileCard user={userStore || user} balance={tokenBalance} />
          <StatsCards stats={userStats} />
          <TokenTransfer canisterService={canisterService} securityService={securityService} onSuccess={refreshBalance} />
        </div>

        {/* Projects Section */}
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
                
                {filtered.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    aria-label={`Open project ${((p as any).title || p.name)}`}
                    className="w-full text-left p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                    type="button"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{(p as any).title || p.name}</div>
                        <div className="text-sm text-gray-500">{(p as any).description}</div>
                      </div>
                      <MapPin className="text-blue-500" />
                    </div>
                  </button>
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
              <h3 className="font-semibold">{selectedProject.title || selectedProject.name}</h3>
            <p className="text-sm text-gray-500">{selectedProject.description}</p>
            <div className="mt-3">
              <h4 className="font-medium">Opportunities</h4>
              <div className="space-y-2 mt-2">
                {selectedProject.opportunities && selectedProject.opportunities.length > 0 ? (
                  selectedProject.opportunities.map((o: Opportunity) => (
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

