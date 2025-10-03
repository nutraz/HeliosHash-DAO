'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuthContext';
import { identityService } from '@/services/identityService';
import { validationSessionService } from '@/services/validationSessionService';
import { ValidationOpportunity, ValidatorProfile } from '@/types/validation';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Coins,
  MapPin,
  Shield,
  Star,
  Timer,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface DuoValidationOpportunityCardProps {
  opportunity: ValidationOpportunity;
  onApply?: (opportunityId: string, sessionType: 'solo' | 'duo') => void;
  onViewDetails?: (opportunity: ValidationOpportunity) => void;
  showPartnerMatches?: boolean;
}

export function DuoValidationOpportunityCard({
  opportunity,
  onApply,
  onViewDetails,
  showPartnerMatches = true,
}: DuoValidationOpportunityCardProps) {
  const { user } = useAuth();
  const [showApplicationDialog, setShowApplicationDialog] = useState(false);
  const [availablePartners, setAvailablePartners] = useState<ValidatorProfile[]>([]);
  const [selectedSessionType, setSelectedSessionType] = useState<'solo' | 'duo'>('solo');
  const [loadingPartners, setLoadingPartners] = useState(false);

  // Calculate rewards
  const soloReward = opportunity.baseReward;
  const duoReward =
    opportunity.baseReward + (opportunity.duoBonus || Math.floor(opportunity.baseReward * 0.5));

  // Determine availability status
  const isSoloAvailable =
    opportunity.maxValidators >= 1 && opportunity.currentValidators.length === 0;
  const isDuoAvailable =
    opportunity.supportsDuoValidation &&
    opportunity.maxValidators === 2 &&
    opportunity.currentValidators.length < 2;
  const isPartiallyFilled =
    opportunity.currentValidators.length === 1 && opportunity.maxValidators === 2;

  // Check if user prefers duo validation
  const userPrefersDuo = user?.prefersDuoValidation || false;

  useEffect(() => {
    if (showPartnerMatches && userPrefersDuo && isDuoAvailable && showApplicationDialog) {
      loadPotentialPartners();
    }
  }, [showApplicationDialog, userPrefersDuo, isDuoAvailable, showPartnerMatches]);

  const loadPotentialPartners = async () => {
    setLoadingPartners(true);
    try {
      // Get principals with duo preference
      const duoPrincipals = await identityService.getUsersWithDuoPreference();

      // Create mock partner profiles for demo
      // In a real implementation, you'd fetch full profiles for each principal
      const partners: ValidatorProfile[] = duoPrincipals
        .slice(0, 5) // Limit to first 5 for demo
        .map((principal, index) => ({
          id: principal.toString(),
          name: `Validator ${index + 1}`, // Mock names
          location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'][index] || 'Unknown',
          skills:
            [
              ['Solar Installation', 'Safety Protocols'],
              ['Performance Analysis', 'Data Collection'],
              ['Compliance', 'Safety Audit'],
              ['Grid Integration', 'Power Quality'],
              ['Maintenance', 'Quality Control'],
            ][index] || [],
          experienceLevel: (['Entry', 'Mid', 'Senior'] as const)[index % 3],
          prefersDuoValidation: true,
          completedValidations: Math.floor(Math.random() * 50),
          rating: 4 + Math.random(),
          availability: [],
        }))
        .filter((partner) => partner.id !== user?.id) // Filter out current user
        .filter(
          (partner) => !opportunity.currentValidators.some((v) => v.validatorId === partner.id)
        ); // Filter already assigned

      setAvailablePartners(partners.slice(0, 3)); // Show top 3 matches
    } catch (error) {
      console.error('Failed to load potential partners:', error);
      setAvailablePartners([]);
    } finally {
      setLoadingPartners(false);
    }
  };

  const handleApply = async () => {
    if (!user) return;

    try {
      // For duo sessions, we might want to select a specific partner
      // For now, we'll create the session and let the system handle pairing
      const sessionRequest = {
        opportunityId: opportunity.id,
        sessionType: selectedSessionType,
        primaryValidatorId: user.id,
        primaryValidatorName: user.displayName || user.username || 'Unknown',
        scheduledStartTime: opportunity.scheduledDate,
        estimatedDuration: opportunity.estimatedDuration,
        // For duo sessions, secondary validator would be assigned when someone joins
      };

      const result = await validationSessionService.createValidationSession(sessionRequest);

      if (result.success) {
        console.log('✅ Validation session created:', result.message);

        // Call the parent callback for UI updates
        if (onApply) {
          onApply(opportunity.id, selectedSessionType);
        }
      } else {
        console.error('❌ Failed to create session:', result.message);
      }
    } catch (error) {
      console.error('Error creating validation session:', error);
    }

    setShowApplicationDialog(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getValidationTypeIcon = (type: string) => {
    switch (type) {
      case 'Installation':
        return <Zap className='w-4 h-4' />;
      case 'Maintenance':
        return <Shield className='w-4 h-4' />;
      case 'Performance':
        return <Star className='w-4 h-4' />;
      case 'Compliance':
        return <CheckCircle className='w-4 h-4' />;
      case 'Safety':
        return <Shield className='w-4 h-4' />;
      default:
        return <CheckCircle className='w-4 h-4' />;
    }
  };

  return (
    <>
      <Card className='bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-200 group'>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-blue-500/20 rounded-lg'>
                {getValidationTypeIcon(opportunity.validationType)}
              </div>
              <div>
                <CardTitle className='text-white text-lg group-hover:text-blue-400 transition-colors'>
                  {opportunity.title}
                </CardTitle>
                <div className='flex items-center gap-2 mt-1'>
                  <Badge variant='outline' className='text-blue-400 border-blue-500'>
                    {opportunity.validationType}
                  </Badge>
                  <Badge
                    variant='outline'
                    className={`${getPriorityColor(opportunity.priority)} text-white border-0`}
                  >
                    {opportunity.priority}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Status indicator */}
            <div className='text-right'>
              <div className='text-sm text-gray-400'>
                {opportunity.currentValidators.length}/{opportunity.maxValidators} validators
              </div>
              {isPartiallyFilled && (
                <Badge variant='outline' className='text-yellow-400 border-yellow-500 mt-1'>
                  Partner Needed
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className='pt-0'>
          {/* Project info */}
          <div className='space-y-3 mb-4'>
            <div className='flex items-center gap-2 text-gray-300'>
              <MapPin className='w-4 h-4 text-blue-400' />
              <span className='text-sm'>{opportunity.projectName}</span>
              <span className='text-gray-500'>•</span>
              <span className='text-sm'>{opportunity.location.address}</span>
            </div>

            <div className='flex items-center gap-4 text-sm text-gray-400'>
              <div className='flex items-center gap-1'>
                <Calendar className='w-4 h-4' />
                {formatDate(opportunity.scheduledDate)} at {formatTime(opportunity.scheduledDate)}
              </div>
              <div className='flex items-center gap-1'>
                <Timer className='w-4 h-4' />
                {opportunity.estimatedDuration}h duration
              </div>
            </div>
          </div>

          {/* Description */}
          <p className='text-gray-300 text-sm mb-4 line-clamp-2'>{opportunity.description}</p>

          {/* Rewards section */}
          <div className='bg-gray-700/30 rounded-lg p-3 mb-4'>
            <div className='flex items-center justify-between'>
              <div>
                <div className='text-sm text-gray-400'>Solo Validation</div>
                <div className='flex items-center gap-1'>
                  <Coins className='w-4 h-4 text-yellow-400' />
                  <span className='font-semibold text-white'>{soloReward} OWP</span>
                </div>
              </div>

              {opportunity.supportsDuoValidation && (
                <div className='text-right'>
                  <div className='text-sm text-gray-400'>Duo Validation</div>
                  <div className='flex items-center gap-1 justify-end'>
                    <Coins className='w-4 h-4 text-yellow-400' />
                    <span className='font-semibold text-green-400'>{duoReward} OWP</span>
                    <Badge
                      variant='outline'
                      className='text-green-400 border-green-500 ml-1 text-xs'
                    >
                      +50% Bonus
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Current validators */}
          {opportunity.currentValidators.length > 0 && (
            <div className='mb-4'>
              <div className='text-sm text-gray-400 mb-2'>Current Validators:</div>
              <div className='flex items-center gap-2'>
                {opportunity.currentValidators.map((validator) => (
                  <div
                    key={validator.validatorId}
                    className='flex items-center gap-2 bg-gray-700/50 rounded px-2 py-1'
                  >
                    <Avatar className='w-6 h-6'>
                      <AvatarFallback className='text-xs'>
                        {validator.validatorName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className='text-xs text-white'>{validator.validatorName}</span>
                    <Badge variant='outline' className='text-xs'>
                      {validator.validatorRole}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className='flex items-center justify-between pt-2'>
            <div className='flex items-center gap-2'>
              {isSoloAvailable && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setSelectedSessionType('solo');
                    setShowApplicationDialog(true);
                  }}
                  className='text-blue-400 border-blue-500 hover:bg-blue-500/20'
                >
                  <User className='w-4 h-4 mr-1' />
                  Apply Solo
                </Button>
              )}

              {isDuoAvailable && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    setSelectedSessionType('duo');
                    setShowApplicationDialog(true);
                  }}
                  className='text-green-400 border-green-500 hover:bg-green-500/20'
                >
                  <Users className='w-4 h-4 mr-1' />
                  {isPartiallyFilled ? 'Join Partner' : 'Apply Duo'}
                </Button>
              )}
            </div>

            <Button
              variant='ghost'
              size='sm'
              onClick={() => onViewDetails?.(opportunity)}
              className='text-gray-400 hover:text-white'
            >
              View Details
              <ArrowRight className='w-4 h-4 ml-1' />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Application Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className='bg-gray-800 border-gray-700 text-white'>
          <DialogHeader>
            <DialogTitle>Apply for Validation</DialogTitle>
            <DialogDescription className='text-gray-400'>
              {selectedSessionType === 'solo'
                ? 'Apply for solo validation of this project.'
                : 'Apply for duo validation with enhanced rewards and partner support.'}
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            {/* Opportunity summary */}
            <div className='bg-gray-700/30 rounded-lg p-3'>
              <h4 className='font-semibold text-white mb-2'>{opportunity.title}</h4>
              <div className='space-y-1 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Reward:</span>
                  <span className='text-yellow-400 font-semibold'>
                    {selectedSessionType === 'solo' ? soloReward : duoReward} OWP
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Duration:</span>
                  <span className='text-white'>{opportunity.estimatedDuration} hours</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-400'>Date:</span>
                  <span className='text-white'>
                    {formatDate(opportunity.scheduledDate)} at{' '}
                    {formatTime(opportunity.scheduledDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Duo partner suggestions */}
            {selectedSessionType === 'duo' &&
              showPartnerMatches &&
              availablePartners.length > 0 && (
                <div>
                  <h4 className='font-semibold text-white mb-2'>Suggested Partners</h4>
                  <div className='space-y-2 max-h-40 overflow-y-auto'>
                    {availablePartners.map((partner) => (
                      <div
                        key={partner.id}
                        className='flex items-center justify-between bg-gray-700/50 rounded p-2'
                      >
                        <div className='flex items-center gap-3'>
                          <Avatar className='w-8 h-8'>
                            <AvatarFallback>{partner.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='text-sm font-semibold text-white'>{partner.name}</div>
                            <div className='text-xs text-gray-400'>{partner.location}</div>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className='flex items-center gap-1'>
                            <Star className='w-3 h-3 text-yellow-400' />
                            <span className='text-xs text-white'>{partner.rating.toFixed(1)}</span>
                          </div>
                          <Badge variant='outline' className='text-xs'>
                            {partner.completedValidations} validations
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='text-xs text-gray-400 mt-2'>
                    Partners will be notified when you apply. First-come, first-served for pairing.
                  </div>
                </div>
              )}

            {loadingPartners && selectedSessionType === 'duo' && (
              <div className='text-center py-4 text-gray-400'>Loading potential partners...</div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowApplicationDialog(false)}
              className='border-gray-600 text-gray-300 hover:bg-gray-700'
            >
              Cancel
            </Button>
            <Button
              onClick={handleApply}
              className={
                selectedSessionType === 'solo'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-green-600 hover:bg-green-700'
              }
            >
              <div className='flex items-center gap-2'>
                {selectedSessionType === 'solo' ? (
                  <User className='w-4 h-4' />
                ) : (
                  <Users className='w-4 h-4' />
                )}
                Apply {selectedSessionType === 'solo' ? 'Solo' : 'for Duo'}
              </div>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
