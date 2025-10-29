'use client'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Public routes that don't require auth
    const publicRoutes = ['/splash', '/auth']
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!user?.isAuthenticated && !isPublicRoute) {
      // Redirect to splash if not authenticated and trying to access protected route
      router.push('/splash')
    } else if (user?.isAuthenticated && pathname === '/splash') {
      // If authenticated and on splash, redirect based on onboarding status
      if (!user?.hasCompletedOnboarding) {
        router.push('/onboarding')
      } else if (!user?.hasCompletedKYC) {
        router.push('/kyc')
      } else {
        router.push('/dashboard')
      }
    } else if (user?.isAuthenticated && pathname === '/auth') {
      // If authenticated and on auth page, redirect to appropriate next step
      if (!user?.hasCompletedOnboarding) {
        router.push('/onboarding')
      } else if (!user?.hasCompletedKYC) {
        router.push('/kyc')
      } else {
        router.push('/dashboard')
      }
    } else if (user?.isAuthenticated && pathname === '/onboarding' && user?.hasCompletedOnboarding) {
      // If already completed onboarding, redirect to next step
      if (!user?.hasCompletedKYC) {
        router.push('/kyc')
      } else {
        router.push('/dashboard')
      }
    } else if (user?.isAuthenticated && pathname === '/kyc' && user?.hasCompletedKYC) {
      // If already completed KYC, redirect to dashboard
      router.push('/dashboard')
    }
  }, [user, pathname, router])

  return <>{children}</>
}
