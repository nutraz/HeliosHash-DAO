
import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import { OwpLogo } from './components/IconComponents';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(true);

  useEffect(() => {
    // Simulate checking for a stored session
    setTimeout(() => {
      setIsAuthenticating(false);
    }, 1500);
  }, []);

  const handleLogin = () => {
    setIsAuthenticating(true);
    // Simulate wallet connection and NFT check
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsAuthenticating(false);
    }, 2000);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (isAuthenticating && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4">
        <OwpLogo className="h-24 w-24 animate-pulse text-cyan-400" />
        <p className="mt-4 font-orbitron text-cyan-300">Connecting to ICP Network...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900">
      {isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <LoginScreen onLogin={handleLogin} isAuthenticating={isAuthenticating} />}
    </div>
  );
};

export default App;
