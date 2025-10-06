'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RewardItemProps {
  icon: string;
  name: string;
  description: string;
  cost: string;
  gradient?: string;
  className?: string;
  onClick?: () => void;
}

const defaultGradients = {
  red: 'from-red-600 to-red-700',
  blue: 'from-blue-600 to-blue-700',
  orange: 'from-orange-600 to-orange-700',
  purple: 'from-purple-600 to-purple-700',
  green: 'from-green-600 to-green-700',
};

export function RewardItem({
  icon,
  name,
  description,
  cost,
  gradient = 'blue',
  className,
  onClick,
}: RewardItemProps) {
  const gradientClass =
    defaultGradients[gradient as keyof typeof defaultGradients] || defaultGradients.blue;

  return (
    <Card
      className={cn('card-readable hover:bg-gray-700 transition-all cursor-pointer', className)}
      onClick={onClick}
    >
      <CardContent className='p-4'>
        <div className='flex items-center gap-4'>
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center text-white',
              `bg-gradient-to-br ${gradientClass}`
            )}
          >
            {icon}
          </div>
          <div className='flex-1'>
            <h4 className='font-semibold text-white'>{name}</h4>
            <p className='text-sm text-gray-300'>{description}</p>
          </div>
          <Badge variant='secondary' className='bg-gray-700 text-white'>
            {cost}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
