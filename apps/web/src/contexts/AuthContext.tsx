'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  walletAddress?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (userData: User) => void
  logout: () => void
  isLoading: boolean
  // Backwards-compatible fields for legacy wallet components
  isConnected: boolean
  walletType: string | null
  principal: string | null
  connect: (type: string) => void
  disconnect: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth on mount
    try {
      const storedUser = localStorage.getItem('helioshash-user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (e) {
      // ignore parse errors
      console.warn('Failed to read stored user', e)
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    try {
      localStorage.setItem('helioshash-user', JSON.stringify(userData))
    } catch (e) {
      console.warn('Failed to persist user', e)
    }
  }

  const logout = () => {
    setUser(null)
    try {
      localStorage.removeItem('helioshash-user')
    } catch (e) {
      console.warn('Failed to remove stored user', e)
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
    // legacy compatibility fields
    isConnected: !!user,
    walletType: user?.walletAddress ? 'wallet' : null,
    principal: null,
    connect: (type: string) => {
      console.log('connect called', type)
    },
    disconnect: logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
