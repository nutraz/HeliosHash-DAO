"use client";

import React from 'react';
import { AuthProvider } from '@/context/AuthContext';
import ClientRegister from '@/components/auth/ClientRegister';

export default function SignUpPage() {
  return (
    <AuthProvider>
      <ClientRegister />
    </AuthProvider>
  );
}
