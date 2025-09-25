"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  icon: string;
  label: string;
  hasNotification?: boolean;
}

interface BottomNavProps {
  activePage: string;
  onPageChange: (page: string) => void;
  className?: string;
}

const navItems: NavItem[] = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'mining', icon: '⛏️', label: 'Mining' },
  { id: 'community', icon: '👥', label: 'Community' },
  { id: 'partners', icon: '🤝', label: 'Partners' },
  { id: 'rewards', icon: '🎁', label: 'Rewards', hasNotification: true },
  { id: 'wallet', icon: '💳', label: 'Wallet' },
];

export function BottomNav({ activePage, onPageChange, className }: BottomNavProps) {
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 p-3",
      className
    )}>
      <div className="grid grid-cols-6 gap-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activePage === item.id ? 'default' : 'ghost'}
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 relative data-[state=active]:bg-blue-600 data-[state=active]:text-white",
              item.id === 'home' && "flag-glow bg-orange-500/20 border border-orange-500/30"
            )}
            onClick={() => onPageChange(item.id)}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
            {item.hasNotification && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}