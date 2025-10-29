'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { multiChainWalletService, WalletProvider as WalletProviderType } from '../services/wallets/multiChainWallet';

interface Wallet {
  address: string;
  balance: number;
  connected: boolean;
  provider?: WalletProviderType;
}

interface Transaction {
  id: string;
  type: 'investment' | 'reward' | 'transfer';
  amount: string;
  timestamp: Date;
  description: string;
  hash?: string;
}

interface WalletContextType {
  wallet: Wallet | null;
  balance: number;
  transactions: Transaction[];
  connectWallet: (provider: WalletProviderType) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  sendTransaction: (to: string, amount: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if wallet was previously connected
    const checkWalletConnection = async () => {
      try {
        const principal = await multiChainWalletService.getCurrentPrincipal();
        if (principal) {
          await refreshBalance();
          await loadTransactions();
        }
      } catch (err) {
        console.error('Failed to check wallet connection:', err);
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async (provider: WalletProviderType) => {
    setIsLoading(true);
    setError(null);
    try {
      const connected = await multiChainWalletService.connectWallet(provider);
      if (connected) {
        const principal = await multiChainWalletService.getCurrentPrincipal();
        if (principal) {
          const walletData = await multiChainWalletService.getBalance();
          const newWallet: Wallet = {
            address: principal.toString(),
            balance: walletData.balance,
            connected: true,
            provider
          };
          setWallet(newWallet);
          setBalance(walletData.balance);
          await loadTransactions();
        }
      } else {
        throw new Error('Failed to connect wallet');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection failed:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    setIsLoading(true);
    try {
      await multiChainWalletService.disconnectWallet();
      setWallet(null);
      setBalance(0);
      setTransactions([]);
      setError(null);
    } catch (err) {
      console.error('Failed to disconnect wallet:', err);
      setError('Failed to disconnect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const sendTransaction = async (to: string, amount: string) => {
    if (!wallet) throw new Error('No wallet connected');

    setIsLoading(true);
    setError(null);
    try {
      // For now, simulate transaction since full implementation requires canister integration
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: 'transfer',
        amount,
        timestamp: new Date(),
        description: `Transfer to ${to.slice(0, 6)}...${to.slice(-4)}`,
        hash: `0x${Math.random().toString(16).substr(2, 64)}`
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setBalance(prev => prev - parseFloat(amount));

      // In production, this would call the actual smart contract
      console.log('Transaction sent:', { to, amount });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalance = async () => {
    if (!wallet) return;

    try {
      const walletData = await multiChainWalletService.getBalance();
      setBalance(walletData.balance);
      setWallet(prev => prev ? { ...prev, balance: walletData.balance } : null);
    } catch (err) {
      console.error('Failed to refresh balance:', err);
      setError('Failed to refresh balance');
    }
  };

  const loadTransactions = async () => {
    try {
      const txns = await multiChainWalletService.getTransactions();
      // Convert to our Transaction interface
      const formattedTransactions: Transaction[] = txns.map((tx, index) => ({
        id: tx.id || index.toString(),
        type: tx.type as 'investment' | 'reward' | 'transfer',
        amount: tx.amount.toString(),
        timestamp: tx.timestamp,
        description: tx.description
      }));
      setTransactions(formattedTransactions);
    } catch (err) {
      console.error('Failed to load transactions:', err);
      // Keep existing mock data as fallback
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'investment',
          amount: '1000',
          timestamp: new Date('2024-01-15'),
          description: 'Investment in Solar Project Alpha'
        },
        {
          id: '2',
          type: 'reward',
          amount: '50',
          timestamp: new Date('2024-01-20'),
          description: 'Energy generation reward'
        },
        {
          id: '3',
          type: 'investment',
          amount: '500',
          timestamp: new Date('2024-02-01'),
          description: 'Investment in Solar Project Beta'
        }
      ];
      setTransactions(mockTransactions);
    }
  };

  const value: WalletContextType = {
    wallet,
    balance,
    transactions,
    connectWallet,
    disconnectWallet,
    sendTransaction,
    refreshBalance,
    isLoading,
    error,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
