'use client';

import { HHDAOLogo } from '@/components/hhdao-logo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuthContext';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Chrome,
  ExternalLink,
  Github,
  Home,
  Loader2,
  Mail,
  Shield,
  Users,
  Wallet,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, user, isAuthenticated } = useAuth();
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [loginMethod, setLoginMethod] = useState<
    'internet-identity' | 'wallet' | 'social' | 'email'
  >('internet-identity');
  const [error, setError] = useState<string>('');

  const clearError = () => setError('');

  const walletOptions = [
    {
      id: 'plug',
      name: 'Plug Wallet',
      description: 'Popular ICP wallet with DeFi features',
      icon: '🔌',
      recommended: true,
    },
    {
      id: 'stoic',
      name: 'Stoic Identity',
      description: 'Secure identity management for IC',
      icon: '🛡️',
      recommended: false,
    },
    {
      id: 'nfid',
      name: 'NFID',
      description: 'Next-generation identity provider',
      icon: '🆔',
      recommended: false,
    },
    {
      id: 'bitfinity',
      name: 'Bitfinity Wallet',
      description: 'Multi-chain wallet support',
      icon: '🌐',
      recommended: false,
    },
  ];

  const handleInternetIdentityLogin = async () => {
    try {
      setError('');
      await login('internet-identity');
      router.push('/');
    } catch (err) {
      setError('Failed to login with Internet Identity');
    }
  };

  const handleWalletConnect = async (walletType: 'plug' | 'stoic' | 'nfid' | 'bitfinity') => {
    try {
      setError('');
      setSelectedWallet(walletType);
      await login({ type: 'wallet', walletType });
      router.push('/');
    } catch (err) {
      setError(`Failed to connect with ${walletType} wallet`);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'discord' | 'twitter') => {
    try {
      setError('');
      await login({ type: 'social', provider });
      router.push('/');
    } catch (err) {
      setError(`Failed to login with ${provider}`);
    }
  };

  const handleEmailLogin = async (email: string) => {
    try {
      setError('');
      await login({ type: 'email', email });
      router.push('/');
    } catch (err) {
      setError('Failed to login with email');
    }
  };

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: <Chrome className='w-5 h-5' />,
      color: 'bg-red-600 hover:bg-red-700',
      description: 'Continue with Google account',
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: <Github className='w-5 h-5' />,
      color: 'bg-gray-800 hover:bg-gray-900',
      description: 'Continue with GitHub account',
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: <Users className='w-5 h-5' />,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      description: 'Continue with Discord account',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
        </svg>
      ),
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Continue with Twitter account',
    },
  ];

  // Handle redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Show loading state during redirect
  if (isAuthenticated) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='w-8 h-8 animate-spin text-orange-400 mx-auto mb-4' />
          <p className='text-white'>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center p-6'>
      {/* Animated background */}
      <div className='flag-stripes opacity-20'></div>

      {/* Home button */}
      <Button
        onClick={() => router.push('/landing')}
        variant='outline'
        className='fixed top-4 left-4 z-50 border-gray-600 text-gray-300 hover:bg-gray-800'
      >
        <Home className='w-4 h-4 mr-2' />
        Back to Home
      </Button>

      <div className='relative z-10 w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='flex justify-center mb-4'>
            <HHDAOLogo size='lg' />
          </div>
          <h1 className='text-3xl font-bold text-white mb-2'>Welcome Back</h1>
          <p className='text-gray-400'>
            Connect to HeliosHash DAO and start building the future of renewable energy
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className='mb-6 border-red-500/50 bg-red-500/10'>
            <AlertTriangle className='h-4 w-4 text-red-400' />
            <AlertDescription className='text-red-400'>{error}</AlertDescription>
          </Alert>
        )}

        {/* Login Methods */}
        <Card className='card-readable mb-6'>
          <CardHeader>
            <CardTitle className='text-center text-white'>Choose Login Method</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Method Selection */}
            <div className='grid grid-cols-2 gap-2 mb-6'>
              <Button
                variant={loginMethod === 'internet-identity' ? 'default' : 'outline'}
                className='h-auto py-3 flex-col text-xs'
                onClick={() => setLoginMethod('internet-identity')}
              >
                <Shield className='w-5 h-5 mb-1' />
                <span>Internet Identity</span>
              </Button>
              <Button
                variant={loginMethod === 'wallet' ? 'default' : 'outline'}
                className='h-auto py-3 flex-col text-xs'
                onClick={() => setLoginMethod('wallet')}
              >
                <Wallet className='w-5 h-5 mb-1' />
                <span>Crypto Wallet</span>
              </Button>
              <Button
                variant={loginMethod === 'social' ? 'default' : 'outline'}
                className='h-auto py-3 flex-col text-xs'
                onClick={() => setLoginMethod('social')}
              >
                <Users className='w-5 h-5 mb-1' />
                <span>Social Login</span>
              </Button>
              <Button
                variant={loginMethod === 'email' ? 'default' : 'outline'}
                className='h-auto py-3 flex-col text-xs'
                onClick={() => setLoginMethod('email')}
              >
                <Mail className='w-5 h-5 mb-1' />
                <span>Email/OTP</span>
              </Button>
            </div>

            {/* Internet Identity Login */}
            {loginMethod === 'internet-identity' && (
              <div className='space-y-4'>
                <div className='text-center text-sm text-gray-400 mb-4'>
                  Use Internet Computer's native identity system for secure, anonymous
                  authentication
                </div>
                <Button
                  onClick={handleInternetIdentityLogin}
                  disabled={isLoading}
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white'
                >
                  {isLoading ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Shield className='w-4 h-4 mr-2' />
                      Login with Internet Identity
                    </>
                  )}
                </Button>
                <div className='text-xs text-gray-500 text-center'>
                  New to Internet Identity?{' '}
                  <a
                    href='https://identity.ic0.app'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-400 hover:text-blue-300'
                  >
                    Create one here <ExternalLink className='w-3 h-3 inline' />
                  </a>
                </div>
              </div>
            )}

            {/* Wallet Connection */}
            {loginMethod === 'wallet' && (
              <div className='space-y-3'>
                <div className='text-center text-sm text-gray-400 mb-4'>
                  Connect your existing ICP wallet to access the DAO
                </div>
                {walletOptions.map((wallet) => (
                  <Button
                    key={wallet.id}
                    onClick={() => handleWalletConnect(wallet.id as any)}
                    disabled={isLoading}
                    variant='outline'
                    className='w-full justify-start p-4 h-auto border-gray-600 hover:bg-gray-800'
                  >
                    <div className='flex items-center space-x-3 flex-1'>
                      <span className='text-2xl'>{wallet.icon}</span>
                      <div className='text-left'>
                        <div className='flex items-center space-x-2'>
                          <span className='font-medium text-white'>{wallet.name}</span>
                          {wallet.recommended && (
                            <span className='bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full'>
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className='text-sm text-gray-400'>{wallet.description}</p>
                      </div>
                    </div>
                    {isLoading && selectedWallet === wallet.id ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <ArrowRight className='w-4 h-4' />
                    )}
                  </Button>
                ))}
              </div>
            )}

            {/* Social Login */}
            {loginMethod === 'social' && (
              <div className='space-y-3'>
                <div className='text-center text-sm text-gray-400 mb-4'>
                  Login quickly with your existing social media accounts
                </div>
                {socialProviders.map((provider) => (
                  <Button
                    key={provider.id}
                    onClick={() => handleSocialLogin(provider.id as any)}
                    disabled={isLoading}
                    className={`w-full justify-start p-4 h-auto text-white ${provider.color} border-0`}
                  >
                    <div className='flex items-center space-x-3 flex-1'>
                      {provider.icon}
                      <div className='text-left'>
                        <div className='font-medium'>{provider.name}</div>
                        <p className='text-sm opacity-90'>{provider.description}</p>
                      </div>
                    </div>
                    {isLoading ? (
                      <Loader2 className='w-4 h-4 animate-spin' />
                    ) : (
                      <ArrowRight className='w-4 h-4' />
                    )}
                  </Button>
                ))}
              </div>
            )}

            {/* Email/OTP Login */}
            {loginMethod === 'email' && (
              <div className='space-y-4'>
                <div className='text-center text-sm text-gray-400 mb-4'>
                  Enter your email address to receive a login code
                </div>
                <div className='space-y-3'>
                  <input
                    type='email'
                    placeholder='Enter your email address'
                    className='w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none'
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const target = e.target as HTMLInputElement;
                        if (target.value) handleEmailLogin(target.value);
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      const emailInput = document.querySelector(
                        'input[type="email"]'
                      ) as HTMLInputElement;
                      if (emailInput?.value) handleEmailLogin(emailInput.value);
                    }}
                    disabled={isLoading}
                    className='w-full bg-orange-600 hover:bg-orange-700 text-white'
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        <Mail className='w-4 h-4 mr-2' />
                        Send Login Code
                      </>
                    )}
                  </Button>
                  <div className='text-xs text-gray-500 text-center'>
                    We'll send you a secure login code via email
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className='card-readable'>
          <CardContent className='p-4'>
            <h3 className='font-semibold text-white mb-3 text-center'>Why Join HeliosHash DAO?</h3>
            <div className='space-y-2 text-sm'>
              <div className='flex items-center space-x-2 text-gray-300'>
                <CheckCircle className='w-4 h-4 text-green-400' />
                <span>Participate in renewable energy governance</span>
              </div>
              <div className='flex items-center space-x-2 text-gray-300'>
                <CheckCircle className='w-4 h-4 text-green-400' />
                <span>Earn rewards from solar project investments</span>
              </div>
              <div className='flex items-center space-x-2 text-gray-300'>
                <CheckCircle className='w-4 h-4 text-green-400' />
                <span>Trade energy credits and carbon offsets</span>
              </div>
              <div className='flex items-center space-x-2 text-gray-300'>
                <CheckCircle className='w-4 h-4 text-green-400' />
                <span>Collect exclusive membership NFTs</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className='text-center mt-6 text-sm text-gray-400'>
          Don't have an account?{' '}
          <button
            onClick={() => router.push('/auth/signup')}
            className='text-orange-400 hover:text-orange-300 font-medium'
          >
            Join the DAO
          </button>
        </div>
      </div>
    </div>
  );
}
