'use client'; // Add this at the top

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SplashScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate loading process
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 3000); // 3 seconds splash screen

    return () => clearTimeout(timer);
  }, [router]);

  if (!isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-blue-900">HH</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">HeliosHash DAO</h1>
        <p className="text-xl mb-8 max-w-md mx-auto">
          Decentralized renewable energy management platform
        </p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;