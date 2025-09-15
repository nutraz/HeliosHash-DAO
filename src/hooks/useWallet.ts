import React, { useState, useEffect } from 'react';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useWallet = (): WalletState => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => {
    try {
      // Check if IC Plug wallet is available (for Internet Computer)
      if ((window as any).ic?.plug) {
        const connected = await (window as any).ic.plug.requestConnect();
        if (connected) {
          const agent = await (window as any).ic.plug.createAgent();
          const principal = agent.getPrincipal();
          setIsConnected(true);
          setAddress(principal.toString());
        }
      } else {
        // Mock connection for testing
        setIsConnected(true);
        setAddress('test-principal-address');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
  };

  return {
    isConnected,
    address,
    connect,
    disconnect,
  };
};