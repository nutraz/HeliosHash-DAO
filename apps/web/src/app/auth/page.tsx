"use client";

import dynamic from 'next/dynamic';
import HiIDAOFusion from '../hiidao-fusion/HiIDAOFusion';

export default function AuthPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Multi-Auth Login</h2>
      <div>
        {/* Reuse existing HiIDAOFusion login modal and flows */}
        <HiIDAOFusion />
      </div>
    </div>
  );
}
"use client";

import React from 'react';
import AuthPageComponent from '@/components/auth/AuthPage';

export default function Page() {
  return <AuthPageComponent />;
}
