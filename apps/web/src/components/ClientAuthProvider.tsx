'use client';

import { useEffect, useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

export default function ClientAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Always render children, but only wrap with AuthProvider on client
  return isClient ? <AuthProvider>{children}</AuthProvider> : <>{children}</>;
}