"use client"
import React, { useState } from 'react'

export function InternetIdentityButton() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [principal, setPrincipal] = useState<string | null>(null)

  const handleLogin = async () => {
    // Mock ICP authentication for demo
    setIsAuthenticated(true)
    setPrincipal('plmu2-gt2p5-3b24o-nralm-x6x67-ascob-4eg6j-3a34i-izvcw-6xlfh-tqe')
    import('@/lib/notify').then(({ notify }) => notify.success('🔐 DEMO: Internet Identity login successful!'))
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPrincipal(null)
  }

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated ? (
        <div className="flex items-center space-x-3">
          <span className="text-sm text-green-400">✅ Authenticated</span>
          <span className="text-xs bg-slate-700 px-2 py-1 rounded">{principal?.substring(0, 10)}...</span>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">🔐 Connect Internet Identity</button>
      )}
    </div>
  )
}

export default InternetIdentityButton
