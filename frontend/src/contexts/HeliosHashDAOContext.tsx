"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HeliosHashDAOContextType {
  user: any;
  setUser: (user: any) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

const HeliosHashDAOContext = createContext<HeliosHashDAOContextType | undefined>(undefined);

export function HeliosHashDAOProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <HeliosHashDAOContext.Provider value={{
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated
    }}>
      {children}
    </HeliosHashDAOContext.Provider>
  );
}

export function useHeliosHashDAO() {
  const context = useContext(HeliosHashDAOContext);
  if (context === undefined) {
    throw new Error('useHeliosHashDAO must be used within a HeliosHashDAOProvider');
  }
  return context;
}
