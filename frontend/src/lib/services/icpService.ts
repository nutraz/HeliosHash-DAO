export class ICPAuthService {
  private authenticated = false;
  private principal: string | null = null;

  async login(): Promise<boolean> {
    // TODO: integrate Internet Identity
    await new Promise((r) => setTimeout(r, 500));
    this.authenticated = true;
    this.principal = 'aaaaa-bbbbb-ccccc-xxxxx-cai';
    return true;
  }

  async logout(): Promise<void> {
    this.authenticated = false;
    this.principal = null;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getPrincipal(): string | null {
    return this.principal;
  }
}

export class ICPCanisterService {
  async getUserData(principal: string) {
    await new Promise((r) => setTimeout(r, 350));
    return {
      name: 'Rahul Kumar',
      rank: 'Investor & Collaborator',
      communityRole: 'Community Manager',
      stats: {
        projectsStarted: 3,
        projectsHelped: 12,
        membersAdded: 45,
      },
    };
  }

  async getTokenBalance(principal: string): Promise<number> {
    await new Promise((r) => setTimeout(r, 200));
    return 15000;
  }

  async transferTokens(to: string, amount: number): Promise<boolean> {
    if (amount <= 0) throw new Error('Invalid amount');
    await new Promise((r) => setTimeout(r, 500));
    return true;
  }

  async getProjects() {
    await new Promise((r) => setTimeout(r, 300));
    return [
      { id: 1, name: 'Solar Bitcoin Mining Hub', stage: 'functioning', size: '5 MW', completion: 100, funding: '₹2.5 Cr' },
      { id: 2, name: 'EV Charging Network', stage: 'tech-setup', size: '2 MW', completion: 65, funding: '₹1.2 Cr' },
    ];
  }
}

import { Actor, HttpAgent } from "@dfinity/agent";

// Lightweight real canister wrapper. Uses dynamic imports for IDLs so the file
// doesn't fail TypeScript build if generated declarations are not present.
class ICPService {
  // Use a loose any type here to avoid TypeScript errors when the
  // `@dfinity/agent` typings aren't aligned in different environments.
  // The code still guards runtime use via null checks and try/catch.
  private agent: any = null;
  
  async initialize() {
    if (this.agent) return;
    const host = process.env.NODE_ENV === 'production' ? 'https://ic0.app' : 'http://localhost:4943';
    this.agent = new HttpAgent({ host });
    if (process.env.NODE_ENV !== 'production') {
      try { await this.agent.fetchRootKey(); } catch (e) { /* ignore in some envs */ }
    }
  }

  async getSolarEnergy(): Promise<number> {
    await this.initialize();
    try {
      const mod = await import('../../declarations/' + 'baghpat_energy');
      const baghpatEnergyIdl = (mod as any).idlFactory;
      const canisterId = process.env.NEXT_PUBLIC_BAGHPAT_ENERGY_CANISTER_ID as string | undefined;
      if (!canisterId) throw new Error('Baghpat energy canister id not configured');
      const actor = Actor.createActor(baghpatEnergyIdl as any, { agent: this.agent!, canisterId });
      const res = await (actor as any).getSolarEnergy();
      return Number(res);
    } catch (err) {
      console.warn('getSolarEnergy failed, returning mock value', err);
      return Math.floor(Math.random() * 500) + 100;
    }
  }

  async createProject(name: string, location: string, capacity: number, metadata: string) {
    await this.initialize();
    try {
      const mod = await import('../../declarations/' + 'project_hub');
      const projectHubIdl = (mod as any).idlFactory;
      const canisterId = process.env.NEXT_PUBLIC_PROJECT_HUB_CANISTER_ID as string | undefined;
      if (!canisterId) throw new Error('Project hub canister id not configured');
      const actor = Actor.createActor(projectHubIdl as any, { agent: this.agent!, canisterId });
      return await (actor as any).create_project(name, location, capacity, metadata);
    } catch (err) {
      console.warn('createProject failed, returning mock', err);
      return { ok: false, message: 'mock create' };
    }
  }

  async transferTokens(to: string, amount: number) {
    await this.initialize();
    // Try treasury canister first (common pattern). Fallback to mock behavior.
    try {
      const treasuryMod = await import('../../declarations/' + 'treasury');
      const treasuryIdl = (treasuryMod as any).idlFactory;
      const canisterId = process.env.NEXT_PUBLIC_TREASURY_CANISTER_ID as string | undefined;
      if (!canisterId) throw new Error('Treasury canister id not configured');
      const actor = Actor.createActor(treasuryIdl as any, { agent: this.agent!, canisterId });
      // Try common method names used in candid bindings
      if ((actor as any).transfer_tokens) {
        return await (actor as any).transfer_tokens(to, BigInt(Math.floor(amount)));
      }
      if ((actor as any).transfer) {
        return await (actor as any).transfer(to, BigInt(Math.floor(amount)));
      }
      throw new Error('No transfer method found on treasury actor');
    } catch (err) {
      console.warn('transferTokens failed, falling back to demo mock', err);
      // DEMO: simulate a detailed tx response
      await new Promise((r) => setTimeout(r, 2000));
      return {
        ok: `demo_tx_${Date.now()}`,
        status: 'completed',
        block: Math.floor(Math.random() * 1000000),
      };
    }
  }

  async getActiveProposals() {
    await this.initialize();
    try {
      const mod = await import('../../declarations/' + 'project_hub');
      const projectHubIdl = (mod as any).idlFactory;
      const canisterId = process.env.NEXT_PUBLIC_PROJECT_HUB_CANISTER_ID as string | undefined;
      if (!canisterId) throw new Error('Project hub canister id not configured');
      const actor = Actor.createActor(projectHubIdl as any, { agent: this.agent!, canisterId });
      // Try a couple of common method names
      if ((actor as any).get_active_proposals) {
        return await (actor as any).get_active_proposals();
      }
      if ((actor as any).list_proposals) {
        return await (actor as any).list_proposals({ status: 'active' });
      }
      throw new Error('No proposals method found on project hub actor');
    } catch (err) {
      console.warn('getActiveProposals failed, returning demo list', err);
      return { ok: [
        {
          id: 'prop_45',
          title: 'Treasury Allocation for Solar Expansion',
          description: 'Allocate 50,000 HHD for Baghpat solar farm expansion',
          votesFor: 1250,
          votesAgainst: 320,
          status: 'active',
          deadline: Date.now() + 86400000,
        },
        {
          id: 'prop_46',
          title: 'Community Grant Program',
          description: 'Establish 100,000 HHD community grant fund',
          votesFor: 890,
          votesAgainst: 210,
          status: 'active',
          deadline: Date.now() + 172800000,
        }
      ] };
    }
  }

  // Social hub demo methods
  async createSocialPost(content: string) {
    await this.initialize();
    try {
      // best-effort: if a social canister exists, call it; otherwise return demo id
      const socialMod = await import('../../declarations/' + 'social_hub').catch(() => null);
      if (socialMod) {
        const socialIdl = (socialMod as any).idlFactory;
        const canisterId = process.env.NEXT_PUBLIC_SOCIAL_HUB_CANISTER_ID as string | undefined;
        if (canisterId) {
          const actor = Actor.createActor(socialIdl as any, { agent: this.agent!, canisterId });
          if ((actor as any).create_post) {
            return await (actor as any).create_post(content);
          }
        }
      }
    } catch (e) {
      console.warn('createSocialPost remote failed, using demo fallback', e);
    }
    await new Promise((r) => setTimeout(r, 1000));
    return { ok: `post_${Date.now()}` };
  }

  async getSocialFeed() {
    await this.initialize();
    try {
      const socialMod = await import('../../declarations/' + 'social_hub').catch(() => null);
      if (socialMod) {
        const socialIdl = (socialMod as any).idlFactory;
        const canisterId = process.env.NEXT_PUBLIC_SOCIAL_HUB_CANISTER_ID as string | undefined;
        if (canisterId) {
          const actor = Actor.createActor(socialIdl as any, { agent: this.agent!, canisterId });
          if ((actor as any).list_posts) {
            return await (actor as any).list_posts();
          }
        }
      }
    } catch (e) {
      console.warn('getSocialFeed remote failed, using demo fallback', e);
    }
    return { ok: [
      {
        id: 'post_1',
        author: 'Solar Pioneer',
        content: 'Just connected my solar panels to HHDAO! Generating 5.2 kWh today.',
        timestamp: Date.now() - 3600000,
        likes: 23,
      },
      {
        id: 'post_2',
        author: 'Community Manager',
        content: 'New governance proposal #45 is live! Vote now on treasury allocation.',
        timestamp: Date.now() - 7200000,
        likes: 45,
      }
    ] };
  }
}

export const icpService = new ICPService();
