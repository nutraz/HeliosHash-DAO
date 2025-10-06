'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HHDAOLogo } from '@/components/hhdao-logo';
import {
  Zap,
  Users,
  Shield,
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Leaf,
  BarChart3,
  Award,
  Target,
  Heart,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

/**
 * Renders the HeliosHash DAO landing page with hero, stats, features, impact, roadmap, CTA, and footer sections.
 *
 * The component displays live-updating counters and an entrance animation, and provides navigation actions
 * for joining, signing up, and exploring the dashboard.
 *
 * @returns A React element representing the complete landing page layout for HeliosHash DAO.
 */
export default function LandingPage() {
  const router = useRouter();
  const [energyGenerated, setEnergyGenerated] = useState(12847);
  const [communityMembers, setCommunityMembers] = useState(1247);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    // Animate counters
    const interval = setInterval(() => {
      setEnergyGenerated((prev) => prev + Math.floor(Math.random() * 5));
      setCommunityMembers((prev) => prev + Math.floor(Math.random() * 2));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Solar Energy Infrastructure',
      description:
        'Community-owned solar farms generating clean energy for Urgam Valley and surrounding areas.',
    },
    {
      icon: Users,
      title: 'Decentralized Governance',
      description:
        'Democratic decision-making through DAO proposals and community voting on all major initiatives.',
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description:
        'Built on Internet Computer Protocol (ICP) with transparent, immutable smart contracts.',
    },
    {
      icon: Globe,
      title: 'Community Impact',
      description:
        'Direct benefits to local families through energy access, job creation, and sustainable development.',
    },
  ];

  const stats = [
    {
      label: 'Energy Generated',
      value: `${energyGenerated.toLocaleString()}`,
      unit: 'kWh',
      icon: Zap,
      color: 'text-orange-400',
    },
    {
      label: 'Community Members',
      value: communityMembers.toLocaleString(),
      unit: 'People',
      icon: Users,
      color: 'text-blue-400',
    },
    {
      label: 'Carbon Offset',
      value: '8.2',
      unit: 'Tons CO₂',
      icon: Leaf,
      color: 'text-green-400',
    },
    {
      label: 'Projects Funded',
      value: '7',
      unit: 'Active',
      icon: Target,
      color: 'text-purple-400',
    },
  ];

  const milestones = [
    {
      title: 'Community Formation',
      description: 'Established DAO governance and initial community of 500+ members',
      status: 'completed',
    },
    {
      title: 'Phase 1 Solar Farm',
      description: '500kW solar installation powering 200+ households',
      status: 'completed',
    },
    {
      title: 'Phase 2 Expansion',
      description: 'Additional 300kW capacity with energy storage systems',
      status: 'active',
    },
    {
      title: 'Regional Network',
      description: 'Connect with neighboring villages for energy sharing',
      status: 'planned',
    },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800'>
      {/* Animated background stripes */}
      <div className='flag-stripes opacity-30'></div>

      {/* Header */}
      <header className='relative z-10 border-b border-gray-700/50 backdrop-blur-sm bg-gray-900/80'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <HHDAOLogo size='md' />
              <div>
                <h1 className='text-xl font-bold text-white'>HeliosHash DAO</h1>
                <p className='text-sm text-gray-400'>Urgam Valley India Node</p>
              </div>
            </div>
            <nav className='hidden md:flex items-center space-x-6'>
              <a href='#features' className='text-gray-300 hover:text-white transition-colors'>
                Features
              </a>
              <a href='#impact' className='text-gray-300 hover:text-white transition-colors'>
                Impact
              </a>
              <a href='#roadmap' className='text-gray-300 hover:text-white transition-colors'>
                Roadmap
              </a>
              <Button
                onClick={() => router.push('/auth/login')}
                className='bg-orange-600 hover:bg-orange-700 text-white'
              >
                Join DAO
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className='relative z-10'>
        {/* Hero Section */}
        <section className='pt-20 pb-16 px-6'>
          <div className='max-w-7xl mx-auto text-center'>
            <div
              className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <Badge className='mb-6 bg-orange-500/20 text-orange-300 border-orange-500/30'>
                🇮🇳 One World Project - India Node
              </Badge>

              <h1 className='text-5xl md:text-7xl font-bold text-white mb-6 leading-tight'>
                Solar Energy for
                <span className='block bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent'>
                  Urgam Valley
                </span>
              </h1>

              <p className='text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed'>
                Join India's first community-owned solar energy DAO. Together, we're transforming
                rural communities through renewable energy, blockchain governance, and sustainable
                development.
              </p>

              <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
                <Button
                  size='lg'
                  className='bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 text-lg'
                  onClick={() => router.push('/auth/login')}
                >
                  Join the DAO
                  <ArrowRight className='ml-2 w-5 h-5' />
                </Button>

                <Button
                  size='lg'
                  variant='outline'
                  className='border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg'
                  onClick={() => router.push('/dashboard')}
                >
                  Explore Dashboard
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className='py-16 px-6 bg-gray-800/50 backdrop-blur-sm'>
          <div className='max-w-7xl mx-auto'>
            <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
              {stats.map((stat, index) => (
                <Card key={index} className='card-readable text-center'>
                  <CardContent className='p-6'>
                    <stat.icon className={`w-10 h-10 mx-auto mb-4 ${stat.color}`} />
                    <div className='text-3xl font-bold text-white mb-2'>
                      {stat.value}
                      <span className='text-lg text-gray-400 ml-1'>{stat.unit}</span>
                    </div>
                    <p className='text-gray-400 text-sm'>{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id='features' className='py-20 px-6'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl font-bold text-white mb-4'>
                Powering Communities Through Innovation
              </h2>
              <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
                HeliosHash DAO combines renewable energy infrastructure with blockchain governance
                to create sustainable, community-owned solutions.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {features.map((feature, index) => (
                <Card key={index} className='card-readable card-patriotic'>
                  <CardContent className='p-8'>
                    <feature.icon className='w-12 h-12 text-orange-400 mb-4' />
                    <h3 className='text-xl font-semibold text-white mb-3'>{feature.title}</h3>
                    <p className='text-gray-300 leading-relaxed'>{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section
          id='impact'
          className='py-20 px-6 bg-gradient-to-r from-orange-900/20 via-transparent to-green-900/20'
        >
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl font-bold text-white mb-4'>Real Impact, Real Results</h2>
              <p className='text-xl text-gray-400 max-w-3xl mx-auto'>
                See how HeliosHash DAO is transforming lives in Urgam Valley through sustainable
                energy and community governance.
              </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              <div className='space-y-8'>
                <Card className='card-readable'>
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-4'>
                      <Heart className='w-8 h-8 text-red-400' />
                      <div>
                        <h4 className='font-semibold text-white'>Community Benefits</h4>
                        <p className='text-gray-300'>200+ households with reliable electricity</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='card-readable'>
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-4'>
                      <BarChart3 className='w-8 h-8 text-blue-400' />
                      <div>
                        <h4 className='font-semibold text-white'>Economic Growth</h4>
                        <p className='text-gray-300'>
                          ₹2.5 crores invested in local infrastructure
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className='card-readable'>
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-4'>
                      <Award className='w-8 h-8 text-green-400' />
                      <div>
                        <h4 className='font-semibold text-white'>Sustainability</h4>
                        <p className='text-gray-300'>8.2 tons CO₂ offset annually</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className='relative'>
                <Card className='card-readable p-8'>
                  <div className='text-center'>
                    <Star className='w-16 h-16 text-yellow-400 mx-auto mb-4' />
                    <h3 className='text-2xl font-bold text-white mb-4'>Join Our Mission</h3>
                    <p className='text-gray-300 mb-6'>
                      Be part of India's renewable energy revolution. Your participation helps build
                      sustainable communities and creates lasting positive impact.
                    </p>
                    <Button
                      size='lg'
                      className='bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                      onClick={() => router.push('/auth/signup')}
                    >
                      Start Your Journey
                      <ArrowRight className='ml-2 w-5 h-5' />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section id='roadmap' className='py-20 px-6'>
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-4xl font-bold text-white mb-4'>Our Development Roadmap</h2>
              <p className='text-xl text-gray-400'>
                Tracking progress toward a sustainable energy future
              </p>
            </div>

            <div className='space-y-6'>
              {milestones.map((milestone, index) => (
                <Card key={index} className='card-readable'>
                  <CardContent className='p-6'>
                    <div className='flex items-center space-x-4'>
                      <div
                        className={`w-4 h-4 rounded-full ${
                          milestone.status === 'completed'
                            ? 'bg-green-500'
                            : milestone.status === 'active'
                              ? 'bg-orange-500'
                              : 'bg-gray-500'
                        }`}
                      />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between'>
                          <h4 className='font-semibold text-white'>{milestone.title}</h4>
                          <Badge
                            className={
                              milestone.status === 'completed'
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : milestone.status === 'active'
                                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                  : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }
                          >
                            {milestone.status === 'completed'
                              ? 'Completed'
                              : milestone.status === 'active'
                                ? 'In Progress'
                                : 'Planned'}
                          </Badge>
                        </div>
                        <p className='text-gray-300 mt-1'>{milestone.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='py-20 px-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50'>
          <div className='max-w-4xl mx-auto text-center'>
            <h2 className='text-4xl font-bold text-white mb-6'>Ready to Build the Future?</h2>
            <p className='text-xl text-gray-300 mb-8'>
              Join HeliosHash DAO today and be part of India's renewable energy revolution.
              Together, we can create sustainable communities and lasting positive change.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                size='lg'
                className='bg-orange-600 hover:bg-orange-700 text-white px-8 py-4'
                onClick={() => router.push('/auth/signup')}
              >
                Join DAO - It's Free
                <Users className='ml-2 w-5 h-5' />
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4'
                onClick={() => router.push('/dashboard')}
              >
                Explore Platform
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className='relative z-10 border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto px-6 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            <div>
              <div className='flex items-center space-x-3 mb-4'>
                <HHDAOLogo size='sm' />
                <span className='font-bold text-white'>HeliosHash DAO</span>
              </div>
              <p className='text-gray-400 text-sm'>
                Transforming communities through renewable energy and blockchain governance.
              </p>
            </div>

            <div>
              <h5 className='font-semibold text-white mb-3'>Platform</h5>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a href='/dashboard' className='text-gray-400 hover:text-white transition-colors'>
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href='/governance'
                    className='text-gray-400 hover:text-white transition-colors'
                  >
                    Governance
                  </a>
                </li>
                <li>
                  <a href='/projects' className='text-gray-400 hover:text-white transition-colors'>
                    Solar Projects
                  </a>
                </li>
                <li>
                  <a href='/nft' className='text-gray-400 hover:text-white transition-colors'>
                    NFT Marketplace
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className='font-semibold text-white mb-3'>Community</h5>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                    Discord
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                    Twitter
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                    Telegram
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className='font-semibold text-white mb-3'>Resources</h5>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                    Documentation
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                    API Reference
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                    Whitepaper
                  </a>
                </li>
                <li>
                  <a href='#' className='text-gray-400 hover:text-white transition-colors'>
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className='border-t border-gray-700/50 mt-8 pt-8 text-center'>
            <p className='text-gray-400 text-sm'>
              © 2025 HeliosHash DAO. Part of the One World Project ecosystem. Building a
              sustainable future for all.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}