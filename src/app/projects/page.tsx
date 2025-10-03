// === Enhanced Solar Projects Management ===
// Interactive map, real-time data, applications, and community integration

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Filter, MapPin, Plus, Search, Users, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SolarProject } from '../../types/enhanced-solar-project';

type ViewMode = 'map' | 'list' | 'detail' | 'energy' | 'applications';

interface SimpleSolarProject {
  id: number;
  name: string;
  location: string;
  capacity: string;
  status: string;
  progress: number;
  participants: number;
  startDate: string;
  estimatedReturn: string;
  investment: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedProject, setSelectedProject] = useState<SolarProject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const mockProjects: SimpleSolarProject[] = [
    {
      id: 1,
      name: 'Mumbai Solar Grid Extension',
      location: 'Mumbai, Maharashtra',
      capacity: '50 MW',
      status: 'Active',
      progress: 85,
      participants: 1250,
      startDate: '2024-01-15',
      estimatedReturn: '12%',
      investment: '₹2,50,00,000',
    },
    {
      id: 2,
      name: 'Rajasthan Desert Solar Farm',
      location: 'Jodhpur, Rajasthan',
      capacity: '100 MW',
      status: 'Funding',
      progress: 45,
      participants: 780,
      startDate: '2024-03-01',
      estimatedReturn: '15%',
      investment: '₹5,00,00,000',
    },
    {
      id: 3,
      name: 'Kerala Coastal Wind-Solar Hybrid',
      location: 'Kochi, Kerala',
      capacity: '75 MW',
      status: 'Planning',
      progress: 25,
      participants: 420,
      startDate: '2024-05-01',
      estimatedReturn: '13%',
      investment: '₹3,75,00,000',
    },
    {
      id: 4,
      name: 'Punjab Agricultural Solar',
      location: 'Ludhiana, Punjab',
      capacity: '30 MW',
      status: 'Completed',
      progress: 100,
      participants: 950,
      startDate: '2023-08-15',
      estimatedReturn: '11%',
      investment: '₹1,50,00,000',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'Funding':
        return 'bg-yellow-500';
      case 'Planning':
        return 'bg-blue-500';
      case 'Completed':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredProjects = mockProjects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6'>
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
            <h1 className='text-2xl font-bold text-white'>Solar Projects</h1>
            <p className='text-gray-400'>Community-driven solar infrastructure initiatives</p>
          </div>
        </div>
        <div className='flex flex-wrap gap-3'>
          <Button
            className='bg-gradient-to-r from-orange-500 to-red-500'
            onClick={() => router.push('/projects/create')}
          >
            <Plus className='w-4 h-4 mr-2' />
            Create Project
          </Button>
          <Button
            variant='outline'
            className='border-blue-500 text-blue-400 hover:bg-blue-500/10'
            onClick={() => router.push('/partnerships/apply')}
          >
            🤝 Apply as Partner
          </Button>
          <Button
            variant='outline'
            className='border-green-500 text-green-400 hover:bg-green-500/10'
            onClick={() => router.push('/collaborate')}
          >
            💡 Collaborate
          </Button>
          <Button
            variant='outline'
            className='border-purple-500 text-purple-400 hover:bg-purple-500/10'
            onClick={() => router.push('/contribute')}
          >
            💰 Contribute
          </Button>
        </div>
      </div>

      {/* User Participation Options */}
      <Card className='bg-gray-800/50 border-gray-700 mb-6'>
        <CardHeader>
          <CardTitle className='text-white'>How would you like to participate?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg'>
              <div className='text-orange-400 text-2xl mb-2'>🏗️</div>
              <h3 className='text-white font-semibold mb-1'>Project Owner</h3>
              <p className='text-gray-400 text-sm mb-3'>
                Start your own solar project and lead the initiative
              </p>
              <Button
                size='sm'
                className='w-full bg-orange-500 hover:bg-orange-600'
                onClick={() => router.push('/projects/create')}
              >
                Create Project
              </Button>
            </div>

            <div className='p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg'>
              <div className='text-blue-400 text-2xl mb-2'>🤝</div>
              <h3 className='text-white font-semibold mb-1'>Land Partner</h3>
              <p className='text-gray-400 text-sm mb-3'>Offer your land for solar installations</p>
              <Button
                size='sm'
                variant='outline'
                className='w-full border-blue-500 text-blue-400'
                onClick={() => router.push('/partnerships/apply')}
              >
                Apply as Partner
              </Button>
            </div>

            <div className='p-4 bg-green-500/10 border border-green-500/20 rounded-lg'>
              <div className='text-green-400 text-2xl mb-2'>💡</div>
              <h3 className='text-white font-semibold mb-1'>Technical Expert</h3>
              <p className='text-gray-400 text-sm mb-3'>Collaborate with expertise and services</p>
              <Button
                size='sm'
                variant='outline'
                className='w-full border-green-500 text-green-400'
                onClick={() => router.push('/collaborate')}
              >
                Collaborate
              </Button>
            </div>

            <div className='p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg'>
              <div className='text-purple-400 text-2xl mb-2'>💰</div>
              <h3 className='text-white font-semibold mb-1'>Investor</h3>
              <p className='text-gray-400 text-sm mb-3'>Fund projects and earn returns</p>
              <Button
                size='sm'
                variant='outline'
                className='w-full border-purple-500 text-purple-400'
                onClick={() => router.push('/contribute')}
              >
                Contribute
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className='flex items-center space-x-4 mb-6'>
        <div className='relative flex-1 max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <Input
            placeholder='Search projects by name or location...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10 bg-gray-800/50 border-gray-700 text-white'
          />
        </div>
        <Button variant='outline' className='border-gray-600 text-gray-300'>
          <Filter className='w-4 h-4 mr-2' />
          Filter
        </Button>
      </div>

      <Tabs defaultValue='all' className='space-y-6'>
        <TabsList className='bg-gray-800/50 border-gray-700'>
          <TabsTrigger value='all'>All Projects</TabsTrigger>
          <TabsTrigger value='my-investments'>My Investments</TabsTrigger>
          <TabsTrigger value='funding'>Funding Stage</TabsTrigger>
        </TabsList>

        <TabsContent value='all'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className='bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer'
              >
                <CardHeader className='pb-3'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <CardTitle className='text-lg text-white mb-1'>{project.name}</CardTitle>
                      <div className='flex items-center text-sm text-gray-400'>
                        <MapPin className='w-4 h-4 mr-1' />
                        {project.location}
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(project.status)} text-white`}>
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className='space-y-4'>
                  {/* Progress Bar */}
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-gray-400'>Progress</span>
                      <span className='text-white'>{project.progress}%</span>
                    </div>
                    <div className='w-full bg-gray-700 rounded-full h-2'>
                      <div
                        className='bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all'
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div className='flex items-center'>
                      <Zap className='w-4 h-4 text-yellow-400 mr-2' />
                      <div>
                        <div className='text-gray-400'>Capacity</div>
                        <div className='text-white font-semibold'>{project.capacity}</div>
                      </div>
                    </div>
                    <div className='flex items-center'>
                      <Users className='w-4 h-4 text-blue-400 mr-2' />
                      <div>
                        <div className='text-gray-400'>Participants</div>
                        <div className='text-white font-semibold'>{project.participants}</div>
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div>
                      <div className='text-gray-400'>Investment</div>
                      <div className='text-white font-semibold'>{project.investment}</div>
                    </div>
                    <div>
                      <div className='text-gray-400'>Est. Return</div>
                      <div className='text-green-400 font-semibold'>{project.estimatedReturn}</div>
                    </div>
                  </div>

                  <div className='flex items-center text-sm text-gray-400'>
                    <Calendar className='w-4 h-4 mr-2' />
                    Started: {new Date(project.startDate).toLocaleDateString()}
                  </div>

                  <Button className='w-full mt-4' variant='outline'>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value='my-investments'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {filteredProjects
              .filter((p) => p.id <= 2)
              .map((project) => (
                <Card key={project.id} className='bg-gray-800/50 border-gray-700'>
                  <CardHeader>
                    <div className='flex justify-between items-start'>
                      <div>
                        <CardTitle className='text-white'>{project.name}</CardTitle>
                        <p className='text-gray-400 text-sm'>{project.location}</p>
                      </div>
                      <Badge className='bg-green-500 text-white'>Invested</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Your Investment</span>
                        <span className='text-white font-semibold'>₹50,000</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Current Value</span>
                        <span className='text-green-400 font-semibold'>₹56,000</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Return</span>
                        <span className='text-green-400 font-semibold'>+12%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value='funding'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredProjects
              .filter((p) => p.status === 'Funding')
              .map((project) => (
                <Card key={project.id} className='bg-gray-800/50 border-gray-700'>
                  <CardHeader>
                    <CardTitle className='text-white'>{project.name}</CardTitle>
                    <p className='text-gray-400 text-sm'>{project.location}</p>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div className='text-center'>
                        <div className='text-2xl font-bold text-white'>₹2,25,00,000</div>
                        <div className='text-sm text-gray-400'>Raised so far</div>
                        <div className='w-full bg-gray-700 rounded-full h-2 mt-2'>
                          <div className='bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full w-[45%]' />
                        </div>
                        <div className='text-sm text-gray-400 mt-1'>45% of ₹5,00,00,000 goal</div>
                      </div>
                      <Button className='w-full bg-gradient-to-r from-orange-500 to-red-500'>
                        Invest Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Project Statistics */}
      <Card className='bg-gray-800/50 border-gray-700 mt-8'>
        <CardHeader>
          <CardTitle className='text-white'>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>4</div>
              <div className='text-sm text-gray-400'>Total Projects</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>255 MW</div>
              <div className='text-sm text-gray-400'>Total Capacity</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>3,400+</div>
              <div className='text-sm text-gray-400'>Participants</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>₹12.75Cr</div>
              <div className='text-sm text-gray-400'>Total Investment</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
