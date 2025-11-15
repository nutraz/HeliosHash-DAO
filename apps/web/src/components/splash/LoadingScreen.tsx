'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoadingScreenProps {
  readonly children?: ReactNode;
}

export default function LoadingScreen({ children }: LoadingScreenProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-orange-950 to-black">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-orange-500/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-orange-500 animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Loading HeliosHash DAO</h2>
          <p className="text-sm text-gray-400">Connecting to Internet Computer...</p>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : null;
}
