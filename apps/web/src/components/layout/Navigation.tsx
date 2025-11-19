"use client"

import { useAuth } from '@/contexts/AuthContext'

export function Navigation() {
  const { isConnected, walletType, principal } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-900">HeliosHash DAO</h1>
            
            {isConnected && (
              <div className="flex gap-6 text-sm">
                <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                <a href="/proposals" className="text-gray-600 hover:text-gray-900">Proposals</a>
                <a href="/treasury" className="text-gray-600 hover:text-gray-900">Treasury</a>
                <a href="/members" className="text-gray-600 hover:text-gray-900">Members</a>
              </div>
            )}
          </div>

          {isConnected && (
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                {walletType}
              </span>
              <span className="text-gray-600 font-mono">
                {principal?.slice(0, 8)}...
              </span>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
