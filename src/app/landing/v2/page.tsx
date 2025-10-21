'use client';

import { ArrowRight, Award, ChevronRight, Globe, Heart, Menu, Shield, Sun, Users, Vote, Wallet, X, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function HeliosHashDAO() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { value: '3', label: 'Active Projects', color: 'from-orange-400 to-orange-600' },
    { value: '4', label: 'Community Applications', color: 'from-green-400 to-green-600' },
    { value: '3', label: 'Governance Proposals', color: 'from-blue-400 to-blue-600' },
    { value: '2', label: 'Animal Care Reports', color: 'from-pink-400 to-pink-600' }
  ];

  const features = [
    {
      icon: Sun,
      title: 'Solar Infrastructure',
      description: 'Fund and manage community-owned solar projects in rural Gujarat. From Urgam Valley to Dharampur.',
      gradient: 'from-orange-500 to-yellow-500',
      link: 'View Projects'
    },
    {
      icon: Vote,
      title: 'DAO Governance',
      description: 'Participate in transparent decision-making. Vote on proposals, manage treasury, and shape the future.',
      gradient: 'from-blue-500 to-cyan-500',
      link: 'Join Governance'
    },
    {
      icon: Users,
      title: 'Community Hub',
      description: 'Land partners, technical collaborators, and community contributors unite for sustainable development.',
      gradient: 'from-green-500 to-emerald-500',
      link: 'Explore Community'
    },
    {
      icon: Heart,
      title: 'Animal Welfare',
      description: 'Community-driven animal care initiatives. Report issues, vote on solutions, earn rewards.',
      gradient: 'from-pink-500 to-rose-500',
      link: 'Help Animals'
    },
    {
      icon: Award,
      title: 'NFT Membership',
      description: 'Own your stake in the community. Community, Supporter, Investor, and Partner tiers available.',
      gradient: 'from-purple-500 to-indigo-500',
      link: 'View Membership'
    },
    {
      icon: Wallet,
      title: 'Rewards & Incentives',
      description: 'Earn tokens for participation. Community contributions, governance votes, and project milestones.',
      gradient: 'from-amber-500 to-orange-500',
      link: 'Claim Rewards'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-green-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition"></div>
                <div className="relative bg-gradient-to-r from-orange-500 to-green-500 p-2 rounded-xl">
                  <Sun className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
                HeliosHash DAO
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['Dashboard', 'Projects', 'Governance', 'Wallet', 'Community'].map((item) => (
                <button key={item} className="text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-green-500 group-hover:w-full transition-all duration-300"></span>
                </button>
              ))}
              <button className="bg-gradient-to-r from-orange-500 to-green-500 px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105">
                Connect Wallet
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/98 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              {['Dashboard', 'Projects', 'Governance', 'Wallet', 'Community'].map((item) => (
                <button key={item} className="block w-full text-left py-2 text-gray-300 hover:text-white transition">
                  {item}
                </button>
              ))}
              <button className="w-full bg-gradient-to-r from-orange-500 to-green-500 px-6 py-3 rounded-full font-semibold">
                Connect Wallet
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/20">
              <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-sm font-medium">Decentralized Solar Infrastructure</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
                Decentralized Solar
              </span>
              <br />
              <span className="text-white">for Rural India</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Empowering communities with 100% community-owned solar projects, transparent governance, 
              and sustainable development from sunlight to sovereignty.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="group bg-gradient-to-r from-orange-500 to-green-500 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <span>Explore Projects</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                Join Community
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {stats.map((stat, idx) => (
              <div key={idx} className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className={`text-4xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Complete DAO Ecosystem
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From solar project funding to community governance, animal welfare, and transparent treasury management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300 hover:transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
                
                <div className="relative space-y-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  
                  <button className="flex items-center space-x-2 text-transparent bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    <span>{feature.link}</span>
                    <ChevronRight className="w-4 h-4 text-orange-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-r from-orange-500/20 via-green-500/20 to-blue-500/20 backdrop-blur-xl rounded-3xl p-12 border border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-green-500 to-blue-500 opacity-5"></div>
            
            <div className="relative text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Secure & Transparent</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl font-bold">
                Ready to Join the Solar Revolution?
              </h2>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Connect your wallet and become part of India's first community-owned solar DAO. 
                From sunlight to sovereignty, one block at a time.
              </p>
              
              <button className="group bg-gradient-to-r from-orange-500 to-green-500 px-10 py-5 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 mx-auto">
                <Wallet className="w-6 h-6" />
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Built on Internet Computer</span>
              </div>
              <span>•</span>
              <span>Fully Decentralized</span>
              <span>•</span>
              <span>Community Owned</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
