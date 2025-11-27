import { Transaction, WalletData, WalletService } from '../types';

export class MockWalletService implements WalletService {
  async getBalance(): Promise<WalletData> {
    await new Promise((r) => setTimeout(r, 400));
    return {
      balance: 125.75,
      pendingRewards: 5.25,
      stakedAmount: 50,
      fiatValue: 18862.5,
      transactions: 24,
    };
  }
  async getTransactions(): Promise<Transaction[]> {
    await new Promise((r) => setTimeout(r, 300));
    return [
      {
        id: 'tx1',
        type: 'reward',
        amount: 5.25,
        currency: 'OWP',
        timestamp: new Date(Date.now() - 86400000),
        status: 'completed',
        description: 'Mining reward',
      },
      {
        id: 'tx2',
        type: 'staking',
        amount: 50,
        currency: 'OWP',
        timestamp: new Date(Date.now() - 172800000),
        status: 'completed',
        description: 'Staking deposit',
      },
      {
        id: 'tx3',
        type: 'deposit',
        amount: 100,
        currency: 'OWP',
        timestamp: new Date(Date.now() - 259200000),
        status: 'completed',
        description: 'Initial deposit',
      },
    ];
  }
}

export const walletService: WalletService = new MockWalletService();
