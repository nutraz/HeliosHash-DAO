
"use client";
import { useWallet as useZustandWallet } from '@/hooks/useWallet';
import { Chrome, Mail, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// ✅ PRECOMPUTE spoke positions — no Math.* at render time
const SPOKE_POSITIONS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i * 360) / 24;
  const radius = 100;
  const x2 = radius * Math.cos((angle - 90) * Math.PI / 180);
  const y2 = radius * Math.sin((angle - 90) * Math.PI / 180);
  return { x2, y2 };
});

const Web3App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'language' | 'auth' | 'dashboard'>('splash');
  const [rotation, setRotation] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isFirstTime, setIsFirstTime] = useState(true);

  // Use the existing Zustand-backed wallet hook
  const { wallet, isConnecting, error, connectWallet, disconnectWallet, refreshBalance } = useZustandWallet();
  const address = wallet?.address ?? null;
  const balance = wallet?.balance ?? '0';

  // Read visit / language from localStorage on mount
  useEffect(() => {
    try {
      const hasVisited = window.localStorage.getItem('hasVisitedBefore');
      const lang = window.localStorage.getItem('selectedLanguage');
      if (hasVisited === 'true') {
        setIsFirstTime(false);
        if (lang) setSelectedLanguage(lang);
      }
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  // Chakra visual component (extracted for clarity)
  const DhammaChakra: React.FC = () => (
    <div className="dhamma-chakra">
      <div className="dhamma-chakra-inner" style={{ transform: `rotate(${rotation}deg)` }}>
        {/* Outer fiery ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 opacity-80 blur-sm animate-pulse"></div>
        {/* Main chakra body */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 shadow-2xl"></div>
        {/* Center circle */}
        <div className="absolute inset-20 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 shadow-inner"></div>
        {/* 24 Spokes — using precomputed static values */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 256">
          <g transform="translate(128, 128)">
            {SPOKE_POSITIONS.map((spoke, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2={spoke.x2.toString()}
                y2={spoke.y2.toString()}
                stroke="white"
                strokeWidth="3"
                opacity="0.9"
              />
            ))}
          </g>
        </svg>
        {/* Flame flares — static styles moved to CSS classes; keep dynamic rotation and animation delays inline */}
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 15}deg)`,
              transformOrigin: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <div
              className="dhamma-chakra-flame"
              style={{
                animation: `flare ${1.5 + Math.random() * 0.5}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          </div>
        ))}
        {[...Array(24)].map((_, i) => (
          <div
            key={`outer-${i}`}
            className="absolute top-1/2 left-1/2"
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 15 + 7.5}deg)`,
              transformOrigin: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <div
              className="dhamma-chakra-flame-outer"
              style={{
                animation: `flare ${1.8 + Math.random() * 0.7}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.07}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const Logo = ({ small = false }) => (
    <div className={`${small ? 'w-12 h-12' : 'w-32 h-32'} flex items-center justify-center`}>
      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
        HH
      </div>
    </div>
  );

  // Wallet header shown across screens
  const WalletHeader: React.FC<{ address: string | null; balance: string; isConnecting: boolean; onDisconnect: () => void }> = ({ address, balance, isConnecting, onDisconnect }) => (
    <div className="bg-slate-800/50 backdrop-blur-lg border-b border-blue-500/20 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Logo small={true} />
          <h1 className="text-white text-xl font-bold">HeliosHash DAO</h1>
        </div>

        {address ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-blue-300 text-sm">Connected</span>
            </div>
            <div className="text-right">
              <div className="text-white text-sm font-medium">{address.slice(0, 6)}...{address.slice(-4)}</div>
              <div className="text-blue-300 text-xs">{(balance ? Number.parseFloat(balance).toFixed(4) : '0.0000')} ETH</div>
            </div>
            <button onClick={onDisconnect} className="text-blue-300 hover:text-white text-sm">Disconnect</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full" />
            <span className="text-blue-300 text-sm">Not connected</span>
          </div>
        )}
      </div>
    </div>
  );

  // Debug banner (dev-only) — include wallet state
  const DebugBanner: React.FC<{
    currentScreen: string;
    isFirstTime: boolean;
    selectedLanguage: string;
    address: string | null;
    isConnecting: boolean;
    error: string | null;
  }> = ({ currentScreen, isFirstTime, selectedLanguage, address, isConnecting, error }) => {
    if (process.env.NODE_ENV === 'production') return null;
    return (
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-2 text-xs z-50 flex justify-between flex-wrap">
        <div>Screen: {currentScreen}</div>
        <div>First Time: {isFirstTime ? 'Yes' : 'No'}</div>
        <div>Language: {selectedLanguage}</div>
        <div>Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</div>
        <div>Connecting: {isConnecting ? 'Yes' : 'No'}</div>
        {error && <div className="text-yellow-300">Error: {error}</div>}
      </div>
    );
  };

  // Render splash -> language -> auth -> dashboard based on currentScreen
  // Splash screen timer and rotation animation
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      if (isFirstTime) setCurrentScreen('language');
      else setCurrentScreen('auth');
    }, 1200);

    const rotationInterval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 16);

    return () => {
      clearTimeout(splashTimer);
      clearInterval(rotationInterval);
    };
  }, [isFirstTime]);

  // When wallet address becomes available, go to dashboard
  useEffect(() => {
    if (address) setCurrentScreen('dashboard');
  }, [address]);

  // Refresh balance when address changes (hook also sets up provider events / polling)
  useEffect(() => {
    if (address && typeof refreshBalance === 'function') {
      try {
        refreshBalance();
      } catch (err) {
        // ignore
      }
    }
  }, [address, refreshBalance]);

  // Splash Screen
  const SplashScreen = () => (
    <>
      <DebugBanner currentScreen={currentScreen} isFirstTime={isFirstTime} selectedLanguage={selectedLanguage} address={address} isConnecting={isConnecting} error={error} />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center overflow-hidden">
        <div className="relative">
          <DhammaChakra />
          <div className="absolute inset-0 flex items-center justify-center">
            <Logo />
          </div>
        </div>
      </div>
    </>
  );

  // Language selection screen
  const LanguageSelectionScreen = () => {
    const languages = [
      { code: 'en', label: 'English' },
      { code: 'hi', label: 'हिंदी (Hindi)' },
      { code: 'bn', label: 'বাংলা (Bengali)' },
      { code: 'te', label: 'తెలుగు (Telugu)' },
      { code: 'mr', label: 'मराठी (Marathi)' },
      { code: 'ta', label: 'தமிழ் (Tamil)' },
    ];

    const confirmLanguage = (code?: string) => {
      const chosen = code || selectedLanguage || 'en';
      try {
        window.localStorage.setItem('selectedLanguage', chosen);
        window.localStorage.setItem('hasVisitedBefore', 'true');
      } catch (e) {
        // ignore
      }
      setSelectedLanguage(chosen);
      setIsFirstTime(false);
      setCurrentScreen('auth');
    };

    return (
      <>
        <DebugBanner currentScreen={currentScreen} isFirstTime={isFirstTime} selectedLanguage={selectedLanguage} address={address} isConnecting={isConnecting} error={error} />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
          <WalletHeader address={address} balance={balance} isConnecting={isConnecting} onDisconnect={async () => { await disconnectWallet(); setCurrentScreen('auth'); }} />
          <div className="flex-1 flex items-center justify-center px-6 pb-12">
            <div className="w-full max-w-md">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-3">Select Language</h1>
                <p className="text-blue-200 text-lg">Choose your preferred language</p>
              </div>
              <div className="space-y-3">
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => confirmLanguage(language.code)}
                    className={`w-full p-4 rounded-2xl shadow-lg transform transition hover:scale-105 flex items-center justify-between ${
                      selectedLanguage === language.code
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{language.code === 'en' ? '🇺🇸' : '🌐'}</span>
                      <span className="font-semibold">{language.label}</span>
                    </div>
                    {selectedLanguage === language.code && (
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button onClick={() => confirmLanguage(selectedLanguage)} className="w-full mt-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105">Continue</button>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Auth screen
  const AuthScreen = () => (
    <>
      <DebugBanner currentScreen={currentScreen} isFirstTime={isFirstTime} selectedLanguage={selectedLanguage} address={address} isConnecting={isConnecting} error={error} />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
        <WalletHeader address={address} balance={balance} isConnecting={isConnecting} onDisconnect={async () => { await disconnectWallet(); setCurrentScreen('auth'); }} />
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-3">Welcome</h1>
              <p className="text-blue-200 text-lg">Connect your wallet to continue</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <button onClick={() => connectWallet('metamask')} disabled={isConnecting} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3">
                <Wallet className="w-6 h-6" />
                <span>{isConnecting ? 'Connecting...' : 'Connect with MetaMask'}</span>
              </button>

              <button onClick={() => connectWallet('walletconnect')} disabled={isConnecting} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3">
                <Wallet className="w-6 h-6" />
                <span>{isConnecting ? 'Connecting...' : 'WalletConnect'}</span>
              </button>

              <button onClick={() => connectWallet('coinbase')} disabled={isConnecting} className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3">
                <Wallet className="w-6 h-6" />
                <span>{isConnecting ? 'Connecting...' : 'Coinbase Wallet'}</span>
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blue-400/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-900 text-blue-300">Or continue with</span>
                </div>
              </div>

              <button onClick={() => connectWallet('internet-identity')} disabled={isConnecting} className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3">
                <span>Internet Computer</span>
              </button>

              <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3 border border-blue-500/30">
                <Mail className="w-6 h-6" />
                <span>Continue with Email</span>
              </button>

              <button className="w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-3">
                <Chrome className="w-6 h-6" />
                <span>Continue with Google</span>
              </button>
            </div>

            <p className="text-center text-blue-300/60 text-sm mt-8">By connecting, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    </>
  );

  // Dashboard screen
  const DashboardScreen = () => (
    <>
      <DebugBanner currentScreen={currentScreen} isFirstTime={isFirstTime} selectedLanguage={selectedLanguage} address={address} isConnecting={isConnecting} error={error} />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
        <WalletHeader address={address} balance={balance} isConnecting={isConnecting} onDisconnect={async () => { await disconnectWallet(); setCurrentScreen('auth'); }} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Welcome to HeliosHash DAO</h2>
            <p className="text-blue-200 text-lg mb-2">You are now connected!</p>
            <p className="text-blue-300">Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</p>
            <p className="text-blue-300">Balance: {balance || '0'} ETH</p>
          </div>
        </div>
      </div>
    </>
  );

  // Render based on currentScreen
  if (currentScreen === 'splash') return <SplashScreen />;
  if (currentScreen === 'language') return <LanguageSelectionScreen />;
  if (currentScreen === 'auth') return <AuthScreen />;
  return <DashboardScreen />;
  
};

export default Web3App;
