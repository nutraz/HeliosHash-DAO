"use client"

import { useState, useCallback, useEffect } from 'react'
import AshokaChakraEntry from '@/components/splash/AshokaChakraEntry'
import AuthSelection from '@/components/auth/AuthSelection'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

type Stage = 'splash' | 'auth'

export default function Home() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  
  // Allow skipping the splash in dev via env or query param
  const skipSplashEnv = process.env.NEXT_PUBLIC_DISABLE_SPLASH === 'true'
  const [stage, setStage] = useState<Stage>(skipSplashEnv ? 'auth' : 'splash')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  // Check query param on the client only (avoid useSearchParams during prerender)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        if (params.get('skipSplash') === '1') setStage('auth')
      }
    } catch (_e) {
      void _e
    }
  }, [])

  const handleSplashComplete = useCallback(() => {
    setStage('auth')
  }, [])

  const handleAuthenticated = useCallback(() => {
    router.push('/dashboard')
  }, [router])

  if (stage === 'splash') {
    return <AshokaChakraEntry onComplete={handleSplashComplete} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <AuthSelection onAuthenticated={handleAuthenticated} />
    </div>
  )
}
