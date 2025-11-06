"use client"

import { useAuth } from '@/contexts/AuthContext'

export function WalletConnect() {
  const { isConnected, walletType, principal, connect, disconnect } = useAuth()

  if (isConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="text-center">
          <div className="text-green-600 text-2xl mb-2">✅</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Connected to {walletType}
          </h3>
          <p className="text-green-700 text-sm mb-4 font-mono">
            Principal: {principal?.slice(0, 10)}...
          </p>
          <button 
            onClick={disconnect}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        Connect Your Wallet
      </h3>
      
      <button 
        onClick={() => connect('Internet Identity')}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-3"
      >
        <span className="text-xl">🌐</span>
        Internet Identity
      </button>
      
      <button 
        onClick={() => connect('MetaMask')}
        className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-3"
      >
        <span className="text-xl">🦊</span>
        MetaMask
      </button>
      
      <button 
        onClick={() => connect('Plug Wallet')}
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-3"
      >
        <span className="text-xl">🔌</span>
        Plug Wallet
      </button>

      <div className="text-center text-sm text-gray-500 mt-4">
        Choose your preferred wallet to access the DAO
      </div>
    </div>
  )
}
