'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

/**
 * Renders a full-page global error UI with retry and homepage actions.
 *
 * Displays an error title, description, optional "Error ID" when `error.digest` is present,
 * and buttons to retry (calls `reset`) or navigate to the homepage. The received `error`
 * is logged to the console when the component mounts or when the `error` changes.
 *
 * @param error - The error object; may include an optional `digest` string shown as an error ID.
 * @param reset - Callback invoked when the user clicks the "Try Again" button.
 * @returns The rendered global error page element.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6'>
          <Card className='bg-gray-800/50 border-gray-700 max-w-md w-full'>
            <CardHeader className='text-center'>
              <div className='mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4'>
                <AlertTriangle className='w-8 h-8 text-red-400' />
              </div>
              <CardTitle className='text-white text-2xl'>Something went wrong</CardTitle>
              <CardDescription className='text-gray-400'>
                An unexpected error occurred. This has been logged for investigation.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {error.digest && (
                <div className='text-xs text-gray-500 font-mono bg-gray-900/50 p-2 rounded'>
                  Error ID: {error.digest}
                </div>
              )}
              <div className='flex flex-col sm:flex-row gap-3'>
                <Button
                  onClick={reset}
                  variant='outline'
                  className='flex-1 border-gray-600 text-gray-300 hover:bg-gray-700'
                >
                  <RefreshCw className='w-4 h-4 mr-2' />
                  Try Again
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
      </body>
    </html>
  );
}