"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, RegisterData } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (_email: string, _password: string) => {
    // H0a: the mock admin-granting login is removed. It previously fabricated a
    // { role: 'admin' } user and persisted it to localStorage — a trivial admin
    // grant if this (currently unmounted) provider were ever wired in. Throw
    // loudly so any future accidental wiring fails instead of silently granting
    // access. Do NOT narrow this to grant a 'user' (or any) role.
    throw new Error("not implemented");
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

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
