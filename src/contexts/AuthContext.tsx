"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  walletAddress?: string;
  authenticationMethod: "internet-identity" | "wallet" | "email";
}

interface AuthContextType {
  user: User | null;
  login: (method: "internet-identity" | "wallet" | "email", credentials?: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const savedUser = localStorage.getItem("helioshash_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("helioshash_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (method: "internet-identity" | "wallet" | "email", credentials?: any) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let newUser: User;
      
      switch (method) {
        case "internet-identity":
          newUser = {
            id: "ii_" + Math.random().toString(36).substr(2, 9),
            email: "user@internetidentity.org",
            name: "Internet Identity User",
            role: "member",
            authenticationMethod: "internet-identity"
          };
          break;
          
        case "wallet":
          newUser = {
            id: "wallet_" + Math.random().toString(36).substr(2, 9),
            email: "user@wallet.org",
            name: "Wallet User",
            role: "member",
            walletAddress: "0x" + Math.random().toString(16).substr(2, 40),
            authenticationMethod: "wallet"
          };
          break;
          
        case "email":
          newUser = {
            id: "email_" + Math.random().toString(36).substr(2, 9),
            email: credentials.email,
            name: credentials.email.split("@")[0],
            role: "member",
            authenticationMethod: "email"
          };
          break;
          
        default:
          throw new Error("Invalid authentication method");
      }
      
      setUser(newUser);
      localStorage.setItem("helioshash_user", JSON.stringify(newUser));
      
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("helioshash_user");
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}