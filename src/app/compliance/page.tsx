'use client';

import { IndiaComplianceDashboard } from '@/components/IndiaComplianceDashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CompliancePage() {
  const router = useRouter();

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center space-x-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.back()}
              className='text-gray-600 hover:text-gray-900'
            >
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Dashboard
            </Button>
            <div className='text-sm text-gray-500'>
              Real-time regulatory compliance for Baghpat operations
            </div>
          </div>
        </div>
      </div>

      <IndiaComplianceDashboard
        monthlyRevenue={8500000} // ₹85 lakh from Baghpat operations
        foreignInvestments={6000000} // ₹60 lakh US investment for solar equipment
        serviceRevenue={2500000} // ₹25 lakh from grid management and AI services
      />
    </div>
  );
}
