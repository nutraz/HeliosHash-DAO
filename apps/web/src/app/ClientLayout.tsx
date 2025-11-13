'use client';

import { MockAuthProvider } from '@/components/auth/mock/MockAuthContext'
import { useState, useEffect } from 'react'
import AshokaChakraEntry from '@/components/splash/AshokaChakraEntry'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showSplash, setShowSplash] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null // Avoid hydration mismatch
  }

  return (
    <MockAuthProvider>
      {showSplash && (
        <AshokaChakraEntry onComplete={() => setShowSplash(false)} />
      )}
      {!showSplash && children}
    </MockAuthProvider>
  )
}