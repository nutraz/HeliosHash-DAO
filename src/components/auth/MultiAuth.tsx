'use client';
import React, { useState } from 'react';
import { Zap, Wallet, Shield, User, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MultiAuth() {
  const [loading, setLoading] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();

  const authProviders = [
    { id: 'internet-identity', name: 'Internet Identity', icon: Shield },
    { id: 'plug-wallet', name: 'Plug Wallet', icon: Wallet },
    { id: 'stoic-wallet', name: 'Stoic Wallet', icon: User },
  ];

  const handleAuth = async (provider: string) => {
    setLoading(provider);
    try {
      await login(provider);
    } catch (error) {
      console.error('Auth failed:', error);
    } finally {
      setLoading(null);
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 blur-xl opacity-50 animate-pulse"></div>
              <Zap className="relative text-orange-400 w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-white to-green-400 bg-clip-text text-transparent">
              HeliosHash DAO
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Choose Authentication Method</p>
        </div>

        <div className="space-y-4">
          {authProviders.map((provider) => (
            <button
              key={provider.id}
              onClick={() => handleAuth(provider.id)}
              disabled={!!loading}
              className="relative group w-full"
            >
              <div className="absolute inset-0 bg-gray-800 blur-lg opacity-75 group-hover:opacity-100 transition-all rounded-2xl"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl hover:bg-gray-800/80 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <provider.icon className="text-white w-8 h-8" />
                    <div className="text-left">
                      <h3 className="text-white font-semibold text-lg">{provider.name}</h3>
                      <p className="text-gray-400 text-sm">Web3 Authentication</p>
                    </div>
                  </div>
                  {loading === provider.id && <Loader className="text-white animate-spin w-6 h-6" />}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">Secure authentication powered by DFINITY</p>
        </div>
      </div>
    </div>
  );
}
