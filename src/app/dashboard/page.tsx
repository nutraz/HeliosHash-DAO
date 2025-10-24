'use client';

import { BottomNav } from '@/components/bottom-nav';
import { ConnectivityStatus } from '@/components/ConnectivityStatus';
import { HealthPanel } from '@/components/health/HealthPanel';
import { RoleBasedDashboard } from '@/components/role-based-dashboard';
import { RoleBasedOnboarding } from '@/components/role-based-onboarding';
import { TreasuryCard } from '@/components/treasury/TreasuryCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuthContext';
import {
  CheckCircle,
  Handshake,
  LogOut,
  RefreshCw,
  Settings,
  Shield,
  TrendingUp,
  User,
  Users,
  Vote,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout, setUserRole } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentRoleView, setCurrentRoleView] = useState<string>('');

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Set initial role view when user loads
  useEffect(() => {
    if (user && user.role) {
      setCurrentRoleView(user.role);
    }
  }, [user]);

  // Show onboarding for new users or users without roles
  const needsOnboarding = user && (!user.role || showOnboarding);

  const handleOnboardingComplete = async (onboardingData: any) => {
    try {
      // TODO: Call identity canister createProfile function
      console.log('Onboarding completed:', onboardingData);

      // For demo purposes, update the role in context
      await setUserRole(onboardingData.role);
      setShowOnboarding(false);

      // Set the role view
      setCurrentRoleView(onboardingData.role);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  const handleRoleSwitch = (newRole: string) => {
    // Allow users with multiple roles to switch between dashboard views
    if (user?.role === newRole || user?.secondaryRoles.includes(newRole as any)) {
      setCurrentRoleView(newRole);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Community':
        return <Users className='w-4 h-4' />;
      case 'Investor':
        return <TrendingUp className='w-4 h-4' />;
      case 'Authority':
        return <Shield className='w-4 h-4' />;
      case 'Partner':
        return <Handshake className='w-4 h-4' />;
      case 'DAO':
        return <Vote className='w-4 h-4' />;
      default:
        return <User className='w-4 h-4' />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Community':
        return 'bg-green-600';
      case 'Investor':
        return 'bg-yellow-600';
      case 'Authority':
        return 'bg-blue-600';
      case 'Partner':
        return 'bg-purple-600';
      case 'DAO':
        return 'bg-orange-600';
      default:
        return 'bg-gray-600';
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center'>
        <div className='text-center'>
          <RefreshCw className='w-8 h-8 text-blue-400 animate-spin mx-auto mb-4' />
          <div className='text-white text-lg'>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Show onboarding if needed
  if (needsOnboarding) {
    return (
      <RoleBasedOnboarding
        onComplete={handleOnboardingComplete}
        onCancel={() => setShowOnboarding(false)}
      />
    );
  }

  // Main dashboard with role switching
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
      {/* Top Navigation Bar */}
      <div className='border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            {/* Logo and Title */}
            <div className='flex items-center space-x-4'>
              <div className='text-2xl font-bold text-white'>HeliosHash DAO</div>
              {user && (
                <Badge className={`${getRoleColor(currentRoleView)} text-white`}>
                  {getRoleIcon(currentRoleView)}
                  <span className='ml-1'>{currentRoleView}</span>
                </Badge>
              )}
            </div>

            {/* Role Switcher (if user has multiple roles) */}
            {user && user.secondaryRoles.length > 0 && (
              <div className='flex items-center space-x-2'>
                <span className='text-gray-400 text-sm'>Switch Role:</span>
                <div className='flex space-x-2'>
                  <Button
                    variant={currentRoleView === user.role ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handleRoleSwitch(user.role)}
                    className='text-xs'
                  >
                    {getRoleIcon(user.role)}
                    <span className='ml-1'>{user.role}</span>
                  </Button>
                  {user.secondaryRoles.map((role) => (
                    <Button
                      key={role}
                      variant={currentRoleView === role ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => handleRoleSwitch(role)}
                      className='text-xs'
                    >
                      {getRoleIcon(role)}
                      <span className='ml-1'>{role}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* User Menu */}
            <div className='relative'>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setShowUserMenu(!showUserMenu)}
                className='text-white hover:bg-gray-700'
              >
                <User className='w-4 h-4 mr-2' />
                {user?.displayName || user?.username || 'User'}
              </Button>

              {showUserMenu && (
                <div className='absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50'>
                  <div className='p-3 border-b border-gray-700'>
                    <div className='text-white font-semibold'>{user?.displayName}</div>
                    <div className='text-gray-400 text-sm'>{user?.email}</div>
                    <div className='text-gray-400 text-sm'>{user?.location}</div>
                  </div>

                  <div className='p-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => router.push('/validation')}
                      className='w-full justify-start text-left'
                    >
                      <CheckCircle className='w-4 h-4 mr-2' />
                      Validation Dashboard
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => router.push('/compliance')}
                      className='w-full justify-start text-left'
                    >
                      <Shield className='w-4 h-4 mr-2' />
                      🇮🇳 India Compliance
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => router.push('/settings')}
                      className='w-full justify-start text-left'
                    >
                      <Settings className='w-4 h-4 mr-2' />
                      Settings
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setShowOnboarding(true)}
                      className='w-full justify-start text-left'
                    >
                      <RefreshCw className='w-4 h-4 mr-2' />
                      Update Profile
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={handleLogout}
                      className='w-full justify-start text-left text-red-400 hover:text-red-300'
                    >
                      <LogOut className='w-4 h-4 mr-2' />
                      Logout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rewards + Main Dashboard Content */}
      {user && (
        <div className='space-y-8'>
          <section className='max-w-7xl mx-auto px-6 pt-8 space-y-6'>
            <ConnectivityStatus />
            <HealthPanel />
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <TreasuryCard />
            </div>
          </section>
          <RoleBasedDashboard
            userRole={currentRoleView as any}
            userName={user.displayName}
            location={user.location}
            owpBalance={user.owpBalance}
          />
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav
        activePage='dashboard'
        onPageChange={(page) => {
          switch (page) {
            case 'home':
              break; // Stay on dashboard
            case 'mining':
              router.push('/mining');
              break;
            case 'community':
              router.push('/community');
              break;
            case 'payment':
              router.push('/payment');
              break;
            case 'rewards':
              router.push('/rewards');
              break;
            case 'wallet':
              router.push('/wallet');
              break;
            default:
              break;
          }
        }}
      />

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div className='fixed inset-0 z-40' onClick={() => setShowUserMenu(false)} />
      )}
    </div>
  );
}
