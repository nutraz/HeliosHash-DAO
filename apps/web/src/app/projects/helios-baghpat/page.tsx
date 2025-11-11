 'use client'

import React, { useState } from 'react'
import CommunityHub from '@/components/project/community/CommunityHub'
import OpportunitiesHub from '@/components/project/opportunities/OpportunitiesHub'
import { useHeliosLiveStats } from '@/lib/api/heliosBaghpat'
import HeliosBaghpatOverview from '@/components/project/HeliosBaghpatOverview'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, Users, Zap, MapPin } from 'lucide-react'

export default function HeliosBaghpatProject() {
  const tabs = ['overview', 'community-hub', 'opportunities'] as const
  const [active, setActive] = useState<typeof tabs[number]>('overview')

  const OverviewTab = () => {
    const { data, loading } = useHeliosLiveStats('helios-baghpat', 10_000)

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-900 to-blue-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" /> Live Yield
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-green-300">
                  <span>Solar Today</span>
                  <span>{loading || !data ? '—' : `${data.solar_kwh} kWh`}</span>
                </div>
                <div className="flex justify-between text-blue-300">
                  <span>BTC Mined</span>
                  <span>{loading || !data ? '—' : `${data.btc_mined} BTC`}</span>
                </div>
                <div className="flex justify-between text-amber-300">
                  <span>Turmeric Growth</span>
                  <span>{loading || !data ? '—' : `${data.crop_yield_percent}% Ready`}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" /> Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">{loading || !data ? '—' : `${data.members} Members • 89 Active Today`}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5" /> Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm">24 Active • 3 Urgent</p>
              <div className="mt-3">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setActive('opportunities')}>
                  <MapPin className="w-4 h-4 mr-2" /> View Board
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white">About Helios#Baghpat</h3>
          <p className="text-gray-300 mt-2">Solar-powered bitcoin mining and agrivoltaics DAO operating in the Baghpat region. 1WP structured, ICP-backed canister storage, live IoT feed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-blue-800 to-green-800 rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Helios#Baghpat</h1>
            <p className="text-xl text-blue-100 mb-6">Solar-Powered Bitcoin Mining + Agrivoltaics DAO</p>
            <div className="flex flex-wrap gap-3">
              <Badge>LIVE</Badge>
              <Badge variant="secondary">1WP DAO</Badge>
              <Badge variant="outline">ICP dApp</Badge>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 w-full bg-gray-800 p-2 rounded-lg">
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${active === t ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                {t === 'overview' && 'Overview'}
                {t === 'community-hub' && 'Community Hub'}
                {t === 'opportunities' && 'Opportunities'}
              </button>
            ))}
          </div>
        </div>

        <div>
          {active === 'overview' && <HeliosBaghpatOverview onViewBoard={() => setActive('opportunities')} />}
          {active === 'community-hub' && <CommunityHub user={{}} language="en" />}
          {active === 'opportunities' && <OpportunitiesHub user={{}} language="en" />}
        </div>
      </div>
    </div>
  )
}
