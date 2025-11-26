'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  principal: string;
  provider: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (provider: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('hhdao-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (provider: string) => {
    const mockUser: User = {
      principal: `principal-${provider}-${Date.now()}`,
      provider,
      name: 'Rahul Kumar'
    };
    setUser(mockUser);
    localStorage.setItem('hhdao-user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hhdao-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
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
