"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, RegisterData } from '../types';
import { useInternetIdentityAuth } from '@/hooks/useInternetIdentityAuth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Internet Identity (client-only) hook
  const ii = useInternetIdentityAuth();

  useEffect(() => {
    // Check for stored user session
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data - replace with actual API call
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      if (typeof window !== 'undefined') localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Connect using Internet Identity (client-only). Exposed as `connect` on the context.
  const connect = async () => {
    try {
      setIsLoading(true);
      await ii.login();
      // After successful II login, set a minimal user object using principal
      const principal = ii.principal ?? (await (async () => { try { return await (await import('@/lib/ic/actors')).ICActorFactory.getPrincipal(); } catch { return null; } })());
      const iiUser: User = {
        id: principal ?? 'ii-user',
        email: `${principal ?? 'user'}@helioshash.local`,
        name: principal ? `Principal ${principal.slice(0,6)}` : 'Internet Identity User',
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      setUser(iiUser);
      if (typeof window !== 'undefined') localStorage.setItem('user', JSON.stringify(iiUser));
    } catch (err) {
      console.error('Internet Identity connect failed', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '2',
        email: userData.email,
        name: userData.name,
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      if (typeof window !== 'undefined') localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') localStorage.removeItem('user');
  };

  const disconnect = async () => {
    try {
      setIsLoading(true);
      await ii.logout();
    } catch (err) {
      console.error('II logout failed', err);
    } finally {
      setIsLoading(false);
      setUser(null);
      if (typeof window !== 'undefined') localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, connect, disconnect, isIIAuthenticated: ii.isAuthenticated ?? false, principal: ii.principal ?? null }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
