'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

type Props = {
  language?: string
}

export default function UrgamUDashboard({ language = 'en' }: Props) {
  const { user } = useAuth()

  // Mocked stats — replace with canister calls via @dfinity/agent
  const stats = {
    currentHashrate: 1.24,
    dailyEnergyProd: 3420,
    members: 1825,
  }

  return (
    <div className="min-h-screen p-4">
      <Card className="bg-gradient-to-r from-orange-900 to-red-900 border-orange-700">
        <CardHeader>
          <CardTitle className="text-white">
            {language === 'en' ? 'Helios#Baghpat (UrgamU Delhi)' : 'हेलिओस#बघपत (उरगमू दिल्ली)'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-white text-2xl">{stats.currentHashrate} TH/s</p>
              <p className="text-gray-300">{language === 'en' ? 'Hashrate' : 'हैशरेट'}</p>
            </div>
            <div>
              <p className="text-white text-2xl">{stats.dailyEnergyProd} kWh</p>
              <p className="text-gray-300">{language === 'en' ? 'Daily Energy' : 'दैनिक ऊर्जा'}</p>
            </div>
            <div>
              <p className="text-white text-2xl">{stats.members}</p>
              <p className="text-gray-300">{language === 'en' ? 'Members' : 'सदस्य'}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button onClick={() => window.location.href = '/urgamu-delhi/jobs'}>
              {language === 'en' ? 'Jobs & Social' : 'नौकरियाँ और सोशल'}
            </Button>
            <Button onClick={() => window.location.href = '/urgamu-delhi/governance'}>
              {language === 'en' ? 'Governance' : 'शासन'}
            </Button>
            <Button onClick={() => window.location.href = '/urgamu-delhi/disputes'}>
              {language === 'en' ? 'Disputes' : 'विवाद'}
            </Button>
          </div>

          {user && user.principal && (
            <div className="mt-4 text-sm text-gray-400">{language === 'en' ? `Signed in as ${user.name || user.principal}` : `साइन इन: ${user.name || user.principal}`}</div>
          )}

          <p className="mt-4 text-xs text-gray-500">Note: This dashboard is a web-friendly implementation of the UrgamU/Helios#Baghpat module. Replace mock data with Motoko canister calls using @dfinity/agent and generated bindings.</p>
        </CardContent>
      </Card>
    </div>
  )
}
