'use client';

import { ApplicationForm } from '@/components/ApplicationForm';
import { MyApplications } from '@/components/MyApplications';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApplicationType } from '@/services/applicationService';
import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';

interface ApplicationsPageProps {
  onBack?: () => void;
  userName?: string;
}

type PageView = 'list' | 'form';

export function ApplicationsPage({ onBack, userName }: ApplicationsPageProps) {
  const [currentView, setCurrentView] = useState<PageView>('list');
  const [selectedApplicationType, setSelectedApplicationType] = useState<
    ApplicationType | undefined
  >();

  const handleNewApplication = (applicationType?: ApplicationType) => {
    setSelectedApplicationType(applicationType);
    setCurrentView('form');
  };

  const handleApplicationSubmitted = (applicationId: number) => {
    console.log('Application submitted with ID:', applicationId);
    // Show success notification
    alert(
      `Application submitted successfully! Your application ID is ${applicationId}. You can track its progress in the applications list.`
    );
    setCurrentView('list');
    setSelectedApplicationType(undefined);
  };

  const handleCancel = () => {
    setCurrentView('list');
    setSelectedApplicationType(undefined);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
      {currentView === 'list' ? (
        <div className='p-6'>
          <div className='max-w-7xl mx-auto'>
            {/* Header */}
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-4'>
                {onBack && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={onBack}
                    className='flex items-center gap-2'
                  >
                    <ArrowLeft className='w-4 h-4' />
                    Back to Dashboard
                  </Button>
                )}
                <div>
                  <h1 className='text-2xl font-bold text-white'>My Applications</h1>
                  <p className='text-gray-400'>Manage your HHDAO applications and track progress</p>
                </div>
              </div>
            </div>

            {/* Quick Application Options */}
            <Card className='bg-gray-800/50 border-gray-700 mb-6'>
              <CardHeader>
                <CardTitle className='text-white text-lg flex items-center'>
                  <Plus className='w-5 h-5 mr-2' />
                  Quick Application Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                  <Button
                    onClick={() => handleNewApplication({ LandPartner: null })}
                    className='bg-green-600 hover:bg-green-700 h-16 flex flex-col gap-1'
                  >
                    <div className='font-semibold'>Land Partner</div>
                    <div className='text-xs opacity-80'>Offer your land</div>
                  </Button>
                  <Button
                    onClick={() => handleNewApplication({ TechCollaborator: null })}
                    className='bg-blue-600 hover:bg-blue-700 h-16 flex flex-col gap-1'
                  >
                    <div className='font-semibold'>Tech Collaborator</div>
                    <div className='text-xs opacity-80'>Share your skills</div>
                  </Button>
                  <Button
                    onClick={() => handleNewApplication({ CommunityContributor: null })}
                    className='bg-purple-600 hover:bg-purple-700 h-16 flex flex-col gap-1'
                  >
                    <div className='font-semibold'>Community Role</div>
                    <div className='text-xs opacity-80'>Local opportunities</div>
                  </Button>
                  <Button
                    onClick={() => handleNewApplication({ Investor: null })}
                    className='bg-yellow-600 hover:bg-yellow-700 h-16 flex flex-col gap-1'
                  >
                    <div className='font-semibold'>Investor</div>
                    <div className='text-xs opacity-80'>Fund projects</div>
                  </Button>
                  <Button
                    onClick={() => handleNewApplication({ Vendor: null })}
                    className='bg-orange-600 hover:bg-orange-700 h-16 flex flex-col gap-1'
                  >
                    <div className='font-semibold'>Vendor</div>
                    <div className='text-xs opacity-80'>Provide services</div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Applications List */}
            <MyApplications onNewApplication={() => handleNewApplication()} />
          </div>
        </div>
      ) : (
        <ApplicationForm
          onSubmit={handleApplicationSubmitted}
          onCancel={handleCancel}
          initialType={selectedApplicationType}
        />
      )}
    </div>
  );
}
