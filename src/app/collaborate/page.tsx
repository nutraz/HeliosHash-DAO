'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Award,
  Clock,
  MapPin,
  DollarSign,
  Search,
  Filter,
  Star,
  MessageCircle,
  ChevronRight,
  Zap,
  Wrench,
  Cpu,
  BarChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Opportunity {
  id: string;
  title: string;
  project: string;
  type: 'design' | 'installation' | 'maintenance' | 'consulting' | 'research';
  location: string;
  duration: string;
  budget: string;
  skillsRequired: string[];
  description: string;
  urgency: 'low' | 'medium' | 'high';
  remote: boolean;
  postedBy: string;
  postedDate: string;
  applicants: number;
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Solar Panel System Design',
    project: 'Village Community Solar Grid',
    type: 'design',
    location: 'Rajasthan, India',
    duration: '2-3 months',
    budget: '₹2,50,000 - ₹4,00,000',
    skillsRequired: ['Solar Design', 'PVsyst', 'AutoCAD', 'Grid Integration'],
    description:
      'Design a 500kW solar installation for rural community with grid-tie capabilities and battery backup.',
    urgency: 'high',
    remote: true,
    postedBy: 'Solar Innovations Ltd',
    postedDate: '2025-09-20',
    applicants: 12,
  },
  {
    id: '2',
    title: 'Installation & Commissioning Engineer',
    project: 'Agri-Solar Hybrid System',
    type: 'installation',
    location: 'Karnataka, India',
    duration: '6 weeks',
    budget: '₹1,80,000 - ₹2,50,000',
    skillsRequired: [
      'Solar Installation',
      'Electrical Systems',
      'Safety Protocols',
      'Project Management',
    ],
    description:
      'Lead installation team for innovative agri-solar system combining farming with solar generation.',
    urgency: 'medium',
    remote: false,
    postedBy: 'GreenTech Solutions',
    postedDate: '2025-09-18',
    applicants: 8,
  },
  {
    id: '3',
    title: 'IoT Monitoring System Developer',
    project: 'Smart Solar Farm Management',
    type: 'research',
    location: 'Remote',
    duration: '4 months',
    budget: '₹3,50,000 - ₹5,00,000',
    skillsRequired: ['IoT Development', 'Python', 'Solar Analytics', 'Cloud Platforms'],
    description:
      'Develop IoT-based monitoring and analytics platform for distributed solar installations.',
    urgency: 'low',
    remote: true,
    postedBy: 'TechSolar Innovations',
    postedDate: '2025-09-22',
    applicants: 15,
  },
  {
    id: '4',
    title: 'O&M Technical Specialist',
    project: 'Multi-Site Maintenance Program',
    type: 'maintenance',
    location: 'Gujarat, India',
    duration: '1 year contract',
    budget: '₹6,00,000 - ₹8,50,000',
    skillsRequired: [
      'Solar Maintenance',
      'Troubleshooting',
      'Inverter Systems',
      'Performance Analysis',
    ],
    description: 'Ongoing maintenance and optimization of 50+ solar installations across Gujarat.',
    urgency: 'medium',
    remote: false,
    postedBy: 'SolarCare Services',
    postedDate: '2025-09-19',
    applicants: 6,
  },
];

/**
 * Render the Technical Collaboration Hub page with searchable and filterable opportunity listings, a profile builder, and an applications view.
 *
 * The component manages local UI state for search, type/location/urgency filters, and the active tab; it displays opportunity tiles derived from mock data and provides controls for filtering, navigating back, and switching between "Available Opportunities", "My Profile & Skills", and "My Applications".
 *
 * @returns The page's JSX element containing the header, expertise area tiles, filter controls, opportunities list (with urgency/type badges and action buttons), profile card, and applications card.
 */
export default function CollaboratePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [activeTab, setActiveTab] = useState('opportunities');

  const opportunityTypes = [
    { value: 'design', label: 'System Design', icon: Cpu, color: 'text-blue-400' },
    { value: 'installation', label: 'Installation', icon: Wrench, color: 'text-green-400' },
    { value: 'maintenance', label: 'Maintenance', icon: Zap, color: 'text-yellow-400' },
    { value: 'consulting', label: 'Consulting', icon: MessageCircle, color: 'text-purple-400' },
    { value: 'research', label: 'Research & Development', icon: BarChart, color: 'text-red-400' },
  ];

  const filteredOpportunities = mockOpportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.skillsRequired.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || opp.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || opp.location.includes(selectedLocation);
    const matchesUrgency = selectedUrgency === 'all' || opp.urgency === selectedUrgency;

    return matchesSearch && matchesType && matchesLocation && matchesUrgency;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = opportunityTypes.find((t) => t.value === type);
    if (!typeConfig) return Cpu;
    return typeConfig.icon;
  };

  const getTypeColor = (type: string) => {
    const typeConfig = opportunityTypes.find((t) => t.value === type);
    return typeConfig?.color || 'text-gray-400';
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center space-x-4'>
            <Button
              onClick={() => router.back()}
              variant='outline'
              size='sm'
              className='border-gray-600 text-gray-300 hover:bg-gray-800'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back
            </Button>
            <div>
              <h1 className='text-2xl font-bold text-white'>Technical Collaboration Hub</h1>
              <p className='text-gray-400'>
                Connect with solar projects and contribute your expertise
              </p>
            </div>
          </div>
        </div>

        {/* Expertise Areas */}
        <Card className='bg-blue-500/10 border-blue-500/20 mb-6'>
          <CardContent className='p-6'>
            <h3 className='text-white font-semibold mb-4 flex items-center'>
              <Award className='w-5 h-5 mr-2' />
              Collaboration Opportunities
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
              {opportunityTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.value}
                    className='flex flex-col items-center p-3 bg-gray-800/30 rounded-lg'
                  >
                    <Icon className={`w-8 h-8 ${type.color} mb-2`} />
                    <span className='text-white text-sm text-center'>{type.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className='grid w-full grid-cols-3 mb-6 bg-gray-800/50'>
            <TabsTrigger value='opportunities' className='data-[state=active]:bg-blue-500'>
              Available Opportunities
            </TabsTrigger>
            <TabsTrigger value='profile' className='data-[state=active]:bg-blue-500'>
              My Profile & Skills
            </TabsTrigger>
            <TabsTrigger value='applications' className='data-[state=active]:bg-blue-500'>
              My Applications
            </TabsTrigger>
          </TabsList>

          {/* Opportunities Tab */}
          <TabsContent value='opportunities'>
            {/* Filters */}
            <Card className='bg-gray-800/50 border-gray-700 mb-6'>
              <CardContent className='p-4'>
                <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
                    <Input
                      placeholder='Search opportunities...'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white pl-10'
                    />
                  </div>

                  <div>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className='bg-gray-700 border-gray-600 text-white'>
                        <SelectValue placeholder='Type' />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-700 border-gray-600'>
                        <SelectItem value='all' className='text-white'>
                          All Types
                        </SelectItem>
                        {opportunityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className='text-white'>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className='bg-gray-700 border-gray-600 text-white'>
                        <SelectValue placeholder='Location' />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-700 border-gray-600'>
                        <SelectItem value='all' className='text-white'>
                          All Locations
                        </SelectItem>
                        <SelectItem value='Remote' className='text-white'>
                          Remote
                        </SelectItem>
                        <SelectItem value='Rajasthan' className='text-white'>
                          Rajasthan
                        </SelectItem>
                        <SelectItem value='Karnataka' className='text-white'>
                          Karnataka
                        </SelectItem>
                        <SelectItem value='Gujarat' className='text-white'>
                          Gujarat
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                      <SelectTrigger className='bg-gray-700 border-gray-600 text-white'>
                        <SelectValue placeholder='Urgency' />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-700 border-gray-600'>
                        <SelectItem value='all' className='text-white'>
                          All Urgency
                        </SelectItem>
                        <SelectItem value='high' className='text-white'>
                          High Priority
                        </SelectItem>
                        <SelectItem value='medium' className='text-white'>
                          Medium Priority
                        </SelectItem>
                        <SelectItem value='low' className='text-white'>
                          Low Priority
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant='outline' className='border-gray-600 text-gray-300'>
                    <Filter className='w-4 h-4 mr-2' />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Opportunities List */}
            <div className='space-y-4'>
              {filteredOpportunities.map((opportunity) => {
                const TypeIcon = getTypeIcon(opportunity.type);
                return (
                  <Card
                    key={opportunity.id}
                    className='bg-gray-800/50 border-gray-700 hover:border-blue-500/30 transition-colors'
                  >
                    <CardContent className='p-6'>
                      <div className='flex justify-between items-start mb-4'>
                        <div className='flex-1'>
                          <div className='flex items-center space-x-3 mb-2'>
                            <TypeIcon className={`w-5 h-5 ${getTypeColor(opportunity.type)}`} />
                            <h3 className='text-lg font-semibold text-white'>
                              {opportunity.title}
                            </h3>
                            <Badge className={getUrgencyColor(opportunity.urgency)}>
                              {opportunity.urgency} priority
                            </Badge>
                          </div>

                          <p className='text-blue-400 mb-2'>{opportunity.project}</p>
                          <p className='text-gray-300 mb-4'>{opportunity.description}</p>
                        </div>

                        <div className='text-right'>
                          <div className='text-green-400 font-semibold mb-1'>
                            {opportunity.budget}
                          </div>
                          <div className='text-gray-400 text-sm'>
                            {opportunity.applicants} applicants
                          </div>
                        </div>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                        <div className='flex items-center text-gray-300'>
                          <MapPin className='w-4 h-4 mr-2 text-gray-400' />
                          <span className='text-sm'>{opportunity.location}</span>
                          {opportunity.remote && (
                            <Badge className='ml-2 bg-blue-500/20 text-blue-400 text-xs'>
                              Remote
                            </Badge>
                          )}
                        </div>

                        <div className='flex items-center text-gray-300'>
                          <Clock className='w-4 h-4 mr-2 text-gray-400' />
                          <span className='text-sm'>{opportunity.duration}</span>
                        </div>

                        <div className='flex items-center text-gray-300'>
                          <Users className='w-4 h-4 mr-2 text-gray-400' />
                          <span className='text-sm'>By {opportunity.postedBy}</span>
                        </div>
                      </div>

                      <div className='mb-4'>
                        <div className='flex flex-wrap gap-2'>
                          {opportunity.skillsRequired.map((skill) => (
                            <Badge key={skill} className='bg-gray-700 text-gray-300 text-xs'>
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className='flex justify-between items-center'>
                        <span className='text-gray-400 text-sm'>
                          Posted {new Date(opportunity.postedDate).toLocaleDateString()}
                        </span>

                        <div className='flex space-x-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            className='border-gray-600 text-gray-300'
                          >
                            <MessageCircle className='w-4 h-4 mr-2' />
                            Ask Question
                          </Button>
                          <Button size='sm' className='bg-gradient-to-r from-blue-500 to-blue-600'>
                            Apply Now
                            <ChevronRight className='w-4 h-4 ml-2' />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredOpportunities.length === 0 && (
              <Card className='bg-gray-800/50 border-gray-700'>
                <CardContent className='p-8 text-center'>
                  <Search className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-white font-semibold mb-2'>No Opportunities Found</h3>
                  <p className='text-gray-400'>
                    Try adjusting your search criteria or check back later for new opportunities.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value='profile'>
            <Card className='bg-gray-800/50 border-gray-700'>
              <CardHeader>
                <CardTitle className='text-white'>Technical Expert Profile</CardTitle>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='text-center py-12'>
                  <Users className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-white font-semibold mb-2'>Complete Your Profile</h3>
                  <p className='text-gray-400 mb-6'>
                    Set up your technical expertise profile to get matched with relevant
                    opportunities
                  </p>
                  <Button className='bg-gradient-to-r from-blue-500 to-blue-600'>
                    Create Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value='applications'>
            <Card className='bg-gray-800/50 border-gray-700'>
              <CardHeader>
                <CardTitle className='text-white'>My Applications</CardTitle>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='text-center py-12'>
                  <Star className='w-16 h-16 text-gray-400 mx-auto mb-4' />
                  <h3 className='text-white font-semibold mb-2'>No Applications Yet</h3>
                  <p className='text-gray-400 mb-6'>
                    Start applying to opportunities to track your applications here
                  </p>
                  <Button
                    onClick={() => setActiveTab('opportunities')}
                    className='bg-gradient-to-r from-blue-500 to-blue-600'
                  >
                    Browse Opportunities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}