'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import NFTCreation from '@/components/nft/NFTCreation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function NFTsPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [showCreation, setShowCreation] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  if (showCreation) {
    return (
      <NFTCreation
        user={user}
        language={(user as any)?.language || 'en'}
        onBack={() => setShowCreation(false)}
      />
    )
  }

  // NFT Gallery View
  const language = (user as any)?.language || 'en'
  const nfts = [
    { id: 1, name: 'Baghpat Solar #1', image: '🏞️', status: 'green' },
    { id: 2, name: 'Village Grid #42', image: '⚡', status: 'yellow' },
    { id: 3, name: 'Early Adopter', image: '🌟', status: 'badge' },
    { id: 4, name: 'Engineer Certified', image: '🔧', status: 'badge' },
    { id: 5, name: 'Contributor Rank 3', image: '🏆', status: 'badge' },
    { id: 6, name: 'Node Operator', image: '🖥️', status: 'badge' },
    { id: 7, name: 'Land Deed #101', image: '📜', status: 'deed' },
    { id: 8, name: 'Milestone 100kW', image: '⚡', status: 'badge' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green': return 'bg-green-500'
      case 'yellow': return 'bg-yellow-500'
      case 'orange': return 'bg-orange-500'
      case 'blue': return 'bg-blue-500'
      case 'grey': return 'bg-gray-500'
      default: return 'bg-purple-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {language === 'en' ? 'Your NFT Collection' : 'आपका NFT संग्रह'}
            </h1>
            <p className="text-gray-400">
              {language === 'en'
                ? `${nfts.length} badges, access passes, and project NFTs`
                : `${nfts.length} बैज, एक्सेस पास, और परियोजना NFT`}
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowCreation(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Create NFT' : 'NFT बनाएं'}
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {nfts.map((nft) => (
            <Card
              key={nft.id}
              className="group relative aspect-square bg-gray-700 border-2 border-gray-600 hover:border-blue-500 transition-all overflow-hidden cursor-pointer"
            >
              <CardContent className="p-0 h-full">
                <div className="flex items-center justify-center h-full text-6xl">
                  {nft.image}
                </div>
                <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${getStatusColor(nft.status)}`} />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                  <p className="text-white text-sm text-center font-medium">{nft.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
