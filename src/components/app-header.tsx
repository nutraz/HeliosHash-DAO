'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuthContext';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  userName?: string;
  userLevel?: string;
  stats?: {
    label: string;
    value: string;
  }[];
  className?: string;
  showLogo?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  userName = 'Raj',
  userLevel = 'Solar Pioneer • Level 3',
  stats,
  className,
  showLogo = false,
}: AppHeaderProps) {
  const { isAuthenticated, logout } = useAuth();
  // Language state (simple demo, replace with i18n logic as needed)
  const [lang, setLang] = React.useState('en');
  return (
    <Card
      className={cn(
        'bg-gradient-to-r from-blue-700 to-blue-600 border-0 rounded-2xl p-6 relative overflow-hidden',
        className
      )}
    >
      <div className='absolute inset-0 bg-gradient-to-br from-white/10 to-transparent animate-pulse'></div>
      <div className='relative z-10'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-4'>
            <Avatar className='w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600'>
              <AvatarFallback>⚡</AvatarFallback>
            </Avatar>
            <div>
              <h2 className='text-xl font-bold text-white'>
                {userName ? `Welcome, ${userName}!` : title}
              </h2>
              {userLevel && (
                <Badge variant='secondary' className='bg-white/20 text-white border-white/20'>
                  {userLevel}
                </Badge>
              )}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Select value={lang} onValueChange={setLang}>
              <SelectTrigger className='bg-white/20 text-white border-white/40 min-w-[90px]'>
                <SelectValue>
                  {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'ગુજરાતી'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='en'>English</SelectItem>
                <SelectItem value='hi'>हिंदी</SelectItem>
                <SelectItem value='gu'>ગુજરાતી</SelectItem>
              </SelectContent>
            </Select>
            {isAuthenticated && (
              <Button
                variant='outline'
                className='text-white border-white/40 hover:bg-white/10'
                onClick={logout}
              >
                Log Out
              </Button>
            )}
            {showLogo && (
              <div className='w-10 h-10 relative'>
                <Image
                  src='/1logo no background.svg'
                  alt='HeliosHash DAO Logo'
                  fill
                  className='object-contain'
                />
              </div>
            )}
          </div>
        </div>

        {stats && (
          <div className='grid grid-cols-3 gap-3 mt-4'>
            {stats.map((stat, index) => (
              <Card key={index} className='bg-white/20 border-white/30'>
                <CardContent className='p-3 text-center'>
                  <div className='text-lg font-bold text-white'>{stat.value}</div>
                  <div className='text-xs text-white/90'>{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {subtitle && <p className='text-sm text-white/90 mt-2'>{subtitle}</p>}
      </div>
    </Card>
  );
}
