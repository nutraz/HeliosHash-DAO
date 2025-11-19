"use client";

import { useEffect, useRef, useState } from 'react';
import { connectInternetIdentity, connectPlug, connectStoic, connectNFID, AuthResult } from './providers';
import { X, Wallet, Key, User, Shield, Zap, Loader } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (result: AuthResult) => void;
}

interface ProviderInfo {
  id: 'internet-identity' | 'plug' | 'stoic' | 'nfid' | 'password';
  name: string;
  description: string;
  icon: React.ReactNode;
  recommended?: boolean;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [loadingMethod, setLoadingMethod] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'wallets' | 'password'>('wallets');
  const [formData, setFormData] = useState({ username: '', password: '' });

  const providers: ProviderInfo[] = [
    {
      id: 'internet-identity',
      name: 'Internet Identity',
      description: 'DFINITY\'s privacy-preserving authentication',
      icon: <Shield className="w-5 h-5" />,
      recommended: true
    },
    {
      id: 'plug',
      name: 'Plug Wallet',
      description: 'Browser extension wallet for ICP',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'stoic',
      name: 'Stoic Wallet',
      description: 'Web-based wallet with key management',
      icon: <Wallet className="w-5 h-5" />
    },
    {
      id: 'nfid',
      name: 'NFID',
      description: 'Web3 identity and authentication',
      icon: <User className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
      
      // Focus first element when modal opens
      setTimeout(() => {
        const firstInput = modalRef.current?.querySelector('input, button');
        if (firstInput) {
          (firstInput as HTMLElement).focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleProvider = async (providerId: string) => {
    setError(null);
    setLoadingMethod(providerId);
    
    try {
      let result: AuthResult | undefined;
      
      switch (providerId) {
        case 'internet-identity':
          result = await connectInternetIdentity();
          break;
        case 'plug':
          result = await connectPlug();
          break;
        case 'stoic':
          result = await connectStoic();
          break;
        case 'nfid':
          result = await connectNFID();
          break;
        case 'password':
          if (!formData.username || !formData.password) {
            throw new Error('Please enter both username and password');
          }
          // Fallback: create a small local session for demo
          result = { 
            method: 'password', 
            principal: 'local-pass-user', 
            name: formData.username || 'local_user' 
          };
          break;
      }

      if (result) {
        onSuccess?.(result);
        setLoadingMethod(null);
        setFormData({ username: '', password: '' });
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
      setLoadingMethod(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProvider('password');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        ref={modalRef}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 id="auth-modal-title" className="text-2xl font-bold text-gray-900">
            Welcome to HHDAO
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close authentication modal"
            disabled={!!loadingMethod}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab('wallets')}
              className={`flex-1 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'wallets'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Wallet className="w-4 h-4 inline mr-2" />
              Wallets
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'password'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Key className="w-4 h-4 inline mr-2" />
              Password
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'wallets' && (
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Connect with your favorite Internet Computer wallet to get started with HHDAO.
              </p>
              
              <div className="space-y-3">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => handleProvider(provider.id)}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!!loadingMethod}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        {provider.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 flex items-center">
                          {provider.name}
                          {provider.recommended && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {provider.description}
                        </div>
                      </div>
                    </div>
                    {loadingMethod === provider.id ? (
                      <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                    ) : (
                      <div className="w-5 h-5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <p className="text-gray-600 text-sm">
                Sign in with your username and password for demo access.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your username"
                    aria-required="true"
                    disabled={!!loadingMethod}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your password"
                    aria-required="true"
                    disabled={!!loadingMethod}
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={!!loadingMethod}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  disabled={!!loadingMethod}
                >
                  {loadingMethod === 'password' ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>
          )}

          {error && (
            <div 
              className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By connecting, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}