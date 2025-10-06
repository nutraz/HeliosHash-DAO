import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authService, User } from './authService';
import { AuthClient } from '@dfinity/auth-client';

vi.mock('@dfinity/auth-client', () => ({
  AuthClient: {
    create: vi.fn(),
  },
}));

describe('AuthService', () => {
  let mockAuthClient: any;

  beforeEach(() => {
    mockAuthClient = {
      isAuthenticated: vi.fn(),
      getIdentity: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
    };
    (AuthClient.create as any).mockResolvedValue(mockAuthClient);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialize', () => {
    it('should initialize with unauthenticated state', async () => {
      mockAuthClient.isAuthenticated.mockResolvedValue(false);
      await authService.initialize();
      expect(AuthClient.create).toHaveBeenCalled();
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should initialize with authenticated user', async () => {
      const mockPrincipal = { toString: () => 'test-principal-123' };
      const mockIdentity = { getPrincipal: () => mockPrincipal };
      mockAuthClient.isAuthenticated.mockResolvedValue(true);
      mockAuthClient.getIdentity.mockReturnValue(mockIdentity);
      await authService.initialize();
      expect(authService.isAuthenticated()).toBe(true);
      const user = authService.getUser();
      expect(user?.principal).toBe('test-principal-123');
    });
  });

  describe('login', () => {
    it('should successfully login in demo mode', async () => {
      process.env.NEXT_PUBLIC_DEMO_MODE = 'true';
      const result = await authService.login();
      expect(result.success).toBe(true);
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should handle login cancellation', async () => {
      process.env.NEXT_PUBLIC_DEMO_MODE = 'false';
      mockAuthClient.login.mockImplementation((options: any) => {
        options.onError('UserInterrupt');
        return Promise.resolve();
      });
      const result = await authService.login();
      expect(result.success).toBe(false);
      expect(result.error).toContain('cancelled');
    });
  });

  describe('connectWallet', () => {
    it('should connect plug wallet with Gold tier', async () => {
      const result = await authService.connectWallet('plug');
      expect(result.success).toBe(true);
      const user = authService.getUser();
      expect(user?.membershipTier).toBe('Gold');
      expect(user?.votingPower).toBe(5);
    });

    it('should connect stoic wallet with Silver tier', async () => {
      const result = await authService.connectWallet('stoic');
      expect(result.success).toBe(true);
      const user = authService.getUser();
      expect(user?.membershipTier).toBe('Silver');
    });
  });
});