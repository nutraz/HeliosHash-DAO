import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
// NOTE: generated declarations may not exist in local dev until `dfx generate` / `dfx deploy` is run.
// Avoid importing them at module-top to keep type-check/build stable. Callers can pass idlFactories.

const IC_HOST = process.env.NEXT_PUBLIC_IC_HOST || 'https://ic0.app';
const II_CANISTER_ID = process.env.NEXT_PUBLIC_II_CANISTER_ID;
const PROJECT_HUB_ID = process.env.NEXT_PUBLIC_PROJECT_HUB_ID;

const CANISTER_IDS = {
  projectHub: PROJECT_HUB_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai',
  token: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
  governance: 'rrkah-fqaaa-aaaaa-aaaaq-cai'
} as const;

export class ICActorFactory {
  private static agent: any = null;
  private static authClient: AuthClient | null = null;

  static async initAuthClient(): Promise<AuthClient> {
    if (typeof window === 'undefined') {
      throw new Error('Auth client can only be initialized in browser');
    }

    if (!this.authClient) {
      this.authClient = await AuthClient.create({
        idleOptions: {
          disableIdle: true,
          disableDefaultIdleCallback: true,
        }
      });
    }
    return this.authClient;
  }

  static async getAgent(): Promise<any> {
    if (!this.agent) {
      this.agent = new HttpAgent({ 
        host: IC_HOST,
        verifyQuerySignatures: false
      });

      if (IC_HOST.includes('localhost') || IC_HOST.includes('127.0.0.1')) {
        try {
          await this.agent.fetchRootKey();
        } catch (error) {
          console.warn('Could not fetch root key:', error);
        }
      }
    }

    if (this.authClient) {
      const identity = this.authClient.getIdentity();
      this.agent.replaceIdentity(identity as any);
    }

    return this.agent;
  }

  static async createActor(
    canisterId: string,
    idlFactory: any = {}
  ): Promise<any> {
    const agent = await this.getAgent();
    return Actor.createActor(idlFactory as any, {
      agent,
      canisterId,
    });
  }

  // Convenience actor getters. If you have generated idlFactories under `src/declarations`,
  // update these to import and pass them instead of the empty fallback.
  static async getProjectHubActor(): Promise<any> {
    return this.createActor(CANISTER_IDS.projectHub, {});
  }

  static async getTokenActor(): Promise<any> {
    return this.createActor(CANISTER_IDS.token, {});
  }

  static async getGovernanceActor(): Promise<any> {
    return this.createActor(CANISTER_IDS.governance, {});
  }

  static async login(): Promise<void> {
    const authClient = await this.initAuthClient();
    return new Promise((resolve, reject) => {
      authClient.login({
        identityProvider: II_CANISTER_ID ? `http://${II_CANISTER_ID}.localhost:4943` : 'https://identity.ic0.app',
        onSuccess: () => resolve(),
        onError: (err) => reject(err),
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      });
    });
  }

  static async logout(): Promise<void> {
    const authClient = await this.initAuthClient();
    await authClient.logout();
    this.agent = null;
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const authClient = await this.initAuthClient();
      return await authClient.isAuthenticated();
    } catch {
      return false;
    }
  }

  static async getPrincipal(): Promise<string | null> {
    try {
      const authClient = await this.initAuthClient();
      const identity = authClient.getIdentity();
      return identity.getPrincipal().toString();
    } catch {
      return null;
    }
  }
}
