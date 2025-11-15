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
    // Ensure agent initialization only happens in the browser (client-side).
    // Avoid creating an agent during SSR — that can cause relative requests
    // to be routed to the Next.js server (resulting in 404s like
    // GET /api/v2/status). If server-side code needs canister data it
    // should use dedicated server-side adapters.
    if (typeof window === 'undefined') {
      return;
    }
    // Allow forcing all backend calls to use mocks during local dev. Set
    // NEXT_PUBLIC_FORCE_MOCK=true in `apps/web/.env.local` to enable this.
    if (process.env.NEXT_PUBLIC_FORCE_MOCK === 'true') {
      // eslint-disable-next-line no-console
      console.log('HHDAO: NEXT_PUBLIC_FORCE_MOCK=true - skipping agent initialization (using mocks)');
      return;
    }

    const configuredHost = process.env.NEXT_PUBLIC_IC_HOST || 'http://127.0.0.1:4943';

    // If the configured host is a local replica, probe it first from the
    // browser. If it's unreachable, avoid initializing the agent so we don't
    // trigger repeated connection-refused errors that can break client
    // hydration in dev. In that case, consumers will fall back to dev mocks.
    let replicaReachable = true;
    if (typeof window !== 'undefined' && /127\.0\.0\.1|localhost/.test(configuredHost)) {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 1000);
        await fetch(`${configuredHost}/api/v2/status`, { signal: controller.signal }).finally(() => clearTimeout(id));
      } catch {
        // local replica not reachable, skip agent initialization
        // eslint-disable-next-line no-console
        console.log('Local ICP replica unreachable at', configuredHost, '; using mock data.');
        replicaReachable = false;
      }
    }

    // If replica is not reachable, don't create the agent - consumers will use mocks
    if (!replicaReachable) {
      return;
    }

    const agent = new HttpAgent({
      host: configuredHost
    });

    // Only fetch root key in the browser (client-side) and in non-production
    // development. This prevents attempts to contact a local DFX replica
    // during server-side rendering which can produce unhandled rejections
    // when the IC endpoint is unavailable.
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      try {
        await agent.fetchRootKey();
      } catch (err) {
        // Non-fatal in dev; log and continue. This prevents Next.js from
        // crashing during SSR when a local replica is not running.
        // eslint-disable-next-line no-console
        console.warn('Warning: agent.fetchRootKey() failed (client-side):', err);
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
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
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
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  }

  async getProject(id: bigint): Promise<Project | null> {
    try {
      if (!this.actor) {
        await this.initializeActor();
      }
      const result = await this.actor!.getProject(id);
      return result;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
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
    } catch (error) {
      console.error('Error creating proposal:', error);
      throw error;
    }
  }

  async getCyclesBalance(): Promise<bigint> {
    try {
      if (!this.actor) {
        await this.initializeActor();
      }
  const result = await this.actor!.getCyclesBalance();
      return result;
    } catch (error) {
      console.error('Error fetching cycles balance:', error);
      throw error;
    }
  }
}

// Singleton instance
export const hhdaoService = new HHDAOService();