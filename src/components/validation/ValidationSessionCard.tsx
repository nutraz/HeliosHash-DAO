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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuthContext';
import { validationSessionService } from '@/services/validationSessionService';
import { ValidationSession } from '@/types/validation';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Coins,
  Play,
  Star,
  User,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface ValidationSessionCardProps {
  session: ValidationSession;
  onSessionUpdate?: () => void;
}

export function ValidationSessionCard({ session, onSessionUpdate }: ValidationSessionCardProps) {
  const { user } = useAuth();
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states for completion
  const [findings, setFindings] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(5);
  const [cancelReason, setCancelReason] = useState('');

  // Check if current user is assigned to this session
  const userValidator = session.validators.find((v) => v.validatorId === user?.id);
  const isUserAssigned = !!userValidator;
  const userRole = userValidator?.validatorRole;

  // Get partner info for duo sessions
  const partner =
    session.sessionType === 'duo'
      ? session.validators.find((v) => v.validatorId !== user?.id)
      : null;

  // Determine session state
  const canStart = isUserAssigned && session.status === 'Scheduled';
  const canComplete =
    isUserAssigned && session.status === 'InProgress' && userValidator?.status !== 'Completed';
  const canCancel = isUserAssigned && session.status === 'Scheduled';
  const isCompleted = session.status === 'Completed';
  const userHasCompleted = userValidator?.status === 'Completed';

  const handleStartSession = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const result = await validationSessionService.startValidationSession(session.id, user.id);
      if (result.success) {
        setShowStartDialog(false);
        onSessionUpdate?.();
      }
      // Show success/error message (in real app, use toast)
      console.log(result.message);
    } catch (error) {
      console.error('Failed to start session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteValidation = async () => {
    if (!user || !findings.trim()) return;

    setLoading(true);
    try {
      const result = await validationSessionService.completeValidationSession(
        session.id,
        user.id,
        findings,
        [], // photos - would be file uploads in real app
        recommendations,
        rating
      );

      if (result.success) {
        setShowCompleteDialog(false);
        setFindings('');
        setRecommendations('');
        setRating(5);
        onSessionUpdate?.();
      }

      // Show success/error message with reward info
      console.log(result.message);
      if (result.rewardEarned && result.rewardEarned > 0) {
        console.log(`🎉 You earned ${result.rewardEarned} OWP!`);
      }
    } catch (error) {
      console.error('Failed to complete validation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSession = async () => {
    if (!user || !cancelReason.trim()) return;

    setLoading(true);
    try {
      const result = await validationSessionService.cancelValidationSession(
        session.id,
        user.id,
        cancelReason
      );

      if (result.success) {
        setShowCancelDialog(false);
        setCancelReason('');
        onSessionUpdate?.();
      }

      console.log(result.message);
    } catch (error) {
      console.error('Failed to cancel session:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-500';
      case 'InProgress':
        return 'bg-yellow-500';
      case 'Completed':
        return 'bg-green-500';
      case 'Cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSessionTypeColor = (type: string) => {
    return type === 'duo' ? 'text-green-400 border-green-500' : 'text-blue-400 border-blue-500';
  };

  return (
    <>
      <Card className='bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all'>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between'>
            <div>
              <CardTitle className='text-white text-lg'>
                Validation Session #{session.id.split('_')[1]}
              </CardTitle>
              <div className='flex items-center gap-2 mt-2'>
                <Badge variant='outline' className={getSessionTypeColor(session.sessionType)}>
                  {session.sessionType === 'duo' ? (
                    <div className='flex items-center gap-1'>
                      <Users className='w-3 h-3' />
                      Duo Validation
                    </div>
                  ) : (
                    <div className='flex items-center gap-1'>
                      <User className='w-3 h-3' />
                      Solo Validation
                    </div>
                  )}
                </Badge>
                <Badge
                  variant='outline'
                  className={`${getStatusColor(session.status)} text-white border-0`}
                >
                  {session.status}
                </Badge>
                {userRole && (
                  <Badge variant='outline' className='text-purple-400 border-purple-500'>
                    {userRole} Validator
                  </Badge>
                )}
              </div>
            </div>

            <div className='text-right'>
              <div className='flex items-center gap-1 text-yellow-400'>
                <Coins className='w-4 h-4' />
                <span className='font-semibold'>
                  {session.sessionType === 'duo'
                    ? Math.floor(session.totalReward / 2)
                    : session.totalReward}{' '}
                  OWP
                </span>
              </div>
              <div className='text-xs text-gray-400 mt-1'>
                {session.sessionType === 'duo' ? 'Each validator' : 'Total reward'}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className='space-y-4'>
            {/* Session timing */}
            <div className='flex items-center gap-4 text-sm text-gray-300'>
              <div className='flex items-center gap-1'>
                <Calendar className='w-4 h-4 text-blue-400' />
                {formatDateTime(session.startTime)}
              </div>
              {session.endTime && (
                <div className='flex items-center gap-1'>
                  <Clock className='w-4 h-4 text-gray-400' />
                  Completed: {formatDateTime(session.endTime)}
                </div>
              )}
            </div>

            {/* Partner info for duo sessions */}
            {session.sessionType === 'duo' && partner && (
              <div className='bg-gray-700/30 rounded-lg p-3'>
                <div className='text-sm text-gray-400 mb-2'>Validation Partner:</div>
                <div className='flex items-center gap-3'>
                  <Avatar className='w-8 h-8'>
                    <AvatarFallback>{partner.validatorName[0]}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1'>
                    <div className='font-semibold text-white'>{partner.validatorName}</div>
                    <div className='text-xs text-gray-400'>
                      {partner.validatorRole} • Status: {partner.status}
                    </div>
                  </div>
                  {partner.status === 'Completed' && (
                    <CheckCircle className='w-5 h-5 text-green-400' />
                  )}
                </div>
              </div>
            )}

            {/* Validation progress */}
            {session.status === 'InProgress' && session.sessionType === 'duo' && (
              <div className='bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3'>
                <div className='flex items-center gap-2 text-yellow-400 mb-2'>
                  <AlertCircle className='w-4 h-4' />
                  <span className='font-semibold'>Validation in Progress</span>
                </div>
                <div className='text-sm text-gray-300'>
                  {userHasCompleted ? (
                    <span>
                      You've completed your validation. Waiting for your partner to finish.
                    </span>
                  ) : partner?.status === 'Completed' ? (
                    <span>
                      Your partner has completed their validation. Please complete yours to finish
                      the session.
                    </span>
                  ) : (
                    <span>
                      Both validators are working on the validation. Collaborate for best results!
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Results summary for completed sessions */}
            {isCompleted && session.results && session.results.length > 0 && (
              <div className='bg-green-500/10 border border-green-500/30 rounded-lg p-3'>
                <div className='flex items-center gap-2 text-green-400 mb-2'>
                  <CheckCircle className='w-4 h-4' />
                  <span className='font-semibold'>Validation Completed</span>
                </div>
                <div className='text-sm text-gray-300'>
                  {session.results.length} validation result{session.results.length > 1 ? 's' : ''}{' '}
                  submitted. Average rating:{' '}
                  {(
                    session.results.reduce((sum, r) => sum + r.rating, 0) / session.results.length
                  ).toFixed(1)}
                  /5
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className='flex items-center gap-2 pt-2'>
              {canStart && (
                <Button
                  onClick={() => setShowStartDialog(true)}
                  className='bg-blue-600 hover:bg-blue-700'
                  size='sm'
                >
                  <Play className='w-4 h-4 mr-1' />
                  Start Validation
                </Button>
              )}

              {canComplete && (
                <Button
                  onClick={() => setShowCompleteDialog(true)}
                  className='bg-green-600 hover:bg-green-700'
                  size='sm'
                >
                  <CheckCircle className='w-4 h-4 mr-1' />
                  Complete Validation
                </Button>
              )}

              {canCancel && (
                <Button
                  onClick={() => setShowCancelDialog(true)}
                  variant='outline'
                  className='border-red-500 text-red-400 hover:bg-red-500/20'
                  size='sm'
                >
                  <X className='w-4 h-4 mr-1' />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Session Dialog */}
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent className='bg-gray-800 border-gray-700 text-white'>
          <DialogHeader>
            <DialogTitle>Start Validation Session</DialogTitle>
            <DialogDescription className='text-gray-400'>
              {session.sessionType === 'duo'
                ? "You're about to start a duo validation session. Your partner will be notified."
                : "You're about to start a solo validation session."}
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <div className='text-sm text-gray-300'>
              Ready to begin? Make sure you have everything needed for the validation.
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowStartDialog(false)}
              className='border-gray-600 text-gray-300'
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartSession}
              disabled={loading}
              className='bg-blue-600 hover:bg-blue-700'
            >
              {loading ? 'Starting...' : 'Start Session'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Validation Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className='bg-gray-800 border-gray-700 text-white max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Complete Validation</DialogTitle>
            <DialogDescription className='text-gray-400'>
              Submit your validation findings and recommendations.
            </DialogDescription>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <div>
              <Label htmlFor='findings' className='text-white'>
                Validation Findings *
              </Label>
              <Textarea
                id='findings'
                placeholder='Describe what you observed, any issues found, compliance status, etc...'
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
                className='bg-gray-700 border-gray-600 text-white mt-2 min-h-[120px]'
              />
            </div>

            <div>
              <Label htmlFor='recommendations' className='text-white'>
                Recommendations
              </Label>
              <Textarea
                id='recommendations'
                placeholder='Any recommendations for improvement, maintenance, or follow-up actions...'
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                className='bg-gray-700 border-gray-600 text-white mt-2'
              />
            </div>

            <div>
              <Label htmlFor='rating' className='text-white'>
                Overall Quality Rating
              </Label>
              <div className='flex items-center gap-2 mt-2'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => setRating(star as 1 | 2 | 3 | 4 | 5)}
                    className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-500'}`}
                  >
                    <Star className='w-5 h-5' fill={rating >= star ? 'currentColor' : 'none'} />
                  </Button>
                ))}
                <span className='text-sm text-gray-400 ml-2'>
                  {rating}/5 - {['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1]}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowCompleteDialog(false)}
              className='border-gray-600 text-gray-300'
            >
              Cancel
            </Button>
            <Button
              onClick={handleCompleteValidation}
              disabled={loading || !findings.trim()}
              className='bg-green-600 hover:bg-green-700'
            >
              {loading ? 'Submitting...' : 'Complete Validation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Session Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className='bg-gray-800 border-gray-700 text-white'>
          <DialogHeader>
            <DialogTitle>Cancel Validation Session</DialogTitle>
            <DialogDescription className='text-gray-400'>
              {session.sessionType === 'duo'
                ? 'Your partner will be notified of the cancellation.'
                : 'This will cancel your validation session.'}
            </DialogDescription>
          </DialogHeader>

          <div className='py-4'>
            <Label htmlFor='cancelReason' className='text-white'>
              Reason for cancellation *
            </Label>
            <Textarea
              id='cancelReason'
              placeholder='Please provide a reason for cancelling this session...'
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className='bg-gray-700 border-gray-600 text-white mt-2'
            />
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setShowCancelDialog(false)}
              className='border-gray-600 text-gray-300'
            >
              Keep Session
            </Button>
            <Button
              onClick={handleCancelSession}
              disabled={loading || !cancelReason.trim()}
              variant='destructive'
            >
              {loading ? 'Cancelling...' : 'Cancel Session'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
