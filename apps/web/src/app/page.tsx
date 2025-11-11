"use client"

import { useState, useCallback, useEffect } from 'react'
import OWPAnimation from '@/components/entry/OWPAnimation'
import AuthSelection from '@/components/auth/AuthSelection'
import { useRouter } from 'next/navigation'

type Stage = 'splash' | 'auth'

export default function Home() {
  // Allow skipping the splash in dev via env or query param
  const skipSplashEnv = process.env.NEXT_PUBLIC_DISABLE_SPLASH === 'true'
  const [stage, setStage] = useState<Stage>(skipSplashEnv ? 'auth' : 'splash')

  // Check query param on the client only (avoid useSearchParams during prerender)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        if (params.get('skipSplash') === '1') setStage('auth')
      }
    } catch (e) {
      // ignore
    }
  }, [])
  const router = useRouter()

  const handleSplashComplete = useCallback(() => {
    setStage('auth')
  }, [])

  const handleAuthenticated = useCallback((authData: any) => {
    // Redirect to dashboard after auth
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
