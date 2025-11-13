'use client'

import React from 'react'
import { useHeliosLiveStats } from '@/lib/api/heliosBaghpat'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

type Props = {
  language?: string
}

export default function UrgamUDashboard({ language = 'en' }: Props) {
  const { user } = useAuth()

  // Energy state — simulate live values for UI/demo purposes. If canister/proxy
  // data is available we map it into these fields below.
  type EnergyStats = {
    solarOutput: string
    batteryLevel: string
    gridUsage: string
    surplus: string
  }

  const [energyStats, setEnergyStats] = React.useState<EnergyStats>({
    solarOutput: '48.2 kW',
    batteryLevel: '87%',
    gridUsage: '2.1 kW',
    surplus: '39.3 kW'
  })

  React.useEffect(() => {
    const t = setInterval(() => {
      setEnergyStats(prev => ({
        ...prev,
        solarOutput: `${(Math.random() * 10 + 45).toFixed(1)} kW`, // fluctuate around 45-55 kW
        batteryLevel: `${Math.floor(Math.random() * 10 + 80)}%`,
        gridUsage: `${(Math.random() * 1 + 1.5).toFixed(1)} kW`
      }))
    }, 4500)
    return () => clearInterval(t)
  }, [])

  // Wire to live canister/proxy stats when available. Use the existing
  // `useHeliosLiveStats` hook which already implements client-side guards,
  // caching and websocket push fallback.
  const { data: live, loading: liveLoading } = useHeliosLiveStats('urgamu-delhi', 10000)

  React.useEffect(() => {
    if (live && !liveLoading) {
      try {
        // solar_kwh is an accumulated kWh (daily or total) — approximate an
        // instantaneous kW by dividing by 24 for a simple UI estimate.
        const approxKW = typeof live.solar_kwh === 'number' ? (live.solar_kwh / 24) : null
        setEnergyStats(prev => ({
          ...prev,
          solarOutput: approxKW ? `${approxKW.toFixed(1)} kW` : prev.solarOutput,
          batteryLevel: prev.batteryLevel,
          gridUsage: prev.gridUsage,
          surplus: approxKW ? `${Math.max(0, (approxKW - 10)).toFixed(1)} kW` : prev.surplus
        }))
      } catch {
        // ignore mapping errors; keep simulated values
      }
    }
  }, [live, liveLoading])

  // Mocked community / compute stats — replace with canister calls via @dfinity/agent
  const stats = {
    currentHashrate: 1.24,
    dailyEnergyProd: 3420,
    members: 1825
  }

  return (
    <div className="min-h-screen p-4">
      <Card className="bg-gradient-to-r from-orange-900/50 to-amber-900/50 backdrop-blur-md rounded-xl border border-orange-500/30 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">⛏️</div>
          <div>
            <h2 className="text-2xl font-bold text-white font-orbitron">UrgamU Delhi Mining Center</h2>
            <p className="text-slate-300 mt-1">Solar-Powered Bitcoin Mining • 3 Acres • 50 kW Capacity</p>
          </div>
        </div>

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

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/30 rounded-xl p-4 text-center">
              <div className="text-5xl mb-2">☀️</div>
              <div className="text-white font-semibold">Solar Panels</div>
              <div className="text-yellow-400 text-2xl font-bold mt-1">50 kW</div>
            </div>

            <div className="bg-gray-900/30 rounded-xl p-4">
              <div className="text-sm text-slate-400">Current Solar Output</div>
              <div className="text-2xl font-bold text-green-400 mt-1">{energyStats.solarOutput}</div>
              <div className="text-xs text-slate-400 mt-1">Battery {energyStats.batteryLevel} • Grid {energyStats.gridUsage}</div>
            </div>

            <div className="bg-gray-900/30 rounded-xl p-4">
              <div className="text-sm text-slate-400">Surplus (to compute)</div>
              <div className="text-2xl font-bold text-cyan-300 mt-1">{energyStats.surplus}</div>
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

          <div className="mt-6 bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Investment Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-slate-400 text-sm">Total CAPEX</div>
                <div className="text-3xl font-bold text-white mt-1">₹65,00,000</div>
                <div className="text-sm text-slate-400">≈ $780,000</div>
              </div>
              <div>
                <div className="text-slate-400 text-sm">Landowner Share (7%)</div>
                <div className="text-3xl font-bold text-amber-400 mt-1">₹2.85 Cr</div>
                <div className="text-sm text-slate-400">Over 10 years</div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-gray-500">Note: This dashboard is a web-friendly implementation of the UrgamU/Helios#Baghpat module. Replace mock data with Motoko canister calls using @dfinity/agent and generated bindings.</p>
        </CardContent>
      </Card>
    </div>
  )
}
