'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CheckCircle, Heart, Users, Vote } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Renders the DAO governance page with a header, tabbed sections, and summary cards for proposals, voting power, and recent activity.
 *
 * The component includes a back navigation control, three tabs ("Proposals", "Women's Participation", "Members"), a list of active proposals with actions, and sidebar cards showing the user's voting power and recent activity.
 *
 * @returns A React element representing the governance interface with tabbed content, proposal entries, voting power breakdown, and recent activity items.
 */
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
                        <Button size='sm' className='bg-gradient-to-r from-green-500 to-blue-500'>
                          Vote Now
                        </Button>
                      </div>
                    </div>

                    <div className='p-4 border border-gray-600 rounded-lg'>
                      <div className='flex items-center justify-between mb-2'>
                        <h3 className='text-white font-semibold'>Energy Storage Initiative</h3>
                        <Badge variant='outline' className='text-yellow-400 border-yellow-400'>
                          Review
                        </Badge>
                      </div>
                      <p className='text-gray-400 text-sm mb-3'>
                        Implementation of battery storage systems for grid stability and backup
                        power.
                      </p>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-4 text-sm'>
                          <span className='text-gray-400'>Votes: 234/1200</span>
                          <span className='text-gray-400'>Ends: 5 days</span>
                        </div>
                        <Button size='sm' variant='outline'>
                          View Details
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
                        <span className='text-gray-400'>Energy Contribution</span>
                        <span className='text-white'>5</span>
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
                        <div className='text-white'>Voted on Proposal #42</div>
                        <div className='text-gray-400'>2 days ago</div>
                      </div>
                    </div>
                    <div className='flex items-center space-x-3'>
                      <CheckCircle className='w-4 h-4 text-green-400 flex-shrink-0' />
                      <div className='text-sm'>
                        <div className='text-white'>Created Proposal #41</div>
                        <div className='text-gray-400'>1 week ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}