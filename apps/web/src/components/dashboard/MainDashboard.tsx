'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Wallet, Award, TrendingUp, Map,
  Users, Gift, FileText, Settings, LogOut,
  Send, ArrowDownToLine, Lock, Zap, Globe, Briefcase,
  Loader2, AlertCircle
} from 'lucide-react'
import { useHHDAO } from '@/hooks/useHHDAO'

interface UserProfileLocal {
  name?: string;
  language?: string;
  roleLabel?: string;
  roleLabelHi?: string;
}

interface MainDashboardProps {
  user: UserProfileLocal
  onNavigate: (view: string) => void
  onLogout: () => void
}

export default function MainDashboard({ user, onNavigate, onLogout }: MainDashboardProps) {
  const [showSendTokens, setShowSendTokens] = useState(false)
  const { dashboardData, projects, loading, error, refetch } = useHHDAO()
  const language = user.language || 'en'

  // Real data from IC canister
  const userData = {
    name: dashboardData?.userProfile?.[0]?.displayName || dashboardData?.userProfile?.[0]?.username || user.name || 'User',
    role: user.roleLabel || 'Member',
    roleHi: user.roleLabelHi || 'सदस्य',
    rank: 'Bronze', // TODO: Calculate from canister data
    hhuBalance: 2450, // TODO: Get from canister
    nfts: dashboardData?.documents?.filter(doc => doc.documentType === 'Image') || [],
    stats: {
      projectsStarted: projects?.length || 0,
      projectsHelped: 7, // TODO: Calculate from canister
      membersAdded: 12, // TODO: Calculate from canister
      energyGenerated: '45.3 MWh', // TODO: Get from devices
      co2Saved: '32.1 tons', // TODO: Calculate from energy
      tokensEarned: 2450 // TODO: Get from canister
    }
  }

  const quickActions = [
    { 
      id: 'villages', 
      label: 'Villages',
      labelHi: 'गांव',
      icon: Map,
      color: 'bg-cyan-600 hover:bg-cyan-700'
    },
    { 
      id: 'map', 
      label: 'Project Map', 
      labelHi: 'परियोजना मानचित्र',
      icon: Map, 
      color: 'bg-blue-600 hover:bg-blue-700' 
    },
    { 
      id: 'community', 
      label: 'Community', 
      labelHi: 'समुदाय',
      icon: Users, 
      color: 'bg-purple-600 hover:bg-purple-700' 
    },
    { 
      id: 'rewards', 
      label: 'Rewards', 
      labelHi: 'पुरस्कार',
      icon: Gift, 
      color: 'bg-green-600 hover:bg-green-700' 
    },
    {
      id: 'nft-gallery',
      label: 'NFT Gallery',
      labelHi: 'NFT गैलरी',
      icon: Gift,
      color: 'bg-pink-600 hover:bg-pink-700'
    },
    { 
      id: 'opportunities', 
      label: 'Opportunities', 
      labelHi: 'अवसर',
      icon: Briefcase, 
      color: 'bg-amber-600 hover:bg-amber-700' 
    },
    { 
      id: 'documents', 
      label: 'Documents', 
      labelHi: 'दस्तावेज़',
      icon: FileText, 
      color: 'bg-orange-600 hover:bg-orange-700' 
    }
  ]

    const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'green': return 'bg-green-500'
      case 'yellow': return 'bg-yellow-500'
      case 'orange': return 'bg-orange-500'
      case 'blue': return 'bg-blue-500'
      case 'grey': return 'bg-gray-500'
      default: return 'bg-purple-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white text-lg">Loading dashboard data from blockchain...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <Button onClick={refetch} className="bg-blue-600 hover:bg-blue-700">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {language === 'en' 
                ? `Welcome, ${userData.name}` 
                : `स्वागत है, ${userData.name}`}
            </h1>
            <div className="flex items-center space-x-3">
              <span className="text-gray-400">
                {language === 'en' ? userData.role : userData.roleHi}
              </span>
              <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full">
                {userData.rank}
              </span>
              <div className="flex items-center space-x-1 px-2 py-1 bg-green-600/20 border border-green-500/30 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">Live on ICP</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
              onClick={() => onNavigate('settings')}
            >
              <Settings className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Settings' : 'सेटिंग्स'}
            </Button>
            <Button 
              variant="outline" 
              className="border-red-600 text-red-400 hover:bg-red-950"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Logout' : 'लॉगआउट'}
            </Button>
          </div>
        </div>

        {/* HHU Token Wallet */}
        <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span>{language === 'en' ? 'HHU Token Wallet' : 'HHU टोकन वॉलेट'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="text-5xl font-bold text-white mb-2">
                  {userData.hhuBalance.toLocaleString()} <span className="text-2xl text-blue-300">HHU</span>
                </div>
                <p className="text-gray-300 text-sm">
                  {language === 'en' 
                    ? `≈ $${(userData.hhuBalance * 0.05).toFixed(2)} USD` 
                    : `≈ ₹${(userData.hhuBalance * 4).toFixed(2)}`}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowSendTokens(!showSendTokens)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Send' : 'भेजें'}
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => onNavigate('receive')}
                >
                  <ArrowDownToLine className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Receive' : 'प्राप्त करें'}
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => onNavigate('stake')}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  {language === 'en' ? 'Stake' : 'स्टेक'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-white">{userData.stats.energyGenerated}</span>
                </div>
                <p className="text-sm text-gray-400">
                  {language === 'en' ? 'Energy Generated' : 'ऊर्जा उत्पन्न'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Globe className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold text-white">{userData.stats.co2Saved}</span>
                </div>
                <p className="text-sm text-gray-400">
                  {language === 'en' ? 'CO₂ Saved' : 'CO₂ बचाया'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <span className="text-2xl font-bold text-white">{userData.stats.membersAdded}</span>
                </div>
                <p className="text-sm text-gray-400">
                  {language === 'en' ? 'Members Added' : 'सदस्य जोड़े'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <span className="text-2xl font-bold text-white">{userData.stats.projectsStarted}</span>
                </div>
                <p className="text-sm text-gray-400">
                  {language === 'en' ? 'Projects Started' : 'परियोजनाएं शुरू की'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-5 h-5 text-orange-500" />
                  <span className="text-2xl font-bold text-white">{userData.stats.projectsHelped}</span>
                </div>
                <p className="text-sm text-gray-400">
                  {language === 'en' ? 'Projects Helped' : 'परियोजनाओं में मदद की'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Wallet className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold text-white">{userData.stats.tokensEarned}</span>
                </div>
                <p className="text-sm text-gray-400">
                  {language === 'en' ? 'Tokens Earned' : 'टोकन अर्जित'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {language === 'en' ? 'Quick Actions' : 'त्वरित क्रियाएं'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions
                .filter(action => action.id !== 'nft-gallery')
                .map((action) => {
                const Icon = action.icon
                return (
                  <Button 
                    key={action.id}
                    className={`w-full justify-start text-white ${action.color}`}
                    onClick={() => onNavigate(action.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {language === 'en' ? action.label : action.labelHi}
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* NFT Collection */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>{language === 'en' ? 'Your NFT Collection' : 'आपका NFT संग्रह'}</span>
              </CardTitle>
              <Button 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => onNavigate('nfts')}
              >
                {language === 'en' ? 'View All' : 'सभी देखें'}
              </Button>
            </div>
            <CardDescription className="text-gray-400">
              {language === 'en' 
                ? `${userData.nfts.length} badges, access passes, and project NFTs` 
                : `${userData.nfts.length} बैज, एक्सेस पास, और परियोजना NFT`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {userData.nfts.map((nft) => (
                <button 
                  key={nft.id}
                  className="group relative aspect-square bg-gray-700 rounded-xl border-2 border-gray-600 hover:border-blue-500 transition-all overflow-hidden"
                  onClick={() => onNavigate(`nft/${nft.id}`)}
                >
                  <div className="flex items-center justify-center h-full text-5xl">
                    {nft.image}
                  </div>
                  <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusColor(nft.status)}`} />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                    <p className="text-white text-xs text-center font-medium">{nft.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* UrgamU Progress */}
        <Card className="bg-gradient-to-r from-orange-900 to-red-900 border-orange-700 mt-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {language === 'en' ? 'UrgamU Initiative' : 'उरगमू पहल'}
                </h3>
                <p className="text-gray-200">
                  {language === 'en' 
                    ? '547 villages connected • 9,453 remaining' 
                    : '547 गांव जुड़े • 9,453 बाकी'}
                </p>
              </div>
              <div className="w-full md:w-1/3">
                <div className="bg-gray-800 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-full" 
                    style={{ width: '5.47%' }}
                  />
                </div>
                <p className="text-right text-white text-sm mt-1">5.47% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
