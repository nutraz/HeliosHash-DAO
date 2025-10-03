'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuthContext';
import { CheckCircle, Coins, Info, Shield, Star, User, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ValidationPreferencesProps {
  onPreferenceChange?: (prefersDuo: boolean) => void;
}

export function ValidationPreferences({ onPreferenceChange }: ValidationPreferencesProps) {
  const { user, updateProfile } = useAuth();
  const [prefersDuo, setPrefersDuo] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if user has duo validation preference (when we extend the user type)
      setPrefersDuo(user.prefersDuoValidation ?? false);
    }
  }, [user]);

  const handleToggle = async (checked: boolean) => {
    if (!user) return;

    setIsUpdating(true);
    try {
      // Update via identity service (we'll create this)
      await updateDuoPreference(checked);
      setPrefersDuo(checked);

      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      // Notify parent component
      if (onPreferenceChange) {
        onPreferenceChange(checked);
      }

      // Refresh user context - update the local preference
      if (updateProfile) {
        await updateProfile({ prefersDuoValidation: checked });
      }
    } catch (error) {
      console.error('Error updating duo validation preference:', error);
      alert('Failed to update preference. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const updateDuoPreference = async (prefersDuo: boolean): Promise<void> => {
    // Import and use the real identity service
    const { identityService } = await import('@/services/identityService');
    await identityService.updateDuoValidationPreference(prefersDuo);
  };

  if (!user) {
    return (
      <Card className='bg-gray-800/50 border-gray-700'>
        <CardContent className='p-6 text-center'>
          <div className='text-gray-400'>Please log in to manage validation preferences</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Main Preference Card */}
      <Card className='bg-gray-800/50 border-gray-700'>
        <CardHeader>
          <CardTitle className='text-white flex items-center gap-2'>
            <Users className='w-5 h-5' />
            Validation Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Success Message */}
          {showSuccessMessage && (
            <div className='bg-green-500/10 border border-green-500 rounded p-3'>
              <div className='flex items-center gap-2 text-green-400'>
                <CheckCircle className='w-4 h-4' />
                <span className='text-sm'>Preference updated successfully!</span>
              </div>
            </div>
          )}

          {/* Main Toggle */}
          <div className='flex items-center justify-between p-4 bg-gray-700/50 rounded-lg'>
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-1'>
                <h3 className='font-semibold text-white'>Prefer Duo Validation</h3>
                {prefersDuo && (
                  <Badge variant='outline' className='text-green-400 border-green-500'>
                    Active
                  </Badge>
                )}
              </div>
              <p className='text-sm text-gray-400'>
                Opt in to validate solar projects with a partner validator for enhanced accuracy and
                collaboration.
              </p>
            </div>

            <label className='relative inline-flex items-center cursor-pointer ml-4'>
              <input
                type='checkbox'
                className='sr-only peer'
                checked={prefersDuo}
                disabled={isUpdating}
                onChange={(e) => handleToggle(e.target.checked)}
              />
              <div
                className={`w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer transition-colors ${
                  prefersDuo ? 'peer-checked:bg-green-600' : ''
                } peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
              ></div>
            </label>
          </div>

          {/* Loading State */}
          {isUpdating && (
            <div className='flex items-center justify-center py-4'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-white'></div>
              <span className='ml-2 text-gray-400'>Updating preference...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Benefits Explanation */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card
          className={`transition-colors ${
            prefersDuo ? 'border-green-500 bg-green-500/10' : 'border-gray-600 bg-gray-800/50'
          }`}
        >
          <CardHeader className='pb-3'>
            <CardTitle className='text-white text-lg flex items-center gap-2'>
              <Users className='w-5 h-5 text-green-400' />
              Duo Validation Benefits
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-start gap-2'>
              <Coins className='w-4 h-4 text-yellow-400 mt-0.5' />
              <div>
                <div className='text-white font-semibold'>+50% OWP Bonus</div>
                <div className='text-xs text-gray-400'>
                  Earn 75 OWP per validation instead of 50
                </div>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <Shield className='w-4 h-4 text-blue-400 mt-0.5' />
              <div>
                <div className='text-white font-semibold'>Enhanced Accuracy</div>
                <div className='text-xs text-gray-400'>
                  Cross-validation reduces errors and disputes
                </div>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <Star className='w-4 h-4 text-purple-400 mt-0.5' />
              <div>
                <div className='text-white font-semibold'>Skill Development</div>
                <div className='text-xs text-gray-400'>Learn from experienced validators</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`transition-colors ${
            !prefersDuo ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 bg-gray-800/50'
          }`}
        >
          <CardHeader className='pb-3'>
            <CardTitle className='text-white text-lg flex items-center gap-2'>
              <User className='w-5 h-5 text-blue-400' />
              Solo Validation Benefits
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='flex items-start gap-2'>
              <CheckCircle className='w-4 h-4 text-green-400 mt-0.5' />
              <div>
                <div className='text-white font-semibold'>Immediate Start</div>
                <div className='text-xs text-gray-400'>
                  No need to wait for partner availability
                </div>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <Star className='w-4 h-4 text-yellow-400 mt-0.5' />
              <div>
                <div className='text-white font-semibold'>Full Autonomy</div>
                <div className='text-xs text-gray-400'>
                  Complete control over validation schedule
                </div>
              </div>
            </div>
            <div className='flex items-start gap-2'>
              <User className='w-4 h-4 text-blue-400 mt-0.5' />
              <div>
                <div className='text-white font-semibold'>Privacy</div>
                <div className='text-xs text-gray-400'>No location sharing required</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Panel */}
      <Card className='bg-blue-500/10 border border-blue-500'>
        <CardContent className='p-4'>
          <div className='flex items-start gap-3'>
            <Info className='w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0' />
            <div>
              <div className='text-blue-400 font-semibold mb-2'>How Duo Validation Works</div>
              <ul className='text-sm text-blue-300 space-y-1'>
                <li>• When enabled, you'll be matched with other duo-preferring validators</li>
                <li>• Both validators visit the same solar project site</li>
                <li>• Validation requires consensus between both validators</li>
                <li>• Both validators receive the +50% OWP bonus upon successful validation</li>
                <li>• Location sharing only occurs during active validation sessions</li>
                <li>• You can disable this preference at any time</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      <Card className='bg-gray-800/50 border-gray-700'>
        <CardHeader>
          <CardTitle className='text-white text-sm'>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>{prefersDuo ? '75' : '50'}</div>
              <div className='text-xs text-gray-400'>OWP per Validation</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>{prefersDuo ? 'Duo' : 'Solo'}</div>
              <div className='text-xs text-gray-400'>Validation Mode</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
