'use client'

import Dashboard from '@/components/dashboard/Dashboard'
import { useState } from 'react'

export default function HeliosHashDAO() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-emerald-300">HeliosHash DAO</h1>
            <p className="text-slate-400 text-sm">Community Dashboard</p>
          </div>
          <div>
            <button onClick={() => setIsConnected(!isConnected)} className="bg-emerald-500 px-4 py-2 rounded-md font-semibold text-slate-900">
              {isConnected ? 'Connected' : 'Connect Wallet'}
            </button>
          </div>
        </div>
      </header>

      <main>
        <Dashboard />
      </main>
    </div>
  )
}
