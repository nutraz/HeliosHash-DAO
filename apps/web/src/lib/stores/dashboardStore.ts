import { create } from 'zustand';

export type Project = { id: number; name: string; stage: string; size?: string; completion?: number; funding?: string };
export type UserType = { name: string; rank?: string; communityRole?: string; stats?: any } | null;

type DashboardState = {
  authenticated: boolean;
  loading: boolean;
  user: UserType;
  tokenBalance: number;
  projects: Project[];
  error: string | null;
  setAuthenticated: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  setUser: (u: UserType) => void;
  setTokenBalance: (n: number) => void;
  setProjects: (p: Project[]) => void;
  setError: (e: string | null) => void;
  reset: () => void;
};

export const useDashboardStore = create<DashboardState>((set: any) => ({
  authenticated: false,
  loading: false,
  user: null,
  tokenBalance: 0,
  projects: [],
  error: null,
  setAuthenticated: (v: boolean) => set({ authenticated: v }),
  setLoading: (v: boolean) => set({ loading: v }),
  setUser: (u: UserType) => set({ user: u }),
  setTokenBalance: (n: number) => set({ tokenBalance: n }),
  setProjects: (p: Project[]) => set({ projects: p }),
  setError: (e: string | null) => set({ error: e }),
  reset: () => set({ authenticated: false, loading: false, user: null, tokenBalance: 0, projects: [], error: null }),
}));
