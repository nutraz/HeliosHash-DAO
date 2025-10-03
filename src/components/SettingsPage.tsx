'use client';

import { ValidationPreferences } from '@/components/settings/ValidationPreferences';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuthContext';
import { ArrowLeft, Bell, Globe, Palette, Settings, Shield, User, Users } from 'lucide-react';
import { useState } from 'react';

interface SettingsPageProps {
  onBack?: () => void;
}

type SettingsSection =
  | 'validation'
  | 'profile'
  | 'security'
  | 'notifications'
  | 'preferences'
  | 'about';

export function SettingsPage({ onBack }: SettingsPageProps) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<SettingsSection>('validation');

  const settingsSections = [
    {
      id: 'validation' as SettingsSection,
      title: 'Validation Preferences',
      description: 'Configure duo validation and earning preferences',
      icon: Users,
      badge: user?.prefersDuoValidation ? 'Duo Mode' : 'Solo Mode',
      badgeColor: user?.prefersDuoValidation ? 'green' : 'blue',
    },
    {
      id: 'profile' as SettingsSection,
      title: 'Profile Settings',
      description: 'Manage your personal information and role',
      icon: User,
      badge: user?.role || 'Community',
      badgeColor: 'purple',
    },
    {
      id: 'security' as SettingsSection,
      title: 'Security & Privacy',
      description: 'Authentication and privacy controls',
      icon: Shield,
      badge: user?.aadhaarVerified ? 'Verified' : 'Basic',
      badgeColor: user?.aadhaarVerified ? 'green' : 'gray',
    },
    {
      id: 'notifications' as SettingsSection,
      title: 'Notifications',
      description: 'Configure alerts and communication preferences',
      icon: Bell,
      badge: null,
      badgeColor: 'gray',
    },
    {
      id: 'preferences' as SettingsSection,
      title: 'App Preferences',
      description: 'Language, theme, and display settings',
      icon: Palette,
      badge: null,
      badgeColor: 'gray',
    },
    {
      id: 'about' as SettingsSection,
      title: 'About & Support',
      description: 'Version info, help, and feedback',
      icon: Globe,
      badge: null,
      badgeColor: 'gray',
    },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'validation':
        return (
          <ValidationPreferences
            onPreferenceChange={(prefersDuo) => console.log('Duo preference changed:', prefersDuo)}
          />
        );

      case 'profile':
        return (
          <Card className='bg-gray-800/50 border-gray-700'>
            <CardHeader>
              <CardTitle className='text-white'>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='text-gray-400'>Profile management features coming soon...</div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <div className='text-sm text-gray-400 mb-1'>Display Name</div>
                    <div className='text-white font-semibold'>{user?.displayName || 'Not set'}</div>
                  </div>
                  <div>
                    <div className='text-sm text-gray-400 mb-1'>Username</div>
                    <div className='text-white font-semibold'>{user?.username || 'Not set'}</div>
                  </div>
                  <div>
                    <div className='text-sm text-gray-400 mb-1'>Location</div>
                    <div className='text-white font-semibold'>{user?.location || 'Not set'}</div>
                  </div>
                  <div>
                    <div className='text-sm text-gray-400 mb-1'>OWP Balance</div>
                    <div className='text-yellow-400 font-semibold'>{user?.owpBalance || 0} OWP</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'security':
        return (
          <Card className='bg-gray-800/50 border-gray-700'>
            <CardHeader>
              <CardTitle className='text-white'>Security & Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='text-gray-400'>Security features coming soon...</div>
                <div className='space-y-3'>
                  <div className='flex justify-between items-center p-3 bg-gray-700/50 rounded'>
                    <div>
                      <div className='font-semibold text-white'>Aadhaar Verification</div>
                      <div className='text-sm text-gray-400'>Government ID verification status</div>
                    </div>
                    <Badge
                      variant='outline'
                      className={
                        user?.aadhaarVerified
                          ? 'text-green-400 border-green-500'
                          : 'text-gray-400 border-gray-500'
                      }
                    >
                      {user?.aadhaarVerified ? 'Verified' : 'Not Verified'}
                    </Badge>
                  </div>
                  <div className='flex justify-between items-center p-3 bg-gray-700/50 rounded'>
                    <div>
                      <div className='font-semibold text-white'>Two-Factor Authentication</div>
                      <div className='text-sm text-gray-400'>
                        Add extra security to your account
                      </div>
                    </div>
                    <Badge variant='outline' className='text-gray-400 border-gray-500'>
                      Coming Soon
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className='bg-gray-800/50 border-gray-700'>
            <CardContent className='p-8 text-center'>
              <div className='text-gray-400 mb-4'>This section is under development</div>
              <div className='text-sm text-gray-500'>
                More settings and preferences will be available soon.
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-4'>
            {onBack && (
              <Button
                variant='outline'
                size='sm'
                onClick={onBack}
                className='flex items-center gap-2'
              >
                <ArrowLeft className='w-4 h-4' />
                Back
              </Button>
            )}
            <div>
              <h1 className='text-3xl font-bold text-white flex items-center gap-3'>
                <Settings className='w-8 h-8' />
                Settings
              </h1>
              <p className='text-gray-400 mt-1'>Manage your HHDAO preferences and configuration</p>
            </div>
          </div>

          {user && (
            <Card className='bg-gray-800/50 border-gray-700'>
              <CardContent className='p-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center'>
                    <User className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <div className='font-semibold text-white text-sm'>{user.displayName}</div>
                    <div className='text-xs text-gray-400'>{user.role} Member</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Settings Layout */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
          {/* Settings Navigation */}
          <div className='lg:col-span-1'>
            <Card className='bg-gray-800/50 border-gray-700'>
              <CardHeader>
                <CardTitle className='text-white text-lg'>Settings</CardTitle>
              </CardHeader>
              <CardContent className='p-0'>
                <nav className='space-y-1'>
                  {settingsSections.map((section) => {
                    const IconComponent = section.icon;
                    const isActive = activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left p-3 transition-colors ${
                          isActive
                            ? 'bg-blue-500/20 border-r-2 border-blue-500'
                            : 'hover:bg-gray-700/50'
                        }`}
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <IconComponent
                              className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-gray-400'}`}
                            />
                            <div>
                              <div
                                className={`font-semibold text-sm ${
                                  isActive ? 'text-blue-400' : 'text-white'
                                }`}
                              >
                                {section.title}
                              </div>
                              <div className='text-xs text-gray-400 mt-1'>
                                {section.description}
                              </div>
                            </div>
                          </div>
                          {section.badge && (
                            <Badge
                              variant='outline'
                              className={`text-xs text-${section.badgeColor}-400 border-${section.badgeColor}-500`}
                            >
                              {section.badge}
                            </Badge>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className='lg:col-span-3'>{renderSectionContent()}</div>
        </div>
      </div>
    </div>
  );
}
