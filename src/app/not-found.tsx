import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * Render a full-screen 404 page with a styled card, navigation actions, and branding.
 *
 * @returns A JSX element displaying a "Page Not Found" view with "Go Back" and "Homepage" buttons and HeliosHash DAO branding.
 */
export default function NotFound() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6'>
      <Card className='bg-gray-800/50 border-gray-700 max-w-md w-full'>
        <CardHeader className='text-center'>
          <div className='mx-auto w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-4'>
            <span className='text-orange-400 text-2xl font-bold'>404</span>
          </div>
          <CardTitle className='text-white text-2xl'>Page Not Found</CardTitle>
          <CardDescription className='text-gray-400'>
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='text-center text-sm text-gray-400'>
            <p>You might want to check the URL or return to the homepage.</p>
          </div>
          <div className='flex flex-col sm:flex-row gap-3'>
            <Button
              asChild
              variant='outline'
              className='flex-1 border-gray-600 text-gray-300 hover:bg-gray-700'
            >
              <Link href='javascript:history.back()'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Go Back
              </Link>
            </Button>
            <Button
              asChild
              className='flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
            >
              <Link href='/'>
                <Home className='w-4 h-4 mr-2' />
                Homepage
              </Link>
            </Button>
          </div>

          {/* HeliosHash DAO branding */}
          <div className='text-center pt-4 border-t border-gray-700'>
            <p className='text-xs text-gray-500'>
              HeliosHash DAO - 50kW Solar Co-ownership Platform
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}