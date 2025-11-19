'use client';

import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/lib/theme'
import { useState, useEffect } from 'react'
import useMockWorker from '@/hooks/useMockWorker'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Start MSW worker in demo mode on client
  useMockWorker()

  if (!mounted) {
    return null // Avoid hydration mismatch
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}