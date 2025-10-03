'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuthContext';
import { LogIn } from 'lucide-react';

/**
 * MiningSession gate component
 * Renders a login prompt ONLY when the user is NOT authenticated.
 * When authenticated it renders nothing (mining page content shows normally).
 */
export function MiningSession() {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <Card className='p-6 mb-8'>
        <div className='text-sm text-muted-foreground'>Checking authentication…</div>
      </Card>
    );
  }

  if (isAuthenticated) return null;

  const handleMockLogin = async () => {
    try {
      await login({ type: 'wallet', walletType: 'demo' });
    } catch (e) {
      console.error('Login failed', e);
    }
  };

  return (
    <Card className='p-8 mb-10 border-dashed border-2 border-primary/30 bg-muted/30'>
      <div className='space-y-4 text-center'>
        <h2 className='text-xl font-semibold'>Start New Mining Session</h2>
        <p className='text-sm text-muted-foreground max-w-md mx-auto'>
          You need to be logged in to initiate or monitor mining operations. Connect a wallet or use
          a demo login to explore features.
        </p>
        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
          <Button onClick={handleMockLogin} className='gap-2'>
            <LogIn className='h-4 w-4' /> Demo Wallet Login
          </Button>
          <Button variant='outline' onClick={() => handleMockLogin()} className='gap-2'>
            <LogIn className='h-4 w-4' /> Social / Other Login
          </Button>
        </div>
      </div>
    </Card>
  );
}
