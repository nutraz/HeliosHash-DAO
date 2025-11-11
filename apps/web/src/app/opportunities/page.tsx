'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import OpportunitiesHub from '@/components/project/opportunities/OpportunitiesHub'

export default function OpportunitiesPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  // Use 'language' only if present in user, else default to 'en'
  const language = (user as any)?.language || 'en'

  return <OpportunitiesHub user={user} language={language} />
}
