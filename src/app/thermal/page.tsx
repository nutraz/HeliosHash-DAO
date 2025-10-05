'use client';

import { ThermalManagementDashboard } from '@/components/ThermalManagementDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ThermalMonitoringPage() {
  const router = useRouter();

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
          <h1 className='text-2xl font-bold text-white'>Thermal Monitoring</h1>
          <p className='text-gray-400'>Real-time thermal management for solar infrastructure</p>
        </div>
      </div>

      <div className='bg-white rounded-lg p-6'>
        <ThermalManagementDashboard />
      </div>
    </div>
  );
}
