import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function useAuth() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, error } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect({ connector: connectors[0] });
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return {
    address,
    isConnected,
    isConnecting,
    error,
    connect: handleConnect,
    disconnect: handleDisconnect,
  };
}
