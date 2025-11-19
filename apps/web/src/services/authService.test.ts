import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authService } from './authService';

// Mock the IC dependencies
vi.mock('@dfinity/auth-client', () => ({
  AuthClient: {
    create: vi.fn(),
  },
}));

vi.mock('../declarations/identity', () => ({
  createActor: vi.fn(),
}));

vi.mock('../declarations/identity/index', () => ({
  canisterId: 'test-canister-id',
}));

describe('AuthService', () => {
  let mockAuthClient: any;

  beforeEach(async () => {
    // Reset the singleton instance
    (authService as any).authClient = null;
    (authService as any).user = null;
    (authService as any).listeners = [];
    (authService as any).errorListeners = [];

    mockAuthClient = {
      isAuthenticated: vi.fn(),
      getIdentity: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
      tryCompleteAuthentication: vi.fn(),
    };

    const { AuthClient } = vi.mocked(await import('@dfinity/auth-client'));
    (AuthClient.create as any).mockResolvedValue(mockAuthClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialize', () => {
    it('should initialize with authenticated user', async () => {
      mockAuthClient.isAuthenticated.mockResolvedValue(true);
      mockAuthClient.getIdentity.mockReturnValue({
        getPrincipal: () => ({ toString: () => 'test-principal' }),
      });

      const { createActor } = await import('../declarations/identity');
      const mockActor = {
        getProfile: vi.fn().mockResolvedValue({
          ok: {
            membershipTier: 'Silver',
            createdAt: BigInt(1234567890),
            votingPower: 5,
            walletAddress: 'test-wallet',
            nftBalance: 10,
          },
        }),
      };
      (createActor as any).mockReturnValue(mockActor);

      await authService.initialize();

      const user = authService.getUser();
      expect(user?.isAuthenticated).toBe(true);
      expect(user?.principal).toBe('test-principal');
      expect(user?.membershipTier).toBe('Silver');
    });

    it('should initialize without authenticated user', async () => {
      mockAuthClient.isAuthenticated.mockResolvedValue(false);

      await authService.initialize();

      const user = authService.getUser();
      expect(user).toBeNull();
    });
  });

  describe('login', () => {
    it('should login in demo mode', async () => {
      // Set demo mode
      process.env.NEXT_PUBLIC_DEMO_MODE = 'true';

      const result = await authService.login();

      expect(result.success).toBe(true);
      const user = authService.getUser();
      expect(user?.isAuthenticated).toBe(true);
      expect(user?.principal).toMatch(/^dev-user-principal-/);

      // Reset
      delete process.env.NEXT_PUBLIC_DEMO_MODE;
    });

    it('should handle login failure', async () => {
      mockAuthClient.login.mockImplementation(({ onError }: any) => {
        onError('Test error');
      });

      const result = await authService.login();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Test error');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockAuthClient.isAuthenticated.mockResolvedValue(true);
      mockAuthClient.getIdentity.mockReturnValue({
        getPrincipal: () => ({ toString: () => 'test-principal' }),
      });

      await authService.initialize();
      const logoutResult = await authService.logout();

      expect(logoutResult.success).toBe(true);
      expect(authService.getUser()).toBeNull();
    });
  });

  describe('connectWallet', () => {
    it('should connect wallet successfully', async () => {
      const result = await authService.connectWallet('plug');

      expect(result.success).toBe(true);
      const user = authService.getUser();
      expect(user?.isAuthenticated).toBe(true);
      expect(user?.principal).toBe('rdmx6-jaaaa-aaaah-qdrpq-cai');
      expect(user?.membershipTier).toBe('Gold');
    });
  });

  describe('joinDAO', () => {
    it('should join DAO when authenticated', async () => {
      // Set up authenticated user
      (authService as any).user = {
        principal: 'test-principal',
        isAuthenticated: true,
      };

      const result = await authService.joinDAO();

      expect(result.success).toBe(true);
      expect(result.membershipNFT).toBeDefined();
      expect(result.membershipNFT?.tier).toBe('Bronze');
    });

    it('should fail to join DAO when not authenticated', async () => {
      const result = await authService.joinDAO();

      expect(result.success).toBe(false);
      expect(result.error).toBe('User must be authenticated to join DAO');
    });
  });

  describe('subscription', () => {
    it('should notify listeners on user change', async () => {
      const listener = vi.fn();
      const unsubscribe = authService.subscribe(listener);

      // Simulate user change
      (authService as any).user = { principal: 'test', isAuthenticated: true };
      (authService as any).notifyListeners();

      expect(listener).toHaveBeenCalledWith({ principal: 'test', isAuthenticated: true });

      unsubscribe();
      (authService as any).notifyListeners();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});
