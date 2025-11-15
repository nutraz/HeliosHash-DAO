'use client'; // Add this at the top

import React, { createContext, useContext, useState, useEffect } from 'react';

interface MockUser {
  id: string;
  name: string;
  principal: string;
  avatar: string;
}

interface MockAuthContextType {
  user: MockUser | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const MockAuthContext = createContext<MockAuthContextType>({} as MockAuthContextType);

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate async session check (in-memory only)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const login = () => {
    // Create a mock user (in-memory only)
    const mockUser: MockUser = {
      id: 'user-123',
      name: 'Demo User',
      principal: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
      avatar: 'https://picsum.photos/seed/user123/200/200.jpg'
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <MockAuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </MockAuthContext.Provider>
  );
};

export const useMockAuth = () => useContext(MockAuthContext);