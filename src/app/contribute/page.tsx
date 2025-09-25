'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Shield, Award, DollarSign, Calendar, BarChart, PieChart, Users, Target, Zap, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface InvestmentOpportunity {
  id: string;
  title: string;
  location: string;
  targetAmount: number;
  currentAmount: number;
  investorCount: number;
  expectedROI: string;
  duration: string;
  riskLevel: 'low' | 'medium' | 'high';
  minInvestment: number;
  category: 'solar-farm' | 'residential' | 'commercial' | 'infrastructure';
  description: string;
  highlights: string[];
  timeline: {
    phase: string;
    completion: number;
    expectedDate: string;
  }[];
}

const mockOpportunities: InvestmentOpportunity[] = [
  {
    id: 'inv_001',
    title: '50MW Solar Farm - Rajasthan Desert',
    location: 'Jodhpur, Rajasthan',
    targetAmount: 25000000,
    currentAmount: 18750000,
    investorCount: 147,
    expectedROI: '12-15% annually',
    duration: '25 years',
    riskLevel: 'low',
    minInvestment: 500000,
    category: 'solar-farm',
    description: 'Large-scale solar farm project in high-irradiance desert region with government backing and 25-year PPA.',
    highlights: [
      'Government-backed PPA agreement',
      'Desert location with optimal sun exposure',
      'Experienced installation partner',
      'Grid connectivity confirmed'
    ],
    timeline: [
      { phase: 'Land Acquisition', completion: 100, expectedDate: 'Completed' },
      { phase: 'Environmental Clearances', completion: 85, expectedDate: 'Jan 2026' },
      { phase: 'Construction', completion: 0, expectedDate: 'Mar 2026' },
      { phase: 'Grid Connection', completion: 0, expectedDate: 'Aug 2026' }
    ]
  },
  {
    id: 'inv_002',
    title: 'Rooftop Solar Portfolio - Mumbai',
    location: 'Mumbai, Maharashtra',
    targetAmount: 12000000,
    currentAmount: 7200000,
    investorCount: 89,
    expectedROI: '10-12% annually',
    duration: '15 years',
    riskLevel: 'medium',
    minInvestment: 250000,
    category: 'residential',
    description: 'Portfolio of 500+ residential rooftop installations across Mumbai with net metering benefits.',
    highlights: [
      'Net metering with MSEB',
      'Distributed risk across 500+ rooftops',
      'Urban market with high electricity rates',
      'Professional maintenance included'
    ],
    timeline: [
      { phase: 'Customer Acquisition', completion: 75, expectedDate: 'Feb 2026' },
      { phase: 'Installation Phase 1', completion: 30, expectedDate: 'Apr 2026' },
      { phase: 'Installation Phase 2', completion: 0, expectedDate: 'Jul 2026' },
      { phase: 'Full Operation', completion: 0, expectedDate: 'Sep 2026' }
    ]
  },
  {
    id: 'inv_003',
    title: 'Industrial Solar + Storage - Gujarat',
    location: 'Ahmedabad, Gujarat',
    targetAmount: 35000000,
    currentAmount: 14000000,
    investorCount: 52,
    expectedROI: '14-18% annually',
    duration: '20 years',
    riskLevel: 'medium',
    minInvestment: 1000000,
    category: 'commercial',
    description: 'Combined solar and battery storage system for industrial complex with captive power model.',
    highlights: [
      'Battery storage for 24/7 power',
      'Captive consumption model',
      'Industrial customer base',
      'Peak shaving revenue optimization'
    ],
    timeline: [
      { phase: 'Customer Contracts', completion: 90, expectedDate: 'Dec 2025' },
      { phase: 'Equipment Procurement', completion: 45, expectedDate: 'Feb 2026' },
      { phase: 'Installation', completion: 0, expectedDate: 'May 2026' },
      { phase: 'Commissioning', completion: 0, expectedDate: 'Aug 2026' }
    ]
  }
];

const investmentTiers = [
  {
    name: 'Starter',
    minAmount: 100000,
    maxAmount: 999999,
    benefits: ['Quarterly reports', 'Online dashboard', 'Tax benefits'],
    badge: 'bg-blue-500'
  },
  {
    name: 'Growth',
    minAmount: 1000000,
    maxAmount: 4999999,
    benefits: ['Monthly reports', 'Priority support', 'Site visits', 'Advanced analytics'],
    badge: 'bg-purple-500'
  },
  {
    name: 'Premium',
    minAmount: 5000000,
    maxAmount: 19999999,
    benefits: ['Weekly reports', 'Dedicated manager', 'Board participation', 'Co-investment opportunities'],
    badge: 'bg-yellow-500'
  },
  {
    name: 'Elite',
    minAmount: 20000000,
    maxAmount: Infinity,
    benefits: ['Real-time monitoring', 'Strategic partnership', 'Project selection input', 'Custom terms'],
    badge: 'bg-red-500'
  }
];

export default function ContributePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('opportunities');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'solar-farm': return Zap;
      case 'residential': return Users;
      case 'commercial': return Target;
      case 'infrastructure': return BarChart;
      default: return DollarSign;
    }
  };

  const filteredOpportunities = mockOpportunities.filter(opp => {
    const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
    const matchesRisk = selectedRisk === 'all' || opp.riskLevel === selectedRisk;
    return matchesCategory && matchesRisk;
  });

  const getTierForAmount = (amount: number) => {
    return investmentTiers.find(tier => amount >= tier.minAmount && amount <= tier.maxAmount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Investment Hub</h1>
              <p className="text-gray-400">Invest in solar projects and earn sustainable returns</p>
            </div>
          </div>
        </div>

        {/* Investment Benefits */}
        <Card className="bg-green-500/10 border-green-500/20 mb-6">
          <CardContent className="p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Why Invest in Solar?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-3 bg-gray-800/30 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-400 mb-2" />
                <span className="text-white text-sm text-center">Stable Returns</span>
                <span className="text-green-400 text-xs">10-18% annually</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-800/30 rounded-lg">
                <Leaf className="w-8 h-8 text-green-400 mb-2" />
                <span className="text-white text-sm text-center">Clean Energy</span>
                <span className="text-green-400 text-xs">Carbon positive</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-800/30 rounded-lg">
                <Shield className="w-8 h-8 text-blue-400 mb-2" />
                <span className="text-white text-sm text-center">Government Support</span>
                <span className="text-blue-400 text-xs">Policy backing</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-800/30 rounded-lg">
                <Calendar className="w-8 h-8 text-purple-400 mb-2" />
                <span className="text-white text-sm text-center">Long Term</span>
                <span className="text-purple-400 text-xs">15-25 years</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-800/50">
            <TabsTrigger value="opportunities" className="data-[state=active]:bg-green-500">
              Investment Opportunities
            </TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-green-500">
              ROI Calculator
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-green-500">
              My Portfolio
            </TabsTrigger>
            <TabsTrigger value="tiers" className="data-[state=active]:bg-green-500">
              Investor Tiers
            </TabsTrigger>
          </TabsList>

          {/* Opportunities Tab */}
          <TabsContent value="opportunities">
            {/* Filters */}
            <Card className="bg-gray-800/50 border-gray-700 mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-white">Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-2">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="all" className="text-white">All Categories</SelectItem>
                        <SelectItem value="solar-farm" className="text-white">Solar Farms</SelectItem>
                        <SelectItem value="residential" className="text-white">Residential</SelectItem>
                        <SelectItem value="commercial" className="text-white">Commercial</SelectItem>
                        <SelectItem value="infrastructure" className="text-white">Infrastructure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-white">Risk Level</Label>
                    <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-2">
                        <SelectValue placeholder="All Risk Levels" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="all" className="text-white">All Risk Levels</SelectItem>
                        <SelectItem value="low" className="text-white">Low Risk</SelectItem>
                        <SelectItem value="medium" className="text-white">Medium Risk</SelectItem>
                        <SelectItem value="high" className="text-white">High Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Investment Amount (₹)</Label>
                    <Input
                      placeholder="Min investment"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white mt-2"
                    />
                  </div>

                  <Button className="bg-gradient-to-r from-green-500 to-green-600 mt-7">
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Investment Opportunities */}
            <div className="space-y-6">
              {filteredOpportunities.map((opportunity) => {
                const CategoryIcon = getCategoryIcon(opportunity.category);
                const fundingProgress = (opportunity.currentAmount / opportunity.targetAmount) * 100;
                
                return (
                  <Card key={opportunity.id} className="bg-gray-800/50 border-gray-700 hover:border-green-500/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <CategoryIcon className="w-6 h-6 text-green-400" />
                            <h3 className="text-xl font-semibold text-white">{opportunity.title}</h3>
                            <Badge className={getRiskColor(opportunity.riskLevel)}>
                              {opportunity.riskLevel} risk
                            </Badge>
                          </div>
                          
                          <p className="text-gray-400 mb-2">{opportunity.location}</p>
                          <p className="text-gray-300 mb-4">{opportunity.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-700/30 rounded">
                          <div className="text-green-400 font-semibold">{opportunity.expectedROI}</div>
                          <div className="text-gray-400 text-sm">Expected ROI</div>
                        </div>
                        
                        <div className="text-center p-3 bg-gray-700/30 rounded">
                          <div className="text-blue-400 font-semibold">{formatCurrency(opportunity.minInvestment)}</div>
                          <div className="text-gray-400 text-sm">Min Investment</div>
                        </div>
                        
                        <div className="text-center p-3 bg-gray-700/30 rounded">
                          <div className="text-purple-400 font-semibold">{opportunity.duration}</div>
                          <div className="text-gray-400 text-sm">Duration</div>
                        </div>
                        
                        <div className="text-center p-3 bg-gray-700/30 rounded">
                          <div className="text-yellow-400 font-semibold">{opportunity.investorCount}</div>
                          <div className="text-gray-400 text-sm">Investors</div>
                        </div>
                      </div>

                      {/* Funding Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Funding Progress</span>
                          <span>{formatCurrency(opportunity.currentAmount)} / {formatCurrency(opportunity.targetAmount)}</span>
                        </div>
                        <Progress value={fundingProgress} className="mb-2" />
                        <div className="text-green-400 text-sm">{fundingProgress.toFixed(1)}% funded</div>
                      </div>

                      {/* Project Highlights */}
                      <div className="mb-4">
                        <h4 className="text-white font-medium mb-2">Project Highlights</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {opportunity.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-300">
                              <Award className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                              {highlight}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="mb-6">
                        <h4 className="text-white font-medium mb-3">Project Timeline</h4>
                        <div className="space-y-2">
                          {opportunity.timeline.map((phase, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center flex-1">
                                <div className="text-sm text-gray-300 w-32">{phase.phase}</div>
                                <div className="flex-1 mx-4">
                                  <Progress value={phase.completion} className="h-2" />
                                </div>
                                <div className="text-sm text-gray-400 w-24">{phase.completion}%</div>
                              </div>
                              <div className="text-sm text-gray-400 ml-4 w-20">{phase.expectedDate}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-gray-400 text-sm">
                          Updated today • {opportunity.investorCount} current investors
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300"
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-green-500 to-green-600"
                            onClick={() => setSelectedOpportunity(opportunity.id)}
                          >
                            Invest Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart className="w-5 h-5 mr-2" />
                  Investment ROI Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Calculate Your Returns</h3>
                  <p className="text-gray-400 mb-6">
                    Interactive calculator to estimate returns from solar investments
                  </p>
                  <Button className="bg-gradient-to-r from-green-500 to-green-600">
                    Coming Soon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">My Investment Portfolio</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">No Investments Yet</h3>
                  <p className="text-gray-400 mb-6">
                    Start investing to build your sustainable energy portfolio
                  </p>
                  <Button 
                    onClick={() => setActiveTab('opportunities')}
                    className="bg-gradient-to-r from-green-500 to-green-600"
                  >
                    Browse Opportunities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tiers Tab */}
          <TabsContent value="tiers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {investmentTiers.map((tier, index) => (
                <Card key={index} className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">{tier.name}</CardTitle>
                      <Badge className={tier.badge}>{tier.name}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="text-2xl font-bold text-white">
                        {formatCurrency(tier.minAmount)}+
                      </div>
                      <div className="text-gray-400 text-sm">Minimum investment</div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-white font-medium">Benefits:</h4>
                      {tier.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-300">
                          <Award className="w-4 h-4 text-green-400 mr-2" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}