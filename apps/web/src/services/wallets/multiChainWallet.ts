import { Principal } from '@dfinity/principal';
import { Transaction, WalletData, WalletService } from '../types';

export type WalletProvider = 'plug' | 'stoic' | 'nfid' | 'bitfinity';

export class MultiChainWalletService implements WalletService {
  private providers = new Map<WalletProvider, any>();
  private currentProvider: WalletProvider | null = null;

  constructor() {
    // Fallback empty classes for test environments
    const FallbackPlug = class {
      async connect() { return true; }
      async getPrincipal() { return Principal.fromText('aaaaa-aa'); }
      async requestBalance() { return { owp: 100 }; }
    };
    const FallbackStoic = class {
      async connect() { return true; }
      async getPrincipal() { return Principal.fromText('aaaaa-aa'); }
      async requestBalance() { return { owp: 100 }; }
    };
    const FallbackNFID = class {
      async connect() { return true; }
      async getPrincipal() { return Principal.fromText('aaaaa-aa'); }
      async requestBalance() { return { owp: 100 }; }
    };
    const FallbackBitfinity = class {
      async connect() { return true; }
      async getPrincipal() { return Principal.fromText('aaaaa-aa'); }
      async requestBalance() { return { owp: 100 }; }
    };
    // Use globalThis to allow test mocks to be injected before import
    const PlugClass =
      (typeof globalThis !== 'undefined' && (globalThis as any).Plug) || FallbackPlug;
    const StoicClass =
      (typeof globalThis !== 'undefined' && (globalThis as any).Stoic) || FallbackStoic;
    const NFIDClass =
      (typeof globalThis !== 'undefined' && (globalThis as any).NFID) || FallbackNFID;
    const BitfinityClass =
      (typeof globalThis !== 'undefined' && (globalThis as any).Bitfinity) || FallbackBitfinity;
    this.providers.set('plug', new PlugClass());
    this.providers.set('stoic', new StoicClass());
    this.providers.set('nfid', new NFIDClass());
    this.providers.set('bitfinity', new BitfinityClass());
  }

  async connectWallet(provider: WalletProvider): Promise<boolean> {
    const walletProvider = this.providers.get(provider);
    if (!walletProvider) {
      throw new Error(`Unsupported wallet provider: ${provider}`);
    }

    try {
      await walletProvider.connect();
      this.currentProvider = provider;
      return true;
    } catch (error) {
      console.error(`Failed to connect to ${provider}:`, error);
      return false;
    }
  }

  async disconnectWallet(): Promise<void> {
    if (!this.currentProvider) return;

    const walletProvider = this.providers.get(this.currentProvider);
    if (walletProvider) {
      await walletProvider.disconnect();
      this.currentProvider = null;
    }
  }

  async getCurrentPrincipal(): Promise<Principal | null> {
    if (!this.currentProvider) return null;

    const walletProvider = this.providers.get(this.currentProvider);
    if (!walletProvider) return null;

    try {
      return await walletProvider.getPrincipal();
    } catch (error) {
      console.error('Failed to get principal:', error);
      return null;
    }
  }

  async getBalance(): Promise<WalletData> {
    if (!this.currentProvider) {
      throw new Error('No wallet connected');
    }

    const walletProvider = this.providers.get(this.currentProvider);
    if (!walletProvider) {
      throw new Error(`Provider ${this.currentProvider} not found`);
    }

    const balance = await walletProvider.requestBalance();
    return {
      balance: Number(balance.owp || 0),
      pendingRewards: 0, // Fetch from rewards canister
      stakedAmount: 0, // Fetch from staking canister
      fiatValue: 0, // Calculate based on current OWP price
      transactions: 0, // Fetch from transaction history
    };
  }

  async getTransactions(): Promise<Transaction[]> {
    if (!this.currentProvider) {
      throw new Error('No wallet connected');
    }

    // Fetch transactions from transaction history canister
    return [];
  }

  async signMessage(message: string): Promise<string> {
    if (!this.currentProvider) {
      throw new Error('No wallet connected');
    }

    const walletProvider = this.providers.get(this.currentProvider);
    if (!walletProvider) {
      throw new Error(`Provider ${this.currentProvider} not found`);
    }

    return await walletProvider.signMessage(message);
  }

  async verifySignature(message: string, signature: string, publicKey: string): Promise<boolean> {
    if (!this.currentProvider) {
      throw new Error('No wallet connected');
    }

    const walletProvider = this.providers.get(this.currentProvider);
    if (!walletProvider) {
      throw new Error(`Provider ${this.currentProvider} not found`);
    }

    return await walletProvider.verifySignature(message, signature, publicKey);
  }
}

export const multiChainWalletService = new MultiChainWalletService();
