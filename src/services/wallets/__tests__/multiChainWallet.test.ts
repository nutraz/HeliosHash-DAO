<<<<<<< HEAD
=======
// Define wallet provider mocks as globals before importing the service
class Plug {
  async connect() {
    return true;
  }
  async getPrincipal() {
    return 'mock-principal';
  }
  async requestBalance() {
    return { owp: 42, pendingRewards: 1, stakedAmount: 2, fiatValue: 100, transactions: [] };
  }
}
class Stoic extends Plug {}
class NFID extends Plug {}
class Bitfinity extends Plug {}
// @ts-ignore
globalThis.Plug = Plug;
// @ts-ignore
globalThis.Stoic = Stoic;
// @ts-ignore
globalThis.NFID = NFID;
// @ts-ignore
globalThis.Bitfinity = Bitfinity;

>>>>>>> audit-clean
import { beforeEach, describe, expect, it } from 'vitest';
import { MultiChainWalletService } from '../multiChainWallet';

describe('MultiChainWalletService', () => {
  let walletService: MultiChainWalletService;

  beforeEach(() => {
    walletService = new MultiChainWalletService();
  });

  describe('connectWallet', () => {
    it('should connect to Plug wallet', async () => {
      const result = await walletService.connectWallet('plug');
      expect(result).toBe(true);
    });

    it('should connect to Stoic wallet', async () => {
      const result = await walletService.connectWallet('stoic');
      expect(result).toBe(true);
    });

    it('should connect to NFID wallet', async () => {
      const result = await walletService.connectWallet('nfid');
      expect(result).toBe(true);
    });

    it('should connect to Bitfinity wallet', async () => {
      const result = await walletService.connectWallet('bitfinity');
      expect(result).toBe(true);
    });

    it('should throw error for unsupported wallet', async () => {
      await expect(walletService.connectWallet('unsupported' as any)).rejects.toThrow(
        'Unsupported wallet provider: unsupported'
      );
    });
  });

  describe('getCurrentPrincipal', () => {
    it('should return null when no wallet is connected', async () => {
      const principal = await walletService.getCurrentPrincipal();
      expect(principal).toBeNull();
    });

    it('should return principal for connected wallet', async () => {
      await walletService.connectWallet('plug');
      const principal = await walletService.getCurrentPrincipal();
      expect(principal).not.toBeNull();
    });
  });

  describe('getBalance', () => {
    it('should throw error when no wallet is connected', async () => {
      await expect(walletService.getBalance()).rejects.toThrow('No wallet connected');
    });

    it('should return balance for connected wallet', async () => {
      await walletService.connectWallet('plug');
      const balance = await walletService.getBalance();
      expect(balance).toHaveProperty('balance');
      expect(balance).toHaveProperty('pendingRewards');
      expect(balance).toHaveProperty('stakedAmount');
      expect(balance).toHaveProperty('fiatValue');
      expect(balance).toHaveProperty('transactions');
    });
  });
});
