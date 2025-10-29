'use client';

import { User, authService } from '@/services/authService';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  user: User | null
  login: (provider: string) => Promise<void>
  logout: () => void
  completeOnboarding: () => void
  completeKYC: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for existing auth state on mount using your existing service
    const checkAuth = async () => {
      try {
        // Assuming your authService has a way to get current user
        // If not, we'll use localStorage as fallback
        const authState = localStorage.getItem('helioshash-auth')
        if (authState) {
          const savedUser = JSON.parse(authState)
          setUser(savedUser)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      }
    }
    checkAuth()
  }, [])

  const login = async (provider: string) => {
    try {
      // Use your existing auth service
      const userData = await authService.mockLogin(provider)
      const userWithOnboarding = {
        ...userData,
        // Add onboarding fields if they don't exist
        hasCompletedOnboarding: userData.hasCompletedOnboarding || false,
        hasCompletedKYC: userData.hasCompletedKYC || false
      }
      setUser(userWithOnboarding)
      localStorage.setItem('helioshash-auth', JSON.stringify(userWithOnboarding))
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('helioshash-auth')
  }

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = {
        ...user,
        hasCompletedOnboarding: true
      }
      setUser(updatedUser)
      localStorage.setItem('helioshash-auth', JSON.stringify(updatedUser))
    }
  }

  const completeKYC = () => {
    if (user) {
      const updatedUser = {
        ...user,
        hasCompletedKYC: true
      }
      setUser(updatedUser)
      localStorage.setItem('helioshash-auth', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      completeOnboarding,
      completeKYC
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
