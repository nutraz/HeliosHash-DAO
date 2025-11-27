import React, { useState, useCallback } from 'react';

// Statuses: 'idle' (ready to log in), 'logging-in' (popup open/pending), 'authenticated' (logged in)
const AUTH_STATUS = {
  IDLE: 'idle',
  LOGGING_IN: 'logging-in',
  AUTHENTICATED: 'authenticated',
};

const II_IDENTITY_URL = "https://identity.ic0.app/";
const LOGO_PATH = "/assets/icons/hhdaologo.svg";

/**
 * Single-file React component for HeliosHashDAO Multi-Option Authentication.
 * It simulates the Internet Identity (II) authentication flow.
 */
export default function HHDAOApp() {
  const [authStatus, setAuthStatus] = useState(AUTH_STATUS.IDLE);
  const [principalId, setPrincipalId] = useState('');
  const [message, setMessage] = useState('');

  // Custom CSS for the pulsing effect and layout
  const style = `
    @keyframes pulse-logo {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.9; }
    }
    .pulsating-logo {
      animation: pulse-logo 2s ease-in-out infinite;
      box-shadow: 0 0 15px rgba(100, 255, 218, 0.7);
    }
  `;

  /**
   * Simulates the Internet Identity login process.
   * In a real application, this function would use @dfinity/auth-client.
   * @param {string} method - The login option chosen (e.g., 'mobile', 'social').
   */
  const handleLogin = useCallback(async (method) => {
    setMessage(`Initiating ${method} login via II...`);
    setAuthStatus(AUTH_STATUS.LOGGING_IN);

    // ---------------------------------------------------------------------
    // REAL INTERNET IDENTITY LOGIC REPLACEMENT START
    // ---------------------------------------------------------------------
    /*
      // The real code would look something like this:
      import { AuthClient } from '@dfinity/auth-client';
      const client = await AuthClient.create();

      client.login({
        identityProvider: II_IDENTITY_URL,
        onSuccess: () => {
          const newPrincipalId = client.getIdentity().getPrincipal().toText();
          setPrincipalId(newPrincipalId);
          setAuthStatus(AUTH_STATUS.AUTHENTICATED);
          setMessage("Authentication successful! Welcome to HeliosHash DAO.");
        },
        onError: (error) => {
          setAuthStatus(AUTH_STATUS.IDLE);
          setMessage(`Login failed: ${error}`);
        }
      });
    */
    // ---------------------------------------------------------------------
    // SIMULATION (since real II auth requires external dependencies)
    // ---------------------------------------------------------------------
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network latency/popup wait

    // Successful simulation result
    const mockPrincipal = '2vzhg-4iaaa-aaaaa-b7y4a-cai';
    setPrincipalId(mockPrincipal);
    setAuthStatus(AUTH_STATUS.AUTHENTICATED);
    setMessage(`Success! Principal ID: ${mockPrincipal}`);
    // ---------------------------------------------------------------------
  }, []);

  const handleLogout = useCallback(() => {
    setMessage('Logging out...');
    setPrincipalId('');
    setAuthStatus(AUTH_STATUS.IDLE);
  }, []);

  const getButtonClass = (isActive = true) => 
    `w-full py-3 px-4 rounded-xl text-lg font-semibold transition-all duration-300 transform shadow-lg ${isActive ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-gray-900 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`;

  const getIIButtonClass = () => 
    `w-full py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 transform border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white active:scale-[0.98] mt-4`;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-inter">
      <style>{style}</style>
      <div className="w-full max-w-md bg-gray-800 p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-700">
        
        {/* Logo and Title Section */}
        <div className="text-center mb-10">
          <img
            src={LOGO_PATH}
            alt="HeliosHash DAO Logo"
            className="pulsating-logo w-24 h-24 mx-auto object-cover rounded-full mb-4 ring-4 ring-emerald-400/50"
            onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = "https://placehold.co/96x96/10b981/ffffff?text=DAO+Logo"; }}
          />
          <h1 className="text-3xl font-extrabold text-emerald-400 tracking-wider">HeliosHash DAO</h1>
          <p className="text-sm text-gray-400 mt-1">Decentralized Governance & Identity</p>
        </div>

        {/* Auth Interface */}
        {authStatus === AUTH_STATUS.AUTHENTICATED ? (
          <div className="text-center">
            <h2 className="text-xl font-medium text-white mb-4">✅ Authenticated</h2>
            <p className="text-gray-400 break-words mb-6 p-3 bg-gray-700 rounded-lg">Principal: <code className="text-emerald-300 font-mono text-sm">{principalId}</code></p>
            <button 
              onClick={handleLogout}
              className={getButtonClass().replace('from-emerald-500', 'from-gray-600').replace('to-teal-400', 'to-gray-500').replace('text-gray-900', 'text-white')}
            >Logout</button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">Authenticate with Internet Identity</h2>

            <button onClick={() => handleLogin('Mobile')} disabled={authStatus === AUTH_STATUS.LOGGING_IN} className={getButtonClass(authStatus === AUTH_STATUS.IDLE)}>
              <span className="mr-3">📱</span>
              {authStatus === AUTH_STATUS.LOGGING_IN ? 'Connecting to II...' : 'Login with Mobile Identity'}
            </button>

            <button onClick={() => handleLogin('Social/Passkey')} disabled={authStatus === AUTH_STATUS.LOGGING_IN} className={getButtonClass(authStatus === AUTH_STATUS.IDLE)}>
              <span className="mr-3">🔐</span>
              {authStatus === AUTH_STATUS.LOGGING_IN ? 'Connecting to II...' : 'Login with Passkey/Social'}
            </button>

            {message && (
              <p className="text-sm text-center pt-2 text-yellow-400">{message.includes('Success') ? <span className="text-emerald-400">{message}</span> : message}</p>
            )}

            <a href={II_IDENTITY_URL} target="_blank" rel="noopener noreferrer" className={getIIButtonClass()}>
              <span className="mr-2">🛈</span>
              What is Internet Identity?
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
