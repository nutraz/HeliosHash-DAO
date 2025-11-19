"use client";

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import ClientLogin from '@/components/auth/ClientLogin';

export default function SignInPage() {
  return (
    <AuthProvider>
      <ClientLogin />
    </AuthProvider>
  );
}
