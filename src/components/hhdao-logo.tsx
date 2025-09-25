"use client";

import Image from 'next/image';
import { HHDAO_LOGO_PATH, HHDAO_LOGO_ALT } from '@/lib/constants';

interface HHDAOLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean;
}

export function HHDAOLogo({ size = 'md', className = "", showText = false }: HHDAOLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <Image 
          src={HHDAO_LOGO_PATH} 
          alt={HHDAO_LOGO_ALT} 
          fill
          className="object-contain"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-white ${textSizeClasses[size]}`}>HHDAO</span>
          {size === 'lg' && (
            <span className="text-xs text-gray-400">HeliosHash DAO</span>
          )}
        </div>
      )}
    </div>
  );
}