'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleMockLogin = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock user data (kept for future use) — referenced to avoid unused-var lint
    const mockUser = {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      walletAddress: '0x742d35Cc6634C0532925a3b8D4a2a2a2a2a2a2a2'
    }
    void mockUser
    
    login()
    router.push('/')
  }

  const handleConnectWallet = async () => {
    setIsLoading(true)
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500))
    handleMockLogin()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600 mb-8">Sign in to access your DAO dashboard</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={handleConnectWallet}
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
            </button>
            
            <button onClick={handleMockLogin} className="w-full text-primary hover:text-primary/80 font-medium py-2 transition-colors">Use Demo Account</button>
          </div>
        </div>
      </div>
    </div>
  )
}
