'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface SolarProject {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'planned' | 'completed' | 'maintenance';
  capacity: number; // in MW
  currentGeneration: number; // in MW
  efficiency: number; // percentage
  investors: number;
  totalInvestment: number;
  roi: number; // percentage
  utilizationRate: number; // percentage
  startDate: Date;
  expectedCompletionDate?: Date;
}

interface ProjectsContextType {
  projects: SolarProject[];
  activeProjects: SolarProject[];
  getProjectById: (id: string) => SolarProject | undefined;
  investInProject: (projectId: string, amount: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<SolarProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }
      const data = await response.json();

      // Convert date strings to Date objects
      const formattedProjects: SolarProject[] = data.map((project: any) => ({
        ...project,
        startDate: new Date(project.startDate),
        expectedCompletionDate: project.expectedCompletionDate ? new Date(project.expectedCompletionDate) : undefined
      }));

      setProjects(formattedProjects);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError(err instanceof Error ? err.message : 'Failed to load projects');
      setProjects([]); // Clear projects on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const getProjectById = (id: string): SolarProject | undefined => {
    return projects.find(project => project.id === id);
  };

  const investInProject = async (projectId: string, amount: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, amount }),
      });

      if (!response.ok) {
        throw new Error(`Investment failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Update local state with the updated project data
      setProjects(prev => prev.map(project =>
        project.id === projectId ? result.project : project
      ));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Investment failed';
      setError(errorMessage);
      console.error('Investment failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const activeProjects = projects.filter(project => project.status === 'active');

  const value: ProjectsContextType = {
    projects,
    activeProjects,
    getProjectById,
    investInProject,
    isLoading,
    error,
  };

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
