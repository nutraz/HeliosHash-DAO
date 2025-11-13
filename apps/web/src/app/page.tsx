"use client"

import { useState, useCallback, useEffect } from 'react'
import OWPAnimation from '@/components/entry/OWPAnimation'
import AuthSelection from '@/components/auth/AuthSelection'
import { useRouter } from 'next/navigation'
import { useHHDAO } from '@/hooks/useHHDAO'
// removed unused icons: CheckCircle, Wifi, WifiOff

type Stage = 'splash' | 'auth'

export default function Home() {
  // Allow skipping the splash in dev via env or query param
  const skipSplashEnv = process.env.NEXT_PUBLIC_DISABLE_SPLASH === 'true'
  const [stage, setStage] = useState<Stage>(skipSplashEnv ? 'auth' : 'splash')
  const { loading, error } = useHHDAO()

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
  const router = useRouter()

  const handleSplashComplete = useCallback(() => {
    setStage('auth')
  }, [])

  // reference loading/error here to avoid unused-var in this file
  void loading
  void error

  const handleAuthenticated = useCallback((authData: unknown) => {
    // Redirect to dashboard after auth. Narrow unknown to avoid `any`.
    try {
      if (authData && typeof authData === 'object') {
        // no-op: future use of authData can be safely narrowed here
      }
    } catch {
      // ignore
    }
    router.push('/dashboard')
  }, [router])

  if (stage === 'splash') {
    return <OWPAnimation onComplete={handleSplashComplete} />
  }

  if (stage === 'auth') {
    return <AuthSelection onAuthenticated={handleAuthenticated} />
  }

  return null
}
