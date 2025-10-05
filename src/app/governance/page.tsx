'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WomensParticipationDashboard } from '@/components/WomensParticipationDashboard';
import { ArrowLeft, CheckCircle, Heart, Users, Vote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GovernancePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('proposals');

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6'>
      <div className='flex items-center space-x-4 mb-6'>
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
          <h1 className='text-2xl font-bold text-white'>DAO Governance</h1>
          <p className='text-gray-400'>Participate in community decision-making</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
        <TabsList className='grid w-full grid-cols-3 bg-gray-800/50 border-gray-700'>
          <TabsTrigger value='proposals' className='data-[state=active]:bg-blue-600'>
            <Vote className='w-4 h-4 mr-2' />
            Proposals
          </TabsTrigger>
          <TabsTrigger value='diversity' className='data-[state=active]:bg-pink-600'>
            <Heart className='w-4 h-4 mr-2' />
            Women's Participation
          </TabsTrigger>
          <TabsTrigger value='members' className='data-[state=active]:bg-green-600'>
            <Users className='w-4 h-4 mr-2' />
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value='proposals' className='space-y-6'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 space-y-6'>
              <Card className='bg-gray-800/50 border-gray-700'>
                <CardHeader>
                  <CardTitle className='text-white'>Active Proposals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='p-4 border border-gray-600 rounded-lg'>
                      <div className='flex items-center justify-between mb-2'>
                        <h3 className='text-white font-semibold'>Solar Farm Expansion - Phase 3</h3>
                        <Badge variant='outline' className='text-green-400 border-green-400'>
                          Active
                        </Badge>
                      </div>
                      <p className='text-gray-400 text-sm mb-3'>
                        Proposal to expand solar capacity by 2MW in Urgam Valley with community
                        funding.
                      </p>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-4 text-sm'>
                          <span className='text-gray-400'>Votes: 847/1200</span>
                          <span className='text-gray-400'>Ends: 2 days</span>
                        </div>
                        <Button size='sm' className='bg-blue-600 hover:bg-blue-700'>
                          Vote
                        </Button>
                      </div>
                    </div>

                    <div className='p-4 border border-gray-600 rounded-lg'>
                      <div className='flex items-center justify-between mb-2'>
                        <h3 className='text-white font-semibold'>
                          Women's Participation Quota Update
                        </h3>
                        <Badge variant='outline' className='text-pink-400 border-pink-400'>
                          Active
                        </Badge>
                      </div>
                      <p className='text-gray-400 text-sm mb-3'>
                        Increase women's participation quota from 33% to 40% to enhance gender
                        balance in governance.
                      </p>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-4 text-sm'>
                          <span className='text-gray-400'>Votes: 923/1200</span>
                          <span className='text-gray-400'>Ends: 4 days</span>
                        </div>
                        <Button size='sm' className='bg-pink-600 hover:bg-pink-700'>
                          Vote
                        </Button>
                      </div>
                    </div>

                    <div className='p-4 border border-gray-600 rounded-lg'>
                      <div className='flex items-center justify-between mb-2'>
                        <h3 className='text-white font-semibold'>Community Treasury Allocation</h3>
                        <Badge variant='outline' className='text-yellow-400 border-yellow-400'>
                          Pending
                        </Badge>
                      </div>
                      <p className='text-gray-400 text-sm mb-3'>
                        Allocate 15% of treasury for education and training programs.
                      </p>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-4 text-sm'>
                          <span className='text-gray-400'>Votes: 1156/1200</span>
                          <span className='text-gray-400'>Ends: 5 days</span>
                        </div>
                        <Button
                          size='sm'
                          variant='outline'
                          className='border-gray-600 text-gray-300'
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className='space-y-6'>
              <Card className='bg-gray-800/50 border-gray-700'>
                <CardHeader>
                  <CardTitle className='text-white'>Governance Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Total Members</span>
                      <span className='text-white font-semibold'>1,247</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Women Members</span>
                      <span className='text-pink-400 font-semibold'>487 (39%)</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Active Proposals</span>
                      <span className='text-white font-semibold'>12</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>Participation Rate</span>
                      <span className='text-green-400 font-semibold'>87%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-gray-800/50 border-gray-700'>
                <CardHeader>
                  <CardTitle className='text-white flex items-center'>
                    <Vote className='w-5 h-5 mr-2 text-blue-400' />
                    Your Voting Power
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    <div className='text-center'>
                      <div className='text-3xl font-bold text-white'>15</div>
                      <div className='text-sm text-gray-400'>Voting Power</div>
                    </div>
                    <div className='space-y-2 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Base Power</span>
                        <span className='text-white'>5</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Membership Bonus</span>
                        <span className='text-white'>5</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Mentorship Bonus</span>
                        <span className='text-pink-400'>5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-gray-800/50 border-gray-700'>
                <CardHeader>
                  <CardTitle className='text-white'>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-4 h-4 text-green-400 flex-shrink-0' />
                      <div className='text-sm'>
                        <div className='text-white'>Updated Gender Identity</div>
                        <div className='text-gray-400'>2 days ago</div>
                      </div>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-4 h-4 text-pink-400 flex-shrink-0' />
                      <div className='text-sm'>
                        <div className='text-white'>Joined Mentorship Program</div>
                        <div className='text-gray-400'>1 week ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value='diversity'>
          <WomensParticipationDashboard />
        </TabsContent>

        <TabsContent value='members'>
          <Card className='bg-gray-800/50 border-gray-700'>
            <CardHeader>
              <CardTitle className='text-white'>DAO Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                <div className='p-4 border border-gray-600 rounded-lg'>
                  <div className='flex items-center space-x-3 mb-3'>
                    <div className='w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center'>
                      <span className='text-white text-sm font-bold'>A</span>
                    </div>
                    <div>
                      <div className='text-white font-medium'>Aarti Sharma</div>
                      <div className='text-gray-400 text-xs'>Solar Engineer</div>
                    </div>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-400'>Contribution Score</span>
                    <span className='text-white'>127</span>
                  </div>
                  <div className='mt-2'>
                    <Badge variant='outline' className='text-pink-400 border-pink-400'>
                      Mentor
                    </Badge>
                  </div>
                </div>

                <div className='p-4 border border-gray-600 rounded-lg'>
                  <div className='flex items-center space-x-3 mb-3'>
                    <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center'>
                      <span className='text-white text-sm font-bold'>R</span>
                    </div>
                    <div>
                      <div className='text-white font-medium'>Raj Patel</div>
                      <div className='text-gray-400 text-xs'>Community Leader</div>
                    </div>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-gray-400'>Contribution Score</span>
                    <span className='text-white'>98</span>
                  </div>
                  <div className='mt-2'>
                    <Badge variant='outline' className='text-blue-400 border-blue-400'>
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
