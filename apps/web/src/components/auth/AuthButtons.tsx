"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AuthButtons() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <div className="flex items-center space-x-2">
      {user ? (
        <>
          <button
            onClick={() => {
              logout();
              router.replace('/auth/signin');
            }}
            className="text-sm px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700"
          >
            Sign out
          </button>
        </>
      ) : (
        <>
          <button onClick={() => router.push('/auth/signin')} className="text-sm px-3 py-2 rounded-lg bg-white text-blue-600">Sign in</button>
        </>
      )}
    </div>
  );
}
