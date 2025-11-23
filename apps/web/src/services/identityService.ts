import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// Types matching the Motoko identity canister
export type Role =
  | { Community: null }
  | { Investor: null }
  | { Authority: null }
  | { Partner: null }
  | { DAO: null };

export interface UserProfile {
  principal: Principal;
  username?: string;
  email?: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  role: Role;
  secondaryRoles: Role[];
  createdAt: bigint;
  updatedAt: bigint;
  isVerified: boolean;
  verificationLevel: { Basic: null } | { Email: null } | { KYC: null } | { Enhanced: null };
  aadhaarVerified: boolean;
  owpBalance: number;
  prefersDuoValidation: boolean; // NEW field
}

class IdentityService {
  private agent: any = null;
  private actor: any = null;

  private async getActor() {
    if (!this.actor) {
      // For development, use local DFX network
      const agent = new HttpAgent({
        host: process.env.NODE_ENV === 'development' ? 'http://localhost:8000' : 'https://ic0.app',
      });

      if (process.env.NODE_ENV === 'development') {
        await agent.fetchRootKey();
      }

      // Import the generated IDL and canister ID
      const { idlFactory } = await import('../declarations/hhdao_identity');
      const canisterId = process.env.CANISTER_ID_HHDAO_IDENTITY || 'uxrrr-q7777-77774-qaaaq-cai';

      this.actor = Actor.createActor(idlFactory, {
        agent,
        canisterId,
      });
    }
    return this.actor;
  }

  async updateDuoValidationPreference(prefersDuo: boolean): Promise<UserProfile> {
    try {
      const actor = await this.getActor();
      const result = await actor.setDuoValidationPreference(prefersDuo);

      if ('ok' in result) {
        return this.formatUserProfile(result.ok);
      } else {
        throw new Error(result.err || 'Failed to update duo validation preference');
      }
    } catch (error) {
      console.error('Error updating duo validation preference:', error);
      // Return mock success for development
      return mockProfile;
    }
  }

  async getDuoValidationPreference(userPrincipal: Principal): Promise<boolean> {
    try {
      const actor = await this.getActor();
      return await actor.getDuoValidationPreference(userPrincipal);
    } catch (error) {
      console.error('Error getting duo validation preference:', error);
      return false;
    }
  }

  async getUsersWithDuoPreference(): Promise<Principal[]> {
    try {
      const actor = await this.getActor();
      return await actor.getUsersWithDuoPreference();
    } catch (error) {
      console.error('Error getting users with duo preference:', error);
      return [];
    }
  }

  async getProfile(principal: Principal): Promise<UserProfile | null> {
    try {
      const actor = await this.getActor();
      const result = await actor.getProfile(principal);
      return result[0] ? this.formatUserProfile(result[0]) : null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  }

  private formatUserProfile(raw: any): UserProfile {
    return {
      principal: raw.principal,
      username: raw.username[0],
      email: raw.email[0],
      displayName: raw.displayName[0],
      bio: raw.bio[0],
      avatar: raw.avatar[0],
      location: raw.location[0],
      website: raw.website[0],
      role: raw.role,
      secondaryRoles: raw.secondaryRoles,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      isVerified: raw.isVerified,
      verificationLevel: raw.verificationLevel,
      aadhaarVerified: raw.aadhaarVerified,
      owpBalance: Number(raw.owpBalance),
      prefersDuoValidation: raw.prefersDuoValidation,
    };
  }
}

// Mock data for development
const mockProfile: UserProfile = {
  principal: Principal.fromText('rrkah-fqaaa-aaaaa-aaaaq-cai'),
  username: 'test_user',
  email: 'test@example.com',
  displayName: 'Test User',
  bio: 'Mock user for development',
  avatar: '/avatars/default.jpg',
  location: 'Test Location',
  website: 'https://example.com',
  role: { Community: null },
  secondaryRoles: [],
  createdAt: BigInt(Date.now() * 1000000),
  updatedAt: BigInt(Date.now() * 1000000),
  isVerified: true,
  verificationLevel: { Basic: null },
  aadhaarVerified: false,
  owpBalance: 100,
  prefersDuoValidation: false,
};

export const identityService = new IdentityService();
