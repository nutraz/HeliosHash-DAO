'use client'

import React from 'react'
import UrgamUDashboard from '@/modules/UrgamUDelhi/UrgamUDashboard'
import JobSocialHub from '@/modules/UrgamUDelhi/JobSocialHub'
import Governance from '@/modules/UrgamUDelhi/Governance'
import DisputeResolution from '@/modules/UrgamUDelhi/DisputeResolution'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function UrgamUPage() {
  const [view, setView] = useState<'dashboard' | 'jobs' | 'governance' | 'disputes'>('dashboard')
  const language = 'en'

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Helios#Baghpat — UrgamU Delhi</h1>
        <div className="flex gap-2">
          <Button onClick={() => setView('dashboard')}>Dashboard</Button>
          <Button onClick={() => setView('jobs')}>Jobs & Social</Button>
          <Button onClick={() => setView('governance')}>Governance</Button>
          <Button onClick={() => setView('disputes')}>Disputes</Button>
        </div>
      </div>

      <div>
        {view === 'dashboard' && <UrgamUDashboard language={language} />}
        {view === 'jobs' && <JobSocialHub language={language} />}
        {view === 'governance' && <Governance language={language} />}
        {view === 'disputes' && <DisputeResolution language={language} />}
      </div>

      <p className="mt-6 text-xs text-gray-500">This module is a web-compatible implementation; for React Native + Expo target create equivalent screens in the mobile app and wire Motoko canister calls using @dfinity/agent.</p>
    </div>
  )
}
