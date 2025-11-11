'use client'

import { useState, useCallback } from 'react'
import HhdaoSplash from '@/components/HhdaoSplash'
import AuthSelection from '@/components/auth/AuthSelection'
import RoleSelection from '@/components/onboarding/RoleSelection'
import MainDashboard from '@/components/dashboard/MainDashboard'
import ProjectMap from '@/components/projects/ProjectMap'
import RewardsHub from '@/components/rewards/RewardsHub'
import TokenExchangeHub from '@/components/exchange/TokenExchangeHub'
import Link from 'next/link'

type AppStage = 'entry' | 'auth' | 'role' | 'dashboard' | 'map' | 'project' | 'community' | 'rewards' | 'exchange' | 'documents' | 'settings' | 'send' | 'receive' | 'stake' | 'withdraw' | 'nfts' | `nft/${string}`

interface UserData {
  authMethod?: string
  phone?: string
  walletType?: string
  verified?: boolean
  language: string
  role?: string
  roleLabel?: string
  roleLabelHi?: string
  kycRequired?: boolean
  name?: string
}

interface AuthData {
  authMethod: string
  phone?: string
  walletType?: string
  verified: boolean
}

interface RoleData {
  role: string
  roleLabel: string
  roleLabelHi?: string
  kycRequired: boolean
}

interface DashboardMetrics {
  activeProposals: number
  totalVotes: number
  treasury: string
}

export default function HomePage() {
  const [stage, setStage] = useState<AppStage>('entry')
  const [userData, setUserData] = useState<UserData>({
    language: 'en'
  })

  // Mock data - should come from API/blockchain
  const dashboardMetrics: DashboardMetrics = {
    activeProposals: 0,
    totalVotes: 38000,
    treasury: '500K'
  }

  const handleEntryComplete = useCallback(() => {
    setStage('auth')
  }, [])

  const handleAuthenticated = useCallback((authData: AuthData) => {
    // Validate authData before updating state
    if (!authData.authMethod) {
      console.error('Invalid auth data: missing authMethod')
      return
    }

    setUserData(prev => ({
      ...prev,
      ...authData
    }))
    setStage('role')
  }, [])

  const handleRoleSelected = useCallback((roleData: RoleData) => {
    // Validate roleData
    if (!roleData.role || !roleData.roleLabel) {
      console.error('Invalid role data')
      return
    }

    setUserData(prev => ({
      ...prev,
      ...roleData,
      name: prev.phone ? `User_${prev.phone.slice(-4)}` : 'User'
    }))
    setStage('dashboard')
  }, [])

  const handleNavigate = useCallback((view: string, data?: string) => {
    // Expand navigation to include settings and wallet flows
    const validStages: string[] = [
      'dashboard', 'map', 'project', 'community', 'rewards', 'exchange', 'documents',
      'settings', 'send', 'receive', 'stake', 'withdraw', 'nfts'
    ]

    let targetStage: AppStage = 'dashboard'

    if (view === 'opportunities') {
      targetStage = 'rewards'
    } else if (view?.startsWith('nft/')) {
      targetStage = view as AppStage
    } else if (validStages.includes(view)) {
      targetStage = view as AppStage
    }

    setStage(targetStage)
  }, [])

  const handleLogout = useCallback(() => {
    setUserData({ language: 'en' })
    setStage('auth')
  }, [])

  // Component render methods for better organization
  const renderDashboardMetrics = () => (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">DAO Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Active Proposals</h3>
          <p className="text-3xl font-bold">{dashboardMetrics.activeProposals}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Total Votes</h3>
          <p className="text-3xl font-bold">{dashboardMetrics.totalVotes.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Treasury</h3>
          <p className="text-3xl font-bold">{dashboardMetrics.treasury}</p>
        </div>
      </div>
    </div>
  )

  const renderQuickActions = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Link href="/projects" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-blue-600">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Manage Projects</h3>
        <p className="text-gray-600 mb-4">View and manage all DAO projects and initiatives</p>
        <div className="text-blue-600 font-semibold">View Projects →</div>
      </Link>

      <Link href="/projects/create" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-indigo-600">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Create Project</h3>
        <p className="text-gray-600 mb-4">Submit a new project proposal for DAO funding</p>
        <div className="text-indigo-600 font-semibold">Get Started →</div>
      </Link>
    </div>
  )

  return (
    <div className="min-h-screen">
      {stage === 'entry' && (
        <HhdaoSplash onComplete={handleEntryComplete} />
      )}

      {stage === 'auth' && (
        <AuthSelection onAuthenticated={handleAuthenticated} />
      )}

      {stage === 'role' && (
        <RoleSelection user={userData} onRoleSelected={handleRoleSelected} />
      )}

      {stage === 'dashboard' && (
        <div className="px-4 py-6 relative">
          {/* Logo on top-right of dashboard */}
          <img src="/hhdaologo.svg" alt="HHDAO logo" className="absolute top-4 right-4 w-12 h-12 object-contain" />

          {renderQuickActions()}
          {renderDashboardMetrics()}
          <MainDashboard
            user={userData}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        </div>
      )}

      {stage === 'map' && (
        <ProjectMap
          user={userData}
          onNavigate={handleNavigate}
        />
      )}

      {stage === 'rewards' && (
        <RewardsHub
          user={userData}
          onNavigate={handleNavigate}
        />
      )}

      {stage === 'exchange' && (
        <TokenExchangeHub
          userBalance={(userData as any).tokenBalance || 2450} // Should come from user data
          onNavigate={handleNavigate}
        />
      )}

      {stage === 'settings' && (
        <div className="p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Settings</h2>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <p><strong>Language:</strong> {userData.language}</p>
            <p><strong>Auth Method:</strong> {(userData as any).authMethod || 'N/A'}</p>
            <p><strong>Phone:</strong> {userData.phone || 'N/A'}</p>
            <div className="flex space-x-2 mt-4">
              <button onClick={() => handleNavigate('dashboard')} className="bg-blue-600 text-white px-4 py-2 rounded">Back</button>
            </div>
          </div>
        </div>
      )}

      {stage === 'send' && (
        <div className="p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Send Tokens</h2>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700">Recipient</label>
            <input className="w-full border rounded px-3 py-2" placeholder="Enter wallet or phone" />
            <label className="block text-sm font-medium text-gray-700">Amount (HHU)</label>
            <input className="w-full border rounded px-3 py-2" placeholder="0" />
            <div className="flex space-x-2">
              <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => handleNavigate('dashboard')}>Send</button>
              <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => handleNavigate('dashboard')}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {stage === 'receive' && (
        <div className="p-8 max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Receive Tokens</h2>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <p className="text-sm text-gray-600">Share this address or QR to receive HHU</p>
            <div className="bg-gray-100 p-6 rounded">
              <p className="font-mono">hhdao:wallet:0xDEADBEEF...CAF3</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleNavigate('dashboard')}>Back</button>
          </div>
        </div>
      )}

      {stage === 'stake' && (
        <div className="p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Stake Tokens</h2>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700">Amount to stake</label>
            <input className="w-full border rounded px-3 py-2" placeholder="0" />
            <div className="flex space-x-2">
              <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={() => handleNavigate('dashboard')}>Stake</button>
              <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => handleNavigate('dashboard')}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {stage === 'withdraw' && (
        <div className="p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Withdraw Tokens</h2>
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <label className="block text-sm font-medium text-gray-700">Amount to withdraw</label>
            <input className="w-full border rounded px-3 py-2" placeholder="0" />
            <div className="flex space-x-2">
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => handleNavigate('dashboard')}>Withdraw</button>
              <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => handleNavigate('dashboard')}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {stage === 'nfts' && (
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Your NFTs</h2>
          <div className="bg-white rounded-lg shadow p-6">Coming soon: full NFT gallery with transfer and marketplace links.</div>
          <div className="mt-4">
            <button onClick={() => handleNavigate('dashboard')} className="bg-blue-600 text-white px-4 py-2 rounded">Back</button>
          </div>
        </div>
      )}

      {typeof stage === 'string' && stage.startsWith('nft/') && (
        <div className="p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">NFT Detail</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <p>ID: {stage.split('/')[1]}</p>
            <p className="text-gray-600">Detailed NFT view and actions (transfer, list) will be available here.</p>
            <div className="mt-4">
              <button onClick={() => handleNavigate('nfts')} className="bg-blue-600 text-white px-4 py-2 rounded">Back to NFTs</button>
            </div>
          </div>
        </div>
      )}

      {stage === 'community' && (
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Community Hub</h2>
          <div className="bg-white rounded-lg shadow p-6">Community features, forums, and governance tools will be available here.</div>
          <div className="mt-4">
            <button onClick={() => handleNavigate('dashboard')} className="bg-blue-600 text-white px-4 py-2 rounded">Back</button>
          </div>
        </div>
      )}

      {/* TODO: Implement missing stages */}
      {(stage === 'project' || stage === 'community' || stage === 'documents') && (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="text-gray-600 mb-4">This section is under development.</p>
          <button
            onClick={() => handleNavigate('dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  )
}
