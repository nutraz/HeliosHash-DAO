'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [connecting, setConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const connectWallet = async () => {
    setConnecting(true);
    setErrorMessage('');
    try {
      if ((window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          // Mock user data
          const user = {
            principal: accounts[0],
            isWoman: true, // Set to true for testing women's bonus
            balance: 2450,
          };
          // TODO(PRIV-002): Do NOT persist sensitive profile data in localStorage. Use secure server-side session or HttpOnly cookie.
          // See .github/ISSUES/privacy/002-audit-login-localstorage.md for details and migration plan.
          localStorage.setItem('user', JSON.stringify(user));
          // Set auth cookie for middleware (keep only minimal token; rotate and store sessions server-side)
          document.cookie = 'auth_token=valid_token; path=/; max-age=86400';
          router.push('/dashboard');
        }
      } else {
        setErrorMessage('MetaMask not found');
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setErrorMessage('Connection failed. Please try again.');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <main role='main'>
      <div>
        <h1>Login</h1>
        <p>Wallet connection and authentication</p>
        <button data-testid='connect-wallet-button' onClick={connectWallet} disabled={connecting}>
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
        {errorMessage && (
          <div data-testid='error-message' className='text-red-600 mt-2'>
            {errorMessage}
          </div>
        )}
      </div>
    </main>
  );
}
