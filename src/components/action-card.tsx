'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionCardProps {
  icon: LucideIcon | string;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
  hasNotification?: boolean;
  pulse?: boolean;
}

export function ActionCard({
  icon: Icon,
  title,
  description,
  onClick,
  className,
  hasNotification = false,
  pulse = false,
}: ActionCardProps) {
  const isStringIcon = typeof Icon === 'string';

  return (
    <Card
      className={cn(
        'card-readable card-patriotic hover:bg-gray-700 transition-all cursor-pointer relative flag-glow',
        pulse && 'animate-pulse',
        className
      )}
      onClick={onClick}
    >
      <CardContent className='p-4'>
        <div className='mb-2'>
          {isStringIcon ? (
            <div className='text-2xl'>{Icon}</div>
          ) : (
            <Icon className='w-8 h-8 text-orange-300 flag-glow' />
          )}
        </div>
        <h3 className='font-semibold mb-1 text-white'>{title}</h3>
        <p className='text-xs text-gray-300'>{description}</p>
        {hasNotification && (
          <div className='absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full'></div>
        )}
      </CardContent>
    </Card>
  );
}
