'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import CommunityHub from '@/components/project/community/CommunityHub'

export default function CommunityPage() {
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
  const language = typeof (user as any)?.language === 'string' ? (user as any).language : 'en'

  return <CommunityHub user={user} language={language} />
}
