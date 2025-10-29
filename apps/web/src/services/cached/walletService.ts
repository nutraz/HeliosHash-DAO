import { cache } from '../cache';
import { MockWalletService } from '../mock/walletService';
import { Transaction, WalletData, WalletService } from '../types';

export class CachedWalletService implements WalletService {
  private inner: WalletService;
  constructor(inner: WalletService = new MockWalletService()) {
    this.inner = inner;
  }
  async getBalance(): Promise<WalletData> {
    const key = 'wallet:balance';
    const cached = cache.get<WalletData>(key);
    if (cached) return cached;
    const data = await this.inner.getBalance();
    cache.set(key, data);
    return data;
  }
  async getTransactions(): Promise<Transaction[]> {
    const key = 'wallet:transactions';
    const cached = cache.get<Transaction[]>(key);
    if (cached) return cached;
    const data = await this.inner.getTransactions();
    cache.set(key, data, 60 * 1000); // 1 minute TTL
    return data;
  }
  clearCache() {
    cache.clear('wallet:balance');
    cache.clear('wallet:transactions');
  }
}

export const cachedWalletService = new CachedWalletService();
