'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  MessageSquare, Users, TrendingUp, Heart,
  Share2, Calendar, MapPin, Zap, Globe
} from 'lucide-react'

interface CommunityHubProps {
  user: any
  language?: string
}

const discussions = [
  {
    id: 1,
    author: 'Rajesh Kumar',
    authorRole: 'Solar Contractor',
    authorRoleHi: 'सौर ठेकेदार',
    avatar: '👷',
    title: 'Best practices for monsoon season installations',
    titleHi: 'मानसून के मौसम में स्थापना के लिए सर्वोत्तम तरीके',
    excerpt: 'What are your tips for installing solar during heavy rains?',
    excerptHi: 'भारी बारिश के दौरान सौर ऊर्जा स्थापित करने के लिए आपके सुझाव क्या हैं?',
    category: 'Technical',
    categoryHi: 'तकनीकी',
    replies: 24,
    likes: 45,
    time: '2 hours ago',
    timeHi: '2 घंटे पहले',
    trending: true
  },
  {
    id: 2,
    author: 'Priya Singh',
    authorRole: 'Engineer',
    authorRoleHi: 'इंजीनियर',
    avatar: '👩‍🔧',
    title: 'Baghpat Project Update - 75% Complete!',
    titleHi: 'बघपत परियोजना अपडेट - 75% पूर्ण!',
    excerpt: 'Great progress on the village grid. Photos attached.',
    excerptHi: 'ग्राम ग्रिड पर शानदार प्रगति। फोटो संलग्न हैं।',
    category: 'Updates',
    categoryHi: 'अपडेट',
    replies: 18,
    likes: 89,
    time: '5 hours ago',
    timeHi: '5 घंटे पहले',
    trending: true
  },
  {
    id: 3,
    author: 'Mohammed Ahmed',
    authorRole: 'Node Operator',
    authorRoleHi: 'नोड संचालक',
    avatar: '💻',
    title: 'Running validator node - Hardware recommendations?',
    titleHi: 'वैलिडेटर नोड चलाना - हार्डवेयर सिफारिशें?',
    excerpt: 'Looking for budget-friendly setups for IC validators',
    excerptHi: 'IC वैलिडेटर के लिए बजट-अनुकूल सेटअप की तलाश में',
    category: 'Technical',
    categoryHi: 'तकनीकी',
    replies: 31,
    likes: 62,
    time: '1 day ago',
    timeHi: '1 दिन पहले',
    trending: false
  },
  {
    id: 4,
    author: 'Sunita Devi',
    authorRole: 'Landowner',
    authorRoleHi: 'भूमि स्वामी',
    avatar: '🏡',
    title: 'How to calculate revenue sharing fairly?',
    titleHi: 'राजस्व साझाकरण की निष्पक्ष गणना कैसे करें?',
    excerpt: 'First time offering my land for solar project',
    excerptHi: 'पहली बार सौर परियोजना के लिए अपनी जमीन की पेशकश कर रहा हूं',
    category: 'Questions',
    categoryHi: 'सवाल',
    replies: 12,
    likes: 28,
    time: '2 days ago',
    timeHi: '2 दिन पहले',
    trending: false
  }
]

const events = [
  {
    id: 1,
    title: 'Community Meetup - Baghpat',
    titleHi: 'सामुदायिक मीटअप - बघपत',
    date: 'Nov 18, 2025',
    dateHi: '18 नवंबर, 2025',
    location: 'Village Community Center',
    locationHi: 'ग्राम समुदाय केंद्र',
    attendees: 45,
    type: 'In-person'
  },
  {
    id: 2,
    title: 'Online Training: Solar Installation 101',
    titleHi: 'ऑनलाइन प्रशिक्षण: सौर स्थापना 101',
    date: 'Nov 15, 2025',
    dateHi: '15 नवंबर, 2025',
    location: 'Virtual (Zoom)',
    locationHi: 'वर्चुअल (ज़ूम)',
    attendees: 120,
    type: 'Online'
  }
]

export default function CommunityHub({ user, language = 'en' }: CommunityHubProps) {
  const [activeTab, setActiveTab] = useState<'discussions' | 'events' | 'members'>('discussions')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {language === 'en' ? 'Community Hub' : 'सामुदायिक केंद्र'}
          </h1>
          <p className="text-gray-400">
            {language === 'en'
              ? 'Connect, discuss, and collaborate with the HeliosHash community'
              : 'HeliosHash समुदाय के साथ जुड़ें, चर्चा करें और सहयोग करें'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={activeTab === 'discussions' ? 'default' : 'outline'}
            onClick={() => setActiveTab('discussions')}
            className={activeTab !== 'discussions' ? 'border-gray-600 text-gray-300' : ''}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Discussions' : 'चर्चा'}
          </Button>
          <Button
            variant={activeTab === 'events' ? 'default' : 'outline'}
            onClick={() => setActiveTab('events')}
            className={activeTab !== 'events' ? 'border-gray-600 text-gray-300' : ''}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Events' : 'आयोजन'}
          </Button>
          <Button
            variant={activeTab === 'members' ? 'default' : 'outline'}
            onClick={() => setActiveTab('members')}
            className={activeTab !== 'members' ? 'border-gray-600 text-gray-300' : ''}
          >
            <Users className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Members' : 'सदस्य'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {activeTab === 'discussions' && (
              <>
                {/* New Discussion Button */}
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{user.avatar || '👤'}</div>
                      <Input
                        className="bg-gray-900 border-gray-600 text-white"
                        placeholder={language === 'en' ? 'Start a discussion...' : 'चर्चा शुरू करें...'}
                      />
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        {language === 'en' ? 'Post' : 'पोस्ट'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Discussion List */}
                {discussions.map(disc => (
                  <Card key={disc.id} className="bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="text-3xl">{disc.avatar}</div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-white font-semibold">{disc.author}</span>
                              <Badge variant="secondary" className="text-xs">
                                {language === 'en' ? disc.authorRole : disc.authorRoleHi}
                              </Badge>
                              {disc.trending && (
                                <Badge variant="default" className="text-xs bg-orange-600">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  {language === 'en' ? 'Trending' : 'ट्रेंडिंग'}
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-white text-lg mb-2">
                              {language === 'en' ? disc.title : disc.titleHi}
                            </CardTitle>
                            <p className="text-gray-400 text-sm">
                              {language === 'en' ? disc.excerpt : disc.excerptHi}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-gray-600 text-gray-400">
                          {language === 'en' ? disc.category : disc.categoryHi}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <button className="flex items-center space-x-1 hover:text-blue-400">
                          <MessageSquare className="w-4 h-4" />
                          <span>{disc.replies}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-red-400">
                          <Heart className="w-4 h-4" />
                          <span>{disc.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-green-400">
                          <Share2 className="w-4 h-4" />
                          <span>{language === 'en' ? 'Share' : 'साझा करें'}</span>
                        </button>
                        <span className="ml-auto">
                          {language === 'en' ? disc.time : disc.timeHi}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}

            {activeTab === 'events' && (
              <div className="space-y-4">
                {events.map(event => (
                  <Card key={event.id} className="bg-gray-800/50 border-gray-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white text-xl mb-2">
                            {language === 'en' ? event.title : event.titleHi}
                          </CardTitle>
                          <div className="space-y-1 text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{language === 'en' ? event.date : event.dateHi}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{language === 'en' ? event.location : event.locationHi}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4" />
                              <span>{event.attendees} {language === 'en' ? 'attending' : 'उपस्थित'}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={event.type === 'Online' ? 'secondary' : 'default'}>
                          {event.type === 'Online'
                            ? (language === 'en' ? 'Online' : 'ऑनलाइन')
                            : (language === 'en' ? 'In-person' : 'व्यक्तिगत रूप से')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        {language === 'en' ? 'Register' : 'पंजीकरण करें'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'members' && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    {language === 'en' ? 'Active Members' : 'सक्रिय सदस्य'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['👷', '👩‍🔧', '💻', '🏡', '⚡', '🔧', '👨‍💼', '🌾', '🚜'].map((avatar, idx) => (
                      <div key={idx} className="bg-gray-900 rounded-lg p-4 text-center hover:bg-gray-700 transition-colors cursor-pointer">
                        <div className="text-5xl mb-2">{avatar}</div>
                        <p className="text-white text-sm font-semibold">Member {idx + 1}</p>
                        <p className="text-gray-400 text-xs">Active</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card className="bg-gradient-to-br from-purple-900 to-blue-900 border-purple-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Community Stats' : 'समुदाय आंकड़े'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-white">1,247</p>
                  <p className="text-gray-300 text-sm">
                    {language === 'en' ? 'Total Members' : 'कुल सदस्य'}
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">89</p>
                  <p className="text-gray-300 text-sm">
                    {language === 'en' ? 'Active Today' : 'आज सक्रिय'}
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">542</p>
                  <p className="text-gray-300 text-sm">
                    {language === 'en' ? 'Discussions' : 'चर्चाएं'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Popular Topics */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  {language === 'en' ? 'Popular Topics' : 'लोकप्रिय विषय'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Solar Tech', 'Baghpat', 'UrgamU', 'Validators', 'Jobs', 'Training'].map((topic, idx) => (
                    <Badge key={idx} variant="secondary" className="cursor-pointer hover:bg-blue-600">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
