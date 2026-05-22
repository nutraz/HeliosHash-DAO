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

  const register = async (_userData: RegisterData) => {
    // H0a (rollup): the mock register is neutered alongside login(). It previously
    // fabricated a { role: 'user' } session and persisted it to localStorage. Throw
    // loudly so any future accidental wiring fails instead of silently creating a
    // session. Do NOT narrow this to grant any role.
    throw new Error("not implemented");
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
