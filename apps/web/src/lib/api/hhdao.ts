import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from '../../../src/declarations/hhdao/hhdao.did.js';

// Minimal domain types used by the web client. Keep these small and extend
// them later if more fields are required.
export interface UserProfile {
  principal: string;
  username?: string;
  displayName?: string;
  tier?: number;
}

export interface Document {
  id: string;
  documentType?: string;
}

export interface Project {
  id: bigint;
  title?: string;
  description?: string;
}

export interface DashboardData {
  projects: Project[];
  documents: Document[];
  userProfile?: UserProfile[];
  devices?: unknown[];
}

export interface HHDAOActor {
  getDashboardData: () => Promise<DashboardData>;
  getProjects: () => Promise<Project[]>;
  getProject: (id: bigint) => Promise<Project | null>;
  createProposal: (p: {
    title: string;
    description: string;
    category: { Governance: null } | { Project: null } | { Treasury: null };
    votesRequired: bigint;
  }) => Promise<boolean>;
  getCyclesBalance: () => Promise<bigint>;
}

export class HHDAOService {
  private actor?: HHDAOActor;

  // Do not initialize actor during module import / server-side render.
  // Initialization is performed lazily inside each method when needed.

  private async initializeActor() {
    const agent = new HttpAgent({
      host: process.env.NEXT_PUBLIC_IC_HOST || 'http://127.0.0.1:4943'
    });

    // Only fetch root key in the browser (client-side) and in non-production
    // development. This prevents attempts to contact a local DFX replica
    // during server-side rendering which can produce unhandled rejections
    // when the IC endpoint is unavailable.
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      try {
        await agent.fetchRootKey();
      } catch (_e) {
        // Non-fatal in dev; log and continue. This prevents Next.js from
        // crashing during SSR when a local replica is not running.
        // eslint-disable-next-line no-console
        console.warn('Warning: agent.fetchRootKey() failed (client-side):', _e);
      }
    }

    const canisterId = process.env.NEXT_PUBLIC_HHDAO_CANISTER_ID;
    if (!canisterId) {
      throw new Error('HHDAO canister ID not found in environment variables');
    }

    this.actor = Actor.createActor(idlFactory, {
      agent,
      canisterId
    }) as unknown as HHDAOActor;
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      // DEV fallback: if running in the browser and the dev mock flag is set,
      // return mock data instead of contacting a canister. This helps local
      // dev/debugging when a DFX replica or canister IDs are not available.
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
        try {
          const devFlag = window.localStorage.getItem('hhdao-dev-mock');
          if (devFlag) {
            return {
              projects: [
                { id: BigInt(1), title: 'Mock Project A', description: 'Dev mock project' }
              ],
              documents: [],
              userProfile: [{ principal: 'dev', username: 'dev', displayName: 'Dev User' }],
              devices: []
            } as DashboardData;
          }
        } catch {
          // ignore localStorage errors
        }
      }

      if (!this.actor) {
        await this.initializeActor();
      }

      const result = await this.actor!.getDashboardData();
      return result;
    } catch (_error) {
      console.error('Error fetching dashboard data:', _error);
      throw _error;
    }
  }

  async getProjects(): Promise<Project[]> {
    try {
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
        try {
          const devFlag = window.localStorage.getItem('hhdao-dev-mock');
          if (devFlag) {
            return [
              { id: BigInt(1), title: 'Mock Project A', description: 'Dev mock project' }
            ];
          }
        } catch {
          // ignore
        }
      }

      if (!this.actor) {
        await this.initializeActor();
      }
      const result = await this.actor!.getProjects();
      return result;
    } catch (_error) {
      console.error('Error fetching projects:', _error);
      throw _error;
    }
  }

  async getProject(id: bigint): Promise<Project | null> {
    try {
      if (!this.actor) {
        await this.initializeActor();
      }
      const result = await this.actor!.getProject(id);
      return result;
    } catch (_error) {
      console.error('Error fetching project:', _error);
      throw _error;
    }
  }

  async createProposal(proposalData: {
    title: string;
    description: string;
    category: { Governance: null } | { Project: null } | { Treasury: null };
    votesRequired: bigint;
  }): Promise<boolean> {
    try {
      if (!this.actor) {
        await this.initializeActor();
      }
      const result = await this.actor!.createProposal(proposalData);
      return result;
    } catch (_error) {
      console.error('Error creating proposal:', _error);
      throw _error;
    }
  }

  async getCyclesBalance(): Promise<bigint> {
    try {
      if (!this.actor) {
        await this.initializeActor();
      }
      const result = await this.actor!.getCyclesBalance();
      return result;
    } catch (_error) {
      console.error('Error fetching cycles balance:', _error);
      throw _error;
    }
  }
}

// Singleton instance
export const hhdaoService = new HHDAOService();