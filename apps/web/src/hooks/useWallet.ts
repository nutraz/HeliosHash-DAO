import { useAppStore, WalletState } from '@/lib/store';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

export interface WalletInfo extends Partial<WalletState> {
  provider: 'metamask' | 'walletconnect' | 'coinbase' | 'internet-identity' | null;
  address: string | null;
  balance: string;
  network: string | null;
}

export const useWallet = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setWallet, setAuthenticated, setUser, wallet } = useAppStore();

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkExistingConnection();
  }, []);

  const checkExistingConnection = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          const address = accounts[0].address;
          const balance = await provider.getBalance(address);
          const network = await provider.getNetwork();

          const walletInfo: WalletInfo = {
            provider: 'metamask',
            address,
            balance: ethers.formatEther(balance),
            network: network.name,
            signer: await provider.getSigner(),
            instance: provider,
          };

          setWallet(walletInfo);
          setAuthenticated(true);
          setUser({
            id: address,
            address,
            provider: 'metamask',
            balance: walletInfo.balance,
            votingPower: '0', // Will be updated from canister
          });
        }
      }
    } catch (err) {
      console.error('Error checking existing connection:', err);
    }
  };

  // Refresh balance helper - safe to call from UI or internal listeners
  const refreshBalance = async () => {
    try {
      const stored: WalletState | null = wallet ?? useAppStore.getState().wallet;
      if (!stored || !stored.instance || !stored.address) return;
      const provider = stored.instance;
  const bal = await provider.getBalance(stored.address);
  const balStr = ethers.formatEther(bal as bigint);
      setWallet({ ...stored, balance: balStr });
      // Also update user in store if present
      const currentUser = useAppStore.getState().user;
      if (currentUser && currentUser.address === stored.address) {
        setUser({ ...currentUser, balance: balStr });
      }
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  };

  const connectWallet = async (providerType: 'metamask' | 'walletconnect' | 'coinbase' | 'internet-identity') => {
    setIsConnecting(true);
    setError(null);

    try {
      let providerInstance: ethers.BrowserProvider;
      let address: string;
      let balance: string;
      let networkName: string;
      let signer: ethers.Signer;

      switch (providerType) {
        case 'metamask':
          if (!window.ethereum) {
            throw new Error('MetaMask not installed');
          }
          providerInstance = new ethers.BrowserProvider(window.ethereum);
          signer = await providerInstance.getSigner();
          // Request accounts through the signer
          address = await signer.getAddress();
          const balanceWei = await providerInstance.getBalance(address);
          balance = ethers.formatEther(balanceWei);
          const network = await providerInstance.getNetwork();
          networkName = network.name;
          break;

        case 'walletconnect':
          // For now, show a message that WalletConnect setup is needed
          throw new Error('WalletConnect integration requires additional setup. Please use MetaMask for now.');

        case 'coinbase':
          // Coinbase Wallet SDK integration would go here
          // For now, fall back to MetaMask-like behavior
          if (!window.ethereum) {
            throw new Error('Coinbase Wallet not available');
          }
          providerInstance = new ethers.BrowserProvider(window.ethereum);
          signer = await providerInstance.getSigner();
          address = await signer.getAddress();
          const cbBalance = await providerInstance.getBalance(address);
          balance = ethers.formatEther(cbBalance);
          const cbNetwork = await providerInstance.getNetwork();
          networkName = cbNetwork.name;
          break;

        case 'internet-identity':
          // Redirect to Internet Identity
          window.location.href = 'https://identity.ic0.app/';
          return; // This will redirect, so no further processing

        default:
          throw new Error('Unsupported provider');
      }

      const walletInfo: WalletInfo = {
        provider: providerType,
        address,
        balance,
        network: networkName,
        signer,
        instance: providerInstance,
      };

      setWallet(walletInfo);
      setAuthenticated(true);
      setUser({
        id: address,
        address,
        provider: providerType,
        balance,
        votingPower: '0', // Will be fetched from canister
      });

      // Track successful connection
      useAppStore.getState().trackEvent('wallet_connected', {
        provider: providerType,
        network: networkName,
      });

    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      // For MetaMask and similar, we can't actually disconnect
      // but we can clear our local state
      setWallet(null);
      setAuthenticated(false);
      setUser(null);

      // Track disconnection
      useAppStore.getState().trackEvent('wallet_disconnected', {
        provider: wallet?.provider,
      });
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
    }
  };

  const switchNetwork = async (chainId: number) => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not available');
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });

      // Refresh wallet info
      await checkExistingConnection();
    } catch (err: any) {
      // If network doesn't exist, try to add it
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${chainId.toString(16)}`,
              chainName: 'Unknown Network',
              rpcUrls: ['https://rpc.ankr.com/eth'],
            }],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      }
      setError(err.message || 'Failed to switch network');
    }
  };

  // Listen to provider events and fall back to polling if needed
  useEffect(() => {
    const stored: WalletState | null = wallet;
    if (!stored || !stored.instance) return;

  const provider = stored.instance;

    // Helper to attach/remove listeners on either the provider or window.ethereum
    // Use a type guard to detect evented providers without unsafe casts
    type Evented = { on: (event: string, ...args: any[]) => void; removeListener?: (event: string, ...args: any[]) => void };
    function isEvented(p: unknown): p is Evented {
      return !!p && typeof (p as { on?: unknown }).on === 'function';
    }

    const target: Evented | undefined = isEvented(provider)
      ? provider
      : isEvented(window.ethereum)
      ? window.ethereum
      : undefined;

    const handleAccountsChanged = (accounts: any) => {
      try {
        if (!accounts || accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== stored.address) {
          // Update stored address and refresh balance
          setWallet({ ...(stored as WalletState), address: accounts[0] });
          refreshBalance();
        }
      } catch (err) {
        console.error('accountsChanged handler error', err);
      }
    };

    const handleBlock = () => {
      refreshBalance();
    };

    const handleChainChanged = () => {
      // On chain change, refresh balance and re-check connection
      refreshBalance();
      checkExistingConnection();
    };

    let pollingId: number | undefined;

    if (target && target.on) {
      try {
        target.on('accountsChanged', handleAccountsChanged);
        // Some providers expose 'block' events (ethers providers) — listen if available
        if (target.on) target.on('block', handleBlock);
        if (target.on) target.on('chainChanged', handleChainChanged);
      } catch (err) {
        // If attaching fails, fallback to polling
        pollingId = window.setInterval(refreshBalance, 30000);
      }
    } else {
      // Fallback polling
      pollingId = window.setInterval(refreshBalance, 30000);
    }

    return () => {
      try {
        if (target && target.removeListener) {
          target.removeListener('accountsChanged', handleAccountsChanged);
          if (target.removeListener) target.removeListener('block', handleBlock);
          if (target.removeListener) target.removeListener('chainChanged', handleChainChanged);
        }
      } catch (err) {
        // ignore
      }
      if (pollingId) clearInterval(pollingId);
    };
  }, [wallet]);

  return {
    wallet,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalance,
  };
};

// NOTE: window.ethereum is typed in src/global.d.ts to provide a minimal
// EIP-1193-like interface for Ethereum providers. Avoid redeclaring here.