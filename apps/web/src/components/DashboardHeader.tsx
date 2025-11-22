'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/lib/theme';
import { useRouter } from 'next/navigation';
import { Sun, Moon, LogOut } from 'lucide-react';
import NFTCollectionButton from './hhdao/NFTCollectionButton';

export default function DashboardHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const getAvatarInitials = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.principal) {
      return user.principal.charAt(0).toUpperCase();
    }
    return '?';
  };

  const getDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.principal) {
      return `${user.principal.slice(0, 8)}...${user.principal.slice(-6)}`;
    }
    return 'Anonymous';
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {/* PFP Avatar */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {user?.avatar ? (
              <img src={user.avatar} alt={getDisplayName()} className="w-full h-full rounded-full object-cover" />
            ) : (
              getAvatarInitials()
            )}
          </div>
          {isAuthenticated && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
          )}
        </div>

        {/* User Info */}
        <div>
          <h1 className="text-2xl font-bold">HHDAO Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{getDisplayName()}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* NFT Collection Button */}
        <NFTCollectionButton />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-gray-700" />}
        </button>

        {/* Logout Button */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
