'use client';

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Types from the identity canister
export type UserRole = 'Community' | 'Investor' | 'Authority' | 'Partner' | 'DAO';

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: UserRole;
  secondaryRoles: UserRole[];
  location: string;
  aadhaarVerified?: boolean;
  owpBalance: number;
  profilePictureUrl?: string;
  joinDate: string;
  prefersDuoValidation?: boolean; // NEW: Preference for duo validation
  principal: string; // IC principal (mock for now)
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: UserRole) => boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for development - replace with actual canister integration
const mockUsers: Record<string, User> = {
  community1: {
    id: 'community1',
    username: 'rajesh_kumar',
    email: 'rajesh@gmail.com',
    displayName: 'Rajesh Kumar',
    role: 'Community',
    secondaryRoles: [],
    location: 'Rajasthan, India',
    aadhaarVerified: true,
    owpBalance: 450,
    profilePictureUrl: '/avatars/rajesh.jpg',
    joinDate: '2024-01-15',
    prefersDuoValidation: false,
    principal: 'rdmx6-jaaaa-aaaah-qdrpq-cai',
  },
  investor1: {
    id: 'investor1',
    username: 'priya_ventures',
    email: 'priya@greenventures.com',
    displayName: 'Priya Sharma',
    role: 'Investor',
    secondaryRoles: ['DAO'],
    location: 'Mumbai, India',
    aadhaarVerified: true,
    owpBalance: 25000,
    profilePictureUrl: '/avatars/priya.jpg',
    joinDate: '2024-02-10',
    prefersDuoValidation: true,
    principal: 'rrkah-fqaaa-aaaah-qdrpq-cai',
  },
  authority1: {
    id: 'authority1',
    username: 'gram_panchayat_head',
    email: 'head@grampanchayat.gov.in',
    displayName: 'Smt. Sunita Devi',
    role: 'Authority',
    secondaryRoles: [],
    location: 'Bihar Gram Panchayat',
    aadhaarVerified: true,
    owpBalance: 1000,
    profilePictureUrl: '/avatars/sunita.jpg',
    joinDate: '2024-03-05',
    prefersDuoValidation: false,
    principal: 'ryjl3-tyaaa-aaaah-qdrpq-cai',
  },
  partner1: {
    id: 'partner1',
    username: 'solar_tech_solutions',
    email: 'contact@solartechsolutions.com',
    displayName: 'Solar Tech Solutions',
    role: 'Partner',
    secondaryRoles: ['Investor'],
    location: 'Delhi, India',
    aadhaarVerified: false,
    owpBalance: 15000,
    profilePictureUrl: '/avatars/company.jpg',
    joinDate: '2024-01-20',
    prefersDuoValidation: false,
    principal: 'r7inp-6aaaa-aaaaa-aaabq-cai',
  },
  dao1: {
    id: 'dao1',
    username: 'dao_member_arjun',
    email: 'arjun@helioshash.dao',
    displayName: 'Arjun Patel',
    role: 'DAO',
    secondaryRoles: ['Community'],
    location: 'Gujarat, India',
    aadhaarVerified: true,
    owpBalance: 8500,
    profilePictureUrl: '/avatars/arjun.jpg',
    joinDate: '2024-01-01',
    prefersDuoValidation: true,
    principal: 'qjdve-lqaaa-aaaaa-aaaeq-cai',
  },
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from secure, server-side session
  useEffect(() => {
    fetch('/api/session')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          // Map session user to full User type
          const fullUser: User = {
            id: data.user.id,
            username: data.user.name.toLowerCase().replace(' ', '_'),
            email: data.user.email,
            displayName: data.user.name,
            role: 'Community', // Default role
            secondaryRoles: [],
            location: 'India', // Default
            aadhaarVerified: true,
            owpBalance: data.user.balance,
            joinDate: '2024-01-01',
            prefersDuoValidation: false,
            principal: 'mock-principal',
          };
          setUser(fullUser);
        } else {
          setUser(null);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false;
    return user.role === role || user.secondaryRoles.includes(role);
  };


  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      // Demo: POST userId, in real app use credentials
      const userId = credentials.userId || 'community1';
      await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      // Fetch user from session
      const res = await fetch('/api/session');
      const data = await res.json();
      setUser(data.user || null);
    } finally {
      setIsLoading(false);
    }
  };


  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);

    // Update mock data
    const userId = Object.keys(mockUsers).find((key) => mockUsers[key].id === user.id);
    if (userId) {
      mockUsers[userId] = updatedUser;
    }
  };

  const setUserRole = async (role: UserRole) => {
    await updateProfile({ role });
  };

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    hasRole,
    login,
    logout,
    updateProfile,
    setUserRole,
  };

  return React.createElement(AuthContext.Provider, { value: contextValue }, children);
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

// Legacy hook for backward compatibility
export function useAuth() {
  return useAuthContext();
}
