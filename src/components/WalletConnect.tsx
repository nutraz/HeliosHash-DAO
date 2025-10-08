import '@connect2ic/core/style.css';
import { ConnectButton, ConnectDialog, useConnect } from '@connect2ic/react';

export function WalletConnect() {
  const { isConnected, principal, activeProvider } = useConnect({
    onConnect: () => {
      // Successfully connected
      console.log('Connected with principal:', principal);
    },
    onDisconnect: () => {
      // Disconnected
      console.log('Disconnected from wallet');
    },
  });

  return (
    <div className='flex flex-col items-center gap-4'>
      <ConnectButton />
      <ConnectDialog dark={false} />
      {isConnected && (
        <div className='text-sm'>
          <p>Connected with: {activeProvider?.name}</p>
          <p className='font-mono'>Principal ID: {principal}</p>
        </div>
      )}
    </div>
  );
}
