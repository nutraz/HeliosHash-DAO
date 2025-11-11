"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import MainDashboard from '@/components/dashboard/MainDashboard'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardRoutePage() {
  const router = useRouter()
  const { isAuthenticated, user, logout } = useAuth()

  const handleNavigate = (view: string) => {
    // map internal dashboard actions to routes
    if (view === 'projects') return router.push('/projects')
    if (view === 'map') return router.push('/projects')
    if (view === 'settings') return router.push('/settings')
    if (view === 'rewards') return router.push('/rewards')
    if (view === 'exchange') return router.push('/exchange')
    if (view === 'community') return router.push('/community')
    if (view === 'opportunities') return router.push('/opportunities')
    if (view === 'nfts') return router.push('/nfts')
    if (view?.startsWith('nft/')) return router.push(`/nfts/${view.split('/')[1]}`)
    if (['send','receive','stake','withdraw'].includes(view)) return router.push(`/${view}`)
    return router.push('/')
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-lg text-center p-8 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Not signed in</h2>
          <p className="text-gray-600 mb-6">You need to sign in or connect a wallet to view your dashboard.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => router.push('/login')} className="bg-blue-600 text-white px-4 py-2 rounded">Sign In</button>
            <button onClick={() => router.push('/login')} className="bg-green-600 text-white px-4 py-2 rounded">Connect Wallet</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <MainDashboard user={user || { language: 'en' }} onNavigate={handleNavigate} onLogout={handleLogout} />
    </div>
  )
}
