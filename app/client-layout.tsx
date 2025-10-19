'use client';

import { AuthProvider } from '@/hooks/useAuthContext';
import Header from '@/src/components/Header';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Header />
      {children}
    </AuthProvider>
  );
}
