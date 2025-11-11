'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase, MapPin, Calendar, Users, Zap,
  Wrench, HardHat, Package, TrendingUp, Clock
} from 'lucide-react'

interface OpportunitiesHubProps {
  user: any
  language?: string
}

const opportunities = [
  {
    id: 1,
    type: 'contractor',
    title: 'Solar Installation - Baghpat Village Grid',
    titleHi: 'सौर स्थापना - बघपत ग्राम ग्रिड',
    location: 'Baghpat, Uttar Pradesh',
    locationHi: 'बघपत, उत्तर प्रदेश',
    budget: '₹12,50,000',
    deadline: '45 days',
    deadlineHi: '45 दिन',
    capacity: '100 kW',
    status: 'open',
    bids: 12,
    icon: Wrench,
    color: 'orange'
  },
  {
    id: 2,
    type: 'engineer',
    title: 'Site Inspection & Certification',
    titleHi: 'साइट निरीक्षण और प्रमाणन',
    location: 'UrgamU Delhi NCR',
    locationHi: 'उरगमू दिल्ली एनसीआर',
    budget: '₹85,000',
    deadline: '7 days',
    deadlineHi: '7 दिन',
    capacity: '50 kW',
    status: 'urgent',
    bids: 3,
    icon: Zap,
    color: 'blue'
  },
  {
    id: 3,
    type: 'labour',
    title: 'Panel Installation Team (5 workers)',
    titleHi: 'पैनल स्थापना टीम (5 कर्मचारी)',
    location: 'Baghpat, UP',
    locationHi: 'बघपत, यूपी',
    budget: '₹450/day per person',
    deadline: '30 days',
    deadlineHi: '30 दिन',
    capacity: '75 kW',
    status: 'open',
    bids: 8,
    icon: HardHat,
    color: 'yellow'
  },
  {
    id: 4,
    type: 'equipment',
    title: 'Solar Panels (Tier 1) Supply',
    titleHi: 'सौर पैनल (टियर 1) आपूर्ति',
    location: 'Delhi warehouse delivery',
    locationHi: 'दिल्ली वेयरहाउस डिलीवरी',
    budget: '₹8,75,000',
    deadline: '15 days',
    deadlineHi: '15 दिन',
    capacity: '150 kW worth',
    status: 'open',
    bids: 5,
    icon: Package,
    color: 'indigo'
  },
  {
    id: 5,
    type: 'landowner',
    title: 'Land Available for Solar Project',
    titleHi: 'सौर परियोजना के लिए भूमि उपलब्ध',
    location: 'Village near Baghpat',
    locationHi: 'बघपत के पास गांव',
    budget: '20% revenue share',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    capacity: '2 acres / 200 kW potential',
    status: 'featured',
    bids: 15,
    icon: MapPin,
    color: 'green'
  },
  {
    id: 6,
    type: 'node-operator',
    title: 'Run Validator Node - Earn HHU',
    titleHi: 'वैलिडेटर नोड चलाएं - HHU कमाएं',
    location: 'Remote (Internet Computer)',
    locationHi: 'दूरस्थ (इंटरनेट कंप्यूटर)',
    budget: '500-2000 HHU/month',
    deadline: 'Ongoing',
    deadlineHi: 'चालू',
    capacity: 'Min 8GB RAM, 100GB storage',
    status: 'open',
    bids: 24,
    icon: TrendingUp,
    color: 'purple'
  }
]

export default function OpportunitiesHub({ user, language = 'en' }: OpportunitiesHubProps) {
  const [filter, setFilter] = useState<string>('all')

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: 'Open', labelHi: 'खुला', variant: 'default' as const },
      urgent: { label: 'Urgent', labelHi: 'तत्काल', variant: 'destructive' as const },
      featured: { label: 'Featured', labelHi: 'विशेष रुप से प्रदर्शित', variant: 'secondary' as const }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <Badge variant={config.variant}>
        {language === 'en' ? config.label : config.labelHi}
      </Badge>
    )
  }

  const getColorClasses = (color: string) => {
    const colors = {
      orange: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500',
      blue: 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500',
      yellow: 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500',
      indigo: 'bg-indigo-500/10 border-indigo-500/30 hover:border-indigo-500',
      green: 'bg-green-500/10 border-green-500/30 hover:border-green-500',
      purple: 'bg-purple-500/10 border-purple-500/30 hover:border-purple-500'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const filteredOpportunities = filter === 'all'
    ? opportunities
    : opportunities.filter(opp => opp.type === filter)

  const filters = [
    { id: 'all', label: 'All Opportunities', labelHi: 'सभी अवसर' },
    { id: 'contractor', label: 'Contractors', labelHi: 'ठेकेदार' },
    { id: 'engineer', label: 'Engineers', labelHi: 'इंजीनियर' },
    { id: 'labour', label: 'Labour', labelHi: 'श्रमिक' },
    { id: 'equipment', label: 'Equipment', labelHi: 'उपकरण' },
    { id: 'landowner', label: 'Landowners', labelHi: 'भूमि स्वामी' },
    { id: 'node-operator', label: 'Node Operators', labelHi: 'नोड संचालक' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {language === 'en' ? 'Opportunities' : 'अवसर'}
          </h1>
          <p className="text-gray-400">
            {language === 'en'
              ? 'Find work, bid on projects, or offer your services'
              : 'काम खोजें, परियोजनाओं पर बोली लगाएं, या अपनी सेवाएं प्रदान करें'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filters.map(f => (
            <Button
              key={f.id}
              variant={filter === f.id ? 'default' : 'outline'}
              onClick={() => setFilter(f.id)}
              className={filter === f.id ? '' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
            >
              {language === 'en' ? f.label : f.labelHi}
            </Button>
          ))}
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOpportunities.map(opp => {
            const Icon = opp.icon
            return (
              <Card
                key={opp.id}
                className={`bg-gray-800/50 border-2 transition-all cursor-pointer ${getColorClasses(opp.color)}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-3 rounded-xl bg-${opp.color}-500/20`}>
                        <Icon className={`w-6 h-6 text-${opp.color}-400`} />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg mb-1">
                          {language === 'en' ? opp.title : opp.titleHi}
                        </CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{language === 'en' ? opp.location : opp.locationHi}</span>
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(opp.status)}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Budget' : 'बजट'}
                        </p>
                        <p className="text-white font-bold">{opp.budget}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {language === 'en' ? 'Deadline' : 'समय सीमा'}
                        </p>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <p className="text-white font-bold">
                            {language === 'en' ? opp.deadline : opp.deadlineHi}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {language === 'en' ? 'Capacity/Details' : 'क्षमता/विवरण'}
                      </p>
                      <p className="text-gray-300 text-sm">{opp.capacity}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>
                          {language === 'en'
                            ? `${opp.bids} bids`
                            : `${opp.bids} बोलियाँ`}
                        </span>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        {language === 'en' ? 'View Details' : 'विवरण देखें'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Stats Footer */}
        <Card className="bg-gradient-to-r from-purple-900 to-blue-900 border-purple-700 mt-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-white">156</p>
                <p className="text-gray-300 text-sm">
                  {language === 'en' ? 'Active Opportunities' : 'सक्रिय अवसर'}
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">₹4.2Cr</p>
                <p className="text-gray-300 text-sm">
                  {language === 'en' ? 'Total Project Value' : 'कुल परियोजना मूल्य'}
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">892</p>
                <p className="text-gray-300 text-sm">
                  {language === 'en' ? 'Registered Workers' : 'पंजीकृत कर्मचारी'}
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">45</p>
                <p className="text-gray-300 text-sm">
                  {language === 'en' ? 'Projects Completed' : 'पूर्ण परियोजनाएं'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
