'use client'

import { useState, useCallback } from 'react'
import AshokChakraEntry from '@/components/entry/AshokChakraEntry'
import AuthSelection from '@/components/auth/AuthSelection'
import RoleSelection from '@/components/onboarding/RoleSelection'
import MainDashboard from '@/components/dashboard/MainDashboard'
import ProjectMap from '@/components/projects/ProjectMap'
import RewardsHub from '@/components/rewards/RewardsHub'
import TokenExchangeHub from '@/components/exchange/TokenExchangeHub'
import Link from 'next/link'

type AppStage = 'entry' | 'auth' | 'role' | 'dashboard' | 'map' | 'project' | 'community' | 'rewards' | 'exchange' | 'documents'

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
    const validStages: AppStage[] = ['dashboard', 'map', 'project', 'community', 'rewards', 'exchange', 'documents']

    let targetStage: AppStage = 'dashboard'

    if (view === 'opportunities') {
      targetStage = 'rewards'
    } else if (validStages.includes(view as AppStage)) {
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
        <AshokChakraEntry onComplete={handleEntryComplete} />
      )}
      
      {stage === 'auth' && (
        <AuthSelection onAuthenticated={handleAuthenticated} />
      )}
      
      {stage === 'role' && (
        <RoleSelection user={userData} onRoleSelected={handleRoleSelected} />
      )}
      
      {stage === 'dashboard' && (
        <div className="px-4 py-6">
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
