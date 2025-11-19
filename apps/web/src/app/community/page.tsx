<<<<<<< HEAD
"use client"

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
  type MaybeUser = { language?: string }
  const language = user && typeof (user as MaybeUser).language === 'string' ? (user as MaybeUser).language : 'en'

  return <CommunityHub user={user || undefined} language={language} />
=======
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CommunityRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/social/communities');
  }, [router]);
  return (
    <div className="p-6">
      <p>Redirecting to communities…</p>
    </div>
  );
>>>>>>> 954253d5 (docs: refresh and clean up all documentation (README, repo summary, critical fixes, copilot context))
}
