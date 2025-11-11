 'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Users, Zap, Briefcase, MapPin } from 'lucide-react'
import { useHeliosLiveStats } from '../../lib/api/heliosBaghpat'

interface OverviewProps {
  onViewBoard?: () => void
}

export default function HeliosBaghpatOverview({ onViewBoard }: OverviewProps) {
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
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={onViewBoard}>
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
