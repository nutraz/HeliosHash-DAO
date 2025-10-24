'use client';

import { ValidationOpportunities } from '@/components/community/ValidationOpportunities';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ValidationSessions } from '@/components/validation/ValidationSessions';
import { ArrowLeft, Calendar, CheckCircle, Settings, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ValidationDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('sessions');

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => router.back()}
              className='flex items-center gap-2'
            >
              <ArrowLeft className='w-4 h-4' />
              Back
            </Button>
            <div>
              <h1 className='text-3xl font-bold text-white flex items-center gap-3'>
                <CheckCircle className='w-8 h-8 text-green-400' />
                Validation Dashboard
              </h1>
              <p className='text-gray-400 mt-1'>
                Manage your solar validation activities and earn OWP
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push('/settings')}
            variant='outline'
            className='flex items-center gap-2'
          >
            <Settings className='w-4 h-4' />
            Validation Settings
          </Button>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2 bg-gray-800 border-gray-700'>
            <TabsTrigger
              value='sessions'
              className='data-[state=active]:bg-blue-600 data-[state=active]:text-white'
            >
              <Calendar className='w-4 h-4 mr-2' />
              My Sessions
            </TabsTrigger>

            <TabsTrigger
              value='opportunities'
              className='data-[state=active]:bg-green-600 data-[state=active]:text-white'
            >
              <Users className='w-4 h-4 mr-2' />
              Find Opportunities
            </TabsTrigger>
          </TabsList>

          <TabsContent value='sessions' className='mt-6'>
            <ValidationSessions />
          </TabsContent>

          <TabsContent value='opportunities' className='mt-6'>
            <ValidationOpportunities
              onApply={(opportunityId, sessionType) => {
                console.log(`Applied for ${opportunityId} as ${sessionType}`);
                // Switch to sessions tab to see the new session
                setActiveTab('sessions');
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
