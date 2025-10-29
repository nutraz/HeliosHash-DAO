'use client'
import MultiAuthOptions from '@/components/MultiAuthOptions'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuth()

  const handleAuth = async (provider: string) => {
    try {
      await login(provider)
      // After successful registration/login, redirect to dashboard
      router.push('/dashboard')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <MultiAuthOptions onAuth={handleAuth} />
    </main>
  );
}
