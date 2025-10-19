<<<<<<< HEAD
// Real DFINITY AuthClient imports
import { AuthClient } from '@dfinity/auth-client';
=======
import { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../declarations/identity';
import { _SERVICE as IdentityService } from '../declarations/identity/identity.did';
import { canisterId } from '../declarations/identity/index';
>>>>>>> audit-clean

export interface User {
  principal: string;
  isAuthenticated: boolean;
  identity?: any;
  membershipTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  joinedAt?: number;
  votingPower?: number;
  walletAddress?: string;
  nftBalance?: number;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

class AuthService {
  private authClient: AuthClient | null = null;
  private user: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];
<<<<<<< HEAD
=======
  private errorListeners: ((error: string) => void)[] = [];

  private async refreshUserProfile(): Promise<void> {
    if (!this.authClient || !this.authClient.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    const identity = this.authClient.getIdentity();
    const principal = identity.getPrincipal().toString();
    
    // Get user profile from identity canister
    const identityActor = await this.getIdentityActor(identity);
    const profile = await identityActor.getProfile(principal);
    
    if ('err' in profile) {
      throw new Error(profile.err);
    }
    
    this.user = {
      principal,
      isAuthenticated: true,
      identity,
      membershipTier: profile.ok.membershipTier,
      joinedAt: Number(profile.ok.createdAt),
      votingPower: profile.ok.votingPower,
      walletAddress: profile.ok.walletAddress,
      nftBalance: profile.ok.nftBalance
    };

    this.notifyListeners();
  }

  private async completeAuthentication(): Promise<void> {
    if (!this.authClient) {
      throw new Error('AuthClient not initialized');
    }

    const result = await this.authClient.tryCompleteAuthentication();
    if (!result) {
      throw new Error('Failed to complete authentication');
    }

    await this.refreshUserProfile();
    
    // Clear redirect params and return to original page
    const url = new URL(window.location.href);
    url.searchParams.delete('loginRedirect');
    window.history.replaceState({}, '', url.toString());
  }

  private notifyError(error: string): void {
    this.errorListeners.forEach(listener => listener(error));
  }

  private async getIdentityActor(identity: Identity): Promise<IdentityService> {
    return createActor(canisterId, {
      agentOptions: {
        identity,
        host: process.env.NEXT_PUBLIC_IC_HOST || 'http://localhost:4943'
      }
    });
  }
>>>>>>> audit-clean

  async initialize(): Promise<void> {
    try {
      this.authClient = await AuthClient.create();

      // Check if user is already authenticated
      const isAuthenticated = await this.authClient.isAuthenticated();
<<<<<<< HEAD

      if (isAuthenticated) {
        const identity = this.authClient.getIdentity();
        const principal = identity.getPrincipal().toString();

        // Mock user data - in production, fetch from canister
        this.user = {
          principal,
          isAuthenticated: true,
          identity,
          membershipTier: 'Silver',
          joinedAt: Date.now() - 86400000 * 30, // 30 days ago
          votingPower: 3,
        };

        this.notifyListeners();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
=======
      
      if (isAuthenticated) {
        await this.refreshUserProfile();
      } else {
        // Check if we have a redirect from II
        const searchParams = new URLSearchParams(window.location.search);
        const loginRedirect = searchParams.get('loginRedirect');
        
        if (loginRedirect) {
          // Complete the authentication flow
          await this.completeAuthentication();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear any partial auth state on error
      await this.logout();
      this.notifyError(error instanceof Error ? error.message : 'Authentication failed');
>>>>>>> audit-clean
    }
  }

  async login(): Promise<{ success: boolean; error?: string }> {
    try {
      // For development or demo mode, simulate login without Internet Identity
      const isDemoMode =
        process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

      if (isDemoMode) {
        return this.simulateDevLogin();
      }

      if (!this.authClient) {
        await this.initialize();
      }

      if (!this.authClient) {
        return { success: false, error: 'Failed to initialize auth client' };
      }

      return new Promise((resolve) => {
        try {
          this.authClient!.login({
            // Internet Identity provider
            identityProvider: 'https://identity.ic0.app/',

            onSuccess: async () => {
              try {
                const identity = this.authClient!.getIdentity();
                const principal = identity.getPrincipal().toString();

                // In production, this would call the identity canister to get user data
                this.user = {
                  principal,
                  isAuthenticated: true,
                  identity,
                  membershipTier: 'Silver',
                  joinedAt: Date.now(),
                  votingPower: 1,
                };

                this.notifyListeners();
                resolve({ success: true });
              } catch (err) {
                console.error('Success callback error:', err);
                resolve({ success: false, error: 'Authentication processing failed' });
              }
            },

            onError: (error?: string) => {
              // Don't log errors for user-cancelled authentications
              if (error && !error.includes('UserInterrupt')) {
                console.warn('Internet Identity login failed:', error);
              }
              resolve({ success: false, error: error || 'Internet Identity login cancelled' });
            },
          });
        } catch (loginError) {
          console.error('Login initiation failed:', loginError);
          resolve({ success: false, error: 'Failed to initiate login' });
        }
      });
    } catch (error) {
      console.error('Login method error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }

  private async simulateDevLogin(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🚀 HeliosHash DAO: Running in demo mode - Internet Identity bypassed');

      // Simulate successful login for development
      this.user = {
        principal: 'dev-user-principal-' + Date.now(),
        isAuthenticated: true,
        identity: null, // No real identity in dev mode
        membershipTier: 'Silver',
        joinedAt: Date.now(),
        votingPower: 1,
        walletAddress: '0x1234...5678',
        nftBalance: 3,
      };

      this.notifyListeners();

      // Add a small delay to simulate authentication time
      await new Promise((resolve) => setTimeout(resolve, 500));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'Development login simulation failed',
      };
    }
  }

  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.authClient) {
        return { success: false, error: 'Auth client not initialized' };
      }

      await this.authClient.logout();
      this.user = null;
      this.notifyListeners();

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Logout failed',
      };
    }
  }

  // Mock wallet connections for demo purposes
  async connectWallet(
    walletType: 'plug' | 'stoic' | 'nfid' | 'bitfinity'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock principal based on wallet type
      const mockPrincipals = {
        plug: 'rdmx6-jaaaa-aaaah-qdrpq-cai',
        stoic: 'rrkah-fqaaa-aaaah-qdrqa-cai',
        nfid: 'ryjl3-tyaaa-aaaah-qdrra-cai',
        bitfinity: 'r7inp-6aaaa-aaaah-qdrsa-cai',
      };

      this.user = {
        principal: mockPrincipals[walletType],
        isAuthenticated: true,
        membershipTier: walletType === 'plug' ? 'Gold' : 'Silver',
        joinedAt: Date.now(),
        votingPower: walletType === 'plug' ? 5 : 3,
        walletAddress: `${mockPrincipals[walletType].slice(0, 8)}...${mockPrincipals[
          walletType
        ].slice(-8)}`,
        nftBalance: walletType === 'plug' ? 5 : 3,
      };

      this.notifyListeners();
      return { success: true };
    } catch (error) {
      console.error('Wallet connection error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Wallet connection failed',
      };
    }
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.user?.isAuthenticated || false;
  }

  subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.user));
  }

  // Join DAO - creates membership NFT and sets up user profile
  async joinDAO(): Promise<{ success: boolean; error?: string; membershipNFT?: any }> {
    try {
      if (!this.user?.isAuthenticated) {
        return { success: false, error: 'User must be authenticated to join DAO' };
      }

      // In production, this would call the DAO canister
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate processing

      // Mock membership NFT creation
      const membershipNFT = {
        id: Math.floor(Math.random() * 10000),
        name: 'HeliosHash DAO Membership',
        tier: 'Bronze',
        votingPower: 1,
        benefits: [
          'Participate in governance voting',
          'Access to community forums',
          'Solar project updates',
          'Basic energy trading rights',
        ],
      };

      // Update user with DAO membership
      if (this.user) {
        this.user.membershipTier = 'Bronze';
        this.user.votingPower = 1;
        this.user.joinedAt = Date.now();
        this.notifyListeners();
      }

      return { success: true, membershipNFT };
    } catch (error) {
      console.error('Join DAO error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to join DAO',
      };
    }
  }
}

// Singleton instance
export const authService = new AuthService();
