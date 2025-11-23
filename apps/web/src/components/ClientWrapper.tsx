'use client';

import { AuthProvider } from '@/contexts/AuthContext';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  // ClientWrapper previously wrapped children with AuthProvider. To keep a
  // single global AuthProvider instance, the wrapper now just forwards
  // children without adding another provider.
  return <>{children}</>;
}