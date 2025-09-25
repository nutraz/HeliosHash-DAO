"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { HHDAOLogo } from '@/components/hhdao-logo';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Wallet, 
  Shield, 
  ArrowRight, 
  Loader2, 
  AlertTriangle,
  CheckCircle,
  Star,
  Users,
  Zap,
  Home,
  Gift,
  ExternalLink
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { login, isLoading, user, isAuthenticated } = useAuth();
  const [error, setError] = useState<string>('');
  const clearError = () => setError('');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWallet, setSelectedWallet] = useState<string>('');
  const [loginMethod, setLoginMethod] = useState<'internet-identity' | 'wallet'>('internet-identity');
  const [membershipNFT, setMembershipNFT] = useState<any>(null);

  const walletOptions = [
    {
      id: 'plug',
      name: 'Plug Wallet',
      description: 'Popular ICP wallet with DeFi features',
      icon: '🔌',
      recommended: true
    },
    {
      id: 'stoic',
      name: 'Stoic Identity',
      description: 'Secure identity management for IC',
      icon: '🛡️',
      recommended: false
    },
    {
      id: 'nfid',
      name: 'NFID',
      description: 'Next-generation identity provider',
      icon: '🆔',
      recommended: false
    },
    {
      id: 'bitfinity',
      name: 'Bitfinity Wallet',
      description: 'Multi-chain wallet support',
      icon: '🌐',
      recommended: false
    }
  ];

  const membershipBenefits = [
    {
      icon: Users,
      title: "Governance Participation",
      description: "Vote on proposals and shape the future of renewable energy in Urgam Valley"
    },
    {
      icon: Zap,
      title: "Energy Credits",
      description: "Earn and trade energy credits from community solar projects"
    },
    {
      icon: Gift,
      title: "Exclusive NFTs",
      description: "Receive membership NFTs with special utilities and rewards"
    },
    {
      icon: Star,
      title: "Community Access",
      description: "Join exclusive forums, events, and educational programs"
    }
  ];

  const handleAuth = async () => {
    try {
      clearError();
      
      if (loginMethod === 'internet-identity') {
        await login('internet-identity');
      } else if (selectedWallet) {
        await login('wallet', { walletType: selectedWallet });
      } else {
        return;
      }

      setCurrentStep(2);
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  const handleWalletSelect = async (walletType: 'plug' | 'stoic' | 'nfid' | 'bitfinity') => {
    try {
      setSelectedWallet(walletType);
      clearError();
      await login('wallet', { walletType });
      setCurrentStep(2);
    } catch (err) {
      setError(`Failed to connect with ${walletType} wallet`);
    }
  };

  const handleJoinDAO = async () => {
    try {
      clearError();
      // Simulate joining DAO - in real app this would be a separate service call
      setMembershipNFT({ id: 'nft_123', tier: 'Bronze' });
      setCurrentStep(3);
    } catch (err) {
      setError('Failed to join DAO. Please try again.');
    }
  };

  const completedSignup = () => {
    router.push('/dashboard');
  };

  // Handle redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Show loading state during redirect
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-400 mx-auto mb-4" />
          <p className="text-white">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  const progressValue = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center p-6">
      {/* Animated background */}
      <div className="flag-stripes opacity-20"></div>
      
      {/* Home button */}
      <Button
        onClick={() => router.push('/landing')}
        variant="outline"
        className="fixed top-4 left-4 z-50 border-gray-600 text-gray-300 hover:bg-gray-800"
      >
        <Home className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <HHDAOLogo size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join HeliosHash DAO</h1>
          <p className="text-gray-400">
            Become part of India's renewable energy revolution
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="card-readable mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Progress</span>
              <span className="text-sm text-gray-400">Step {currentStep} of 3</span>
            </div>
            <Progress value={progressValue} className="mb-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span className={currentStep >= 1 ? 'text-orange-400' : ''}>Connect</span>
              <span className={currentStep >= 2 ? 'text-orange-400' : ''}>Join DAO</span>
              <span className={currentStep >= 3 ? 'text-orange-400' : ''}>Complete</span>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-500/50 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Step 1: Authentication */}
        {currentStep === 1 && (
          <Card className="card-readable">
            <CardHeader>
              <CardTitle className="text-center text-white">Step 1: Connect Your Identity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Method Selection */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <Button
                  variant={loginMethod === 'internet-identity' ? 'default' : 'outline'}
                  className="h-auto py-4 flex-col"
                  onClick={() => setLoginMethod('internet-identity')}
                >
                  <Shield className="w-6 h-6 mb-2" />
                  <span className="text-sm">Internet Identity</span>
                </Button>
                <Button
                  variant={loginMethod === 'wallet' ? 'default' : 'outline'}
                  className="h-auto py-4 flex-col"
                  onClick={() => setLoginMethod('wallet')}
                >
                  <Wallet className="w-6 h-6 mb-2" />
                  <span className="text-sm">Crypto Wallet</span>
                </Button>
              </div>

              {/* Internet Identity */}
              {loginMethod === 'internet-identity' && (
                <div className="space-y-4">
                  <div className="text-center text-sm text-gray-400 mb-4">
                    Create or use your Internet Computer identity for secure, anonymous authentication
                  </div>
                  <Button
                    onClick={handleAuth}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Connect Internet Identity
                      </>
                    )}
                  </Button>
                  <div className="text-xs text-gray-500 text-center">
                    New to Internet Identity?{' '}
                    <a 
                      href="https://identity.ic0.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Create one here <ExternalLink className="w-3 h-3 inline" />
                    </a>
                  </div>
                </div>
              )}

              {/* Wallet Connection */}
              {loginMethod === 'wallet' && (
                <div className="space-y-3">
                  <div className="text-center text-sm text-gray-400 mb-4">
                    Connect your ICP wallet to join the DAO
                  </div>
                  {walletOptions.map((wallet) => (
                    <Button
                      key={wallet.id}
                      onClick={() => handleWalletSelect(wallet.id as any)}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full justify-start p-4 h-auto border-gray-600 hover:bg-gray-800"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-2xl">{wallet.icon}</span>
                        <div className="text-left">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-white">{wallet.name}</span>
                            {wallet.recommended && (
                              <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full">
                                Recommended
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{wallet.description}</p>
                        </div>
                      </div>
                      {isLoading && selectedWallet === wallet.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Join DAO */}
        {currentStep === 2 && (
          <Card className="card-readable">
            <CardHeader>
              <CardTitle className="text-center text-white">Step 2: Join the DAO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-6">
                  Identity connected successfully! Now join the HeliosHash DAO to access 
                  all features and start participating in community governance.
                </p>
              </div>

              {/* Membership Benefits */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white mb-3 text-center">Membership Benefits</h4>
                {membershipBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/50">
                    <benefit.icon className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-white text-sm">{benefit.title}</h5>
                      <p className="text-xs text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={handleJoinDAO}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining DAO...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Join HeliosHash DAO - Free
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Completion */}
        {currentStep === 3 && (
          <Card className="card-readable">
            <CardHeader>
              <CardTitle className="text-center text-white">Welcome to HeliosHash DAO!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <p className="text-gray-300 mb-4">
                  Congratulations! You're now a member of HeliosHash DAO. 
                  You've received your membership NFT and can start participating in governance.
                </p>
              </div>

              {/* Membership NFT */}
              {membershipNFT && (
                <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30">
                  <CardContent className="p-4 text-center">
                    <Gift className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                    <h4 className="font-semibold text-white mb-2">Membership NFT Received</h4>
                    <p className="text-sm text-gray-300 mb-3">{membershipNFT.name}</p>
                    <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                      {membershipNFT.tier} Tier
                    </Badge>
                    <div className="mt-3 text-xs text-gray-400">
                      Voting Power: {membershipNFT.votingPower}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Next Steps */}
              <div className="space-y-2">
                <h4 className="font-semibold text-white text-center">What's Next?</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Explore the dashboard and solar projects</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Participate in active governance proposals</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Browse and trade community NFTs</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Connect with the community</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={completedSignup}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Enter HeliosHash DAO
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-400">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/auth/login')}
            className="text-orange-400 hover:text-orange-300 font-medium"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
}