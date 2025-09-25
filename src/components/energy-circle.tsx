"use client";

import { cn } from '@/lib/utils';

interface EnergyCircleProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export function EnergyCircle({ 
  percentage, 
  size = 'md', 
  className,
  showLabel = true 
}: EnergyCircleProps) {
  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  };

  const innerSizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const fontSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div 
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(
            #ff9900 0deg ${percentage * 1.2}deg,
            #ffffff ${percentage * 1.2}deg ${percentage * 2.4}deg,
            #138808 ${percentage * 2.4}deg ${percentage * 3.6}deg,
            #1f2937 ${percentage * 3.6}deg 360deg
          )`
        }}
      />
      <div className={cn("absolute inset-2 rounded-full bg-gray-900 flex items-center justify-center", innerSizeClasses[size])}>
        <div className="text-center">
          <div className={cn("font-bold text-white flag-glow", fontSizeClasses[size])}>
            {percentage}%
          </div>
          {showLabel && (
            <div className="text-xs text-gray-300">ACTIVE</div>
          )}
        </div>
      </div>
    </div>
  );
}