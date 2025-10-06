'use client';

import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface HomeButtonProps {
  className?: string;
  variant?: 'floating' | 'inline';
}

export function HomeButton({ className, variant = 'floating' }: HomeButtonProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show on home page
  if (pathname === '/') return null;

  const handleHomeClick = () => {
    router.push('/');
  };

  if (variant === 'floating') {
    return (
      <Button
        onClick={handleHomeClick}
        className={cn(
          'fixed top-4 left-4 z-50 rounded-full',
          'floating-home-btn text-white',
          'transition-all duration-300 transform',
          'border-2 border-white/30 backdrop-blur-sm',
          'w-12 h-12 p-0 flex items-center justify-center',
          'hover:border-white/50',
          className
        )}
        title='Go to Home'
      >
        <Home className='w-5 h-5' />
      </Button>
    );
  }

  return (
    <Button
      onClick={handleHomeClick}
      variant='outline'
      className={cn(
        'gap-2 border-orange-500/50 text-orange-400 hover:bg-orange-500/10',
        'flag-glow',
        className
      )}
    >
      <Home className='w-4 h-4' />
      Home
    </Button>
  );
}
