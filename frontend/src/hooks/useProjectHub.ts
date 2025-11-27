import { useCallback, useEffect, useState } from 'react';
import { icClient } from '@/lib/icClient';

export function useProjectHub(projectId?: string) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const actor = await icClient.projectHub();
      if (!actor) {
        setProjects([]);
        return [];
      }
      // try common method names
      if (typeof actor.list_projects === 'function') {
        const res = await actor.list_projects();
        setProjects(res || []);
        return res;
      }
      if (typeof actor.get_all_projects === 'function') {
        const res = await actor.get_all_projects();
        setProjects(res || []);
        return res;
      }
      setProjects([]);
      return [];
    } catch (e: any) {
      setError(String(e));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProjectStats = useCallback(async (id?: string) => {
    setLoading(true);
    setError(null);
    try {
      const actor = await icClient.projectHub();
      if (!actor) return null;
      if (typeof actor.get_project_stats === 'function') {
        const res = await actor.get_project_stats(id || projectId || '');
        setStats(res);
        return res;
      }
      return null;
    } catch (e: any) {
      setError(String(e));
      return null;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const createProject = useCallback(async (name: string, location: string, capacity: number, metadata: string) => {
    setLoading(true);
    setError(null);
    try {
      const actor = await icClient.projectHub();
      if (!actor) throw new Error('project hub actor unavailable');
      if (typeof actor.create_project === 'function') {
        return await actor.create_project(name, location, capacity, metadata);
      }
      throw new Error('create_project not available on actor');
    } catch (e: any) {
      setError(String(e));
      return { ok: false, error: String(e) };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    if (projectId) fetchProjectStats(projectId);
  }, [fetchProjects, fetchProjectStats, projectId]);

  return { projects, stats, loading, error, fetchProjects, fetchProjectStats, createProject } as const;
}

export default useProjectHub;
