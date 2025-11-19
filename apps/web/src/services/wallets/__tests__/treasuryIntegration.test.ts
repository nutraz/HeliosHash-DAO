import { Principal } from '@dfinity/principal';
import { beforeEach, describe, expect, it } from 'vitest';
import { WalletError } from '../errors';
import { TreasuryIntegrationService } from '../treasuryIntegration';

describe('TreasuryIntegrationService', () => {
  let treasuryService: TreasuryIntegrationService;
  let testPrincipal: Principal;

  beforeEach(() => {
    treasuryService = new TreasuryIntegrationService();
    testPrincipal = Principal.fromText('aaaaa-aa');
  });

  describe('getBalance', () => {
    it('should fetch balance from treasury canister', async () => {
      // TODO: Mock treasury actor
      const balance = await treasuryService.getBalance(testPrincipal);
      expect(balance).toBeDefined();
      expect(typeof balance).toBe('bigint');
    });

    it('should handle errors gracefully', async () => {
      // Mock treasury actor to throw error
      // @ts-ignore
      globalThis.__treasuryMockOverrides = {
        balanceOf: async () => {
          throw new Error('Test error');
        },
      };
      await expect(treasuryService.getBalance(testPrincipal)).rejects.toThrow(WalletError);
    });

    it('should retry on failure', async () => {
      let attempts = 0;
      // Mock treasury actor to fail twice then succeed
      // @ts-ignore
      globalThis.__treasuryMockOverrides = {
        balanceOf: async () => {
          attempts++;
          if (attempts < 3) throw new Error('Test error');
          return BigInt(123);
        },
      };
      const balance = await treasuryService.getBalance(testPrincipal);
      expect(attempts).toBeGreaterThan(1);
      expect(balance).toBe(BigInt(123));
    });
  });

  describe('getTransactions', () => {
    it('should fetch transaction history', async () => {
      const txns = await treasuryService.getTransactions(testPrincipal, 10);
      expect(Array.isArray(txns)).toBe(true);
      expect(txns.length).toBeLessThanOrEqual(10);
    });

    it('should handle pagination correctly', async () => {
  // No override needed: the default mock returns different arrays for different offsets
      const page1 = await treasuryService.getTransactions(testPrincipal, 5, 0);
      const page2 = await treasuryService.getTransactions(testPrincipal, 5, 5);
      expect(page1).not.toEqual(page2);
    });
  });

  describe('getPendingRewards', () => {
    it('should fetch pending rewards', async () => {
      const rewards = await treasuryService.getPendingRewards(testPrincipal);
      expect(rewards).toBeDefined();
      expect(typeof rewards).toBe('bigint');
    });
  });

  describe('getStakedAmount', () => {
    it('should fetch staked amount', async () => {
      const staked = await treasuryService.getStakedAmount(testPrincipal);
      expect(staked).toBeDefined();
      expect(typeof staked).toBe('bigint');
    });
  });
});
