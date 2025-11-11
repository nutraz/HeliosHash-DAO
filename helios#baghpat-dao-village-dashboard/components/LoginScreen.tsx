
import React from 'react';

interface LoginScreenProps {
  onLogin: () => void;
  isAuthenticating: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isAuthenticating }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-cover bg-center" style={{backgroundImage: "url('https://i.imgur.com/g0L2E8j.jpeg')"}}>
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <div className="p-4 bg-black/30 rounded-full border border-cyan-400/30 shadow-lg shadow-cyan-500/20 mb-6">
            <img src="https://i.imgur.com/g0L2E8j.jpeg" alt="Helios Fire Wheel" className="w-32 h-32 rounded-full object-cover"/>
        </div>
        <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white drop-shadow-lg">
          Helios<span className="text-amber-400">#</span>Baghpat
        </h1>
        <p className="mt-2 text-lg md:text-xl text-cyan-200">The First Solar Village Powered by ICP</p>
        <div className="my-6 w-full max-w-md p-6 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold text-white">NFT-Gated Access</h2>
          <p className="mt-2 text-slate-300">
            This dashboard is exclusively for <span className="font-bold text-cyan-400">One World Project</span> NFT holders. Connect your wallet to verify ownership and enter the DAO Village Hub.
          </p>
          <button
            onClick={onLogin}
            disabled={isAuthenticating}
            className="mt-6 w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-700 text-slate-900 font-bold py-3 px-4 rounded-lg transition duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-wait flex items-center justify-center shadow-lg shadow-cyan-500/50"
          >
            {isAuthenticating ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying OWP NFT...
              </>
            ) : (
              'Connect Wallet to Enter'
            )}
          </button>
        </div>
        <p className="text-sm text-slate-400">From Sunlight to Self-Reliance — Verified on ICP.</p>
      </div>
    </div>
  );
};

export default LoginScreen;
