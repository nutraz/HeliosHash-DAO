"use client";
export const dynamic = 'force-dynamic';

import MultiAuthOptions from '@/components/MultiAuthOptions';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const handleAuth = async (provider: string) => {
    try {
      await login(provider)
      // After successful login, redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
      <MultiAuthOptions onAuth={handleAuth} />
    </main>
  );
}
