'use client';

import { useEffect, useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

export default function ClientAuthProvider({ children }: { children: React.ReactNode }) {
  // This component no longer wraps with AuthProvider to avoid duplicate
  // providers. It simply renders its children (kept as a client component
  // for parity with previous behavior).
  return <>{children}</>;
}