/**
 * Validation Session Service
 * Manages duo/solo validation sessions, partner pairing, and reward calculations
 */

import { OWP_TOKEN_DECIMALS } from '@/types/owp-token';
import { Principal } from '@dfinity/principal';
import { ValidationResult, ValidationSession, ValidatorAssignment } from '../types/validation';
import { owpTokenService } from './owpTokenService';

export interface SessionCreationRequest {
  opportunityId: string;
  sessionType: 'solo' | 'duo';
  primaryValidatorId: string;
  primaryValidatorName: string;
  secondaryValidatorId?: string;
  secondaryValidatorName?: string;
  scheduledStartTime: number;
  estimatedDuration: number;
}

export interface SessionUpdate {
  sessionId: string;
  status?: ValidationSession['status'];
  actualStartTime?: number;
  actualEndTime?: number;
  results?: ValidationResult[];
}

class ValidationSessionService {
  private sessions: ValidationSession[] = [];
  private sessionCounter = 1;

  /**
   * Create a new validation session (solo or duo)
   */
  async createValidationSession(request: SessionCreationRequest): Promise<{
    success: boolean;
    session?: ValidationSession;
    message: string;
  }> {
    try {
      // Validate the request
      if (!request.opportunityId || !request.primaryValidatorId) {
        return { success: false, message: 'Missing required validation information' };
      }

      if (request.sessionType === 'duo' && !request.secondaryValidatorId) {
        return { success: false, message: 'Duo validation requires a second validator' };
      }

      // Create validators array
      const validators: ValidatorAssignment[] = [
        {
          validatorId: request.primaryValidatorId,
          validatorName: request.primaryValidatorName,
          validatorRole: 'Primary',
          assignedAt: Date.now(),
          status: 'Assigned',
        },
      ];

      // Add secondary validator for duo sessions
      if (request.sessionType === 'duo' && request.secondaryValidatorId) {
        validators.push({
          validatorId: request.secondaryValidatorId,
          validatorName: request.secondaryValidatorName || 'Unknown',
          validatorRole: 'Secondary',
          assignedAt: Date.now(),
          status: 'Assigned',
        });
      }

      // Calculate total reward based on session type
      const baseReward = this.getBaseRewardForOpportunity(request.opportunityId);
      const totalReward =
        request.sessionType === 'duo'
          ? baseReward + Math.floor(baseReward * 0.5) // +50% bonus for duo
          : baseReward;

      // Create the session
      const session: ValidationSession = {
        id: `session_${this.sessionCounter++}_${Date.now()}`,
        opportunityId: request.opportunityId,
        validators,
        sessionType: request.sessionType,
        startTime: request.scheduledStartTime,
        status: 'Scheduled',
        totalReward,
        results: [],
      };

      this.sessions.push(session);

      // Notify validators (in a real app, this would send notifications)
      await this.notifyValidators(session);

      return {
        success: true,
        session,
        message: `${
          request.sessionType === 'duo' ? 'Duo' : 'Solo'
        } validation session created successfully. Total reward: ${totalReward} OWP`,
      };
    } catch (error) {
      console.error('Failed to create validation session:', error);
      return {
        success: false,
        message: 'Failed to create validation session. Please try again.',
      };
    }
  }

  /**
   * Start a validation session
   */
  async startValidationSession(
    sessionId: string,
    validatorId: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (!session) {
      return { success: false, message: 'Validation session not found' };
    }

    // Check if validator is assigned to this session
    const validator = session.validators.find((v) => v.validatorId === validatorId);
    if (!validator) {
      return { success: false, message: 'You are not assigned to this validation session' };
    }

    // Update session status
    session.status = 'InProgress';
    session.startTime = Date.now();
    validator.status = 'InProgress';

    // For duo sessions, notify the partner
    if (session.sessionType === 'duo') {
      const partner = session.validators.find((v) => v.validatorId !== validatorId);
      if (partner) {
        await this.notifyPartnerSessionStarted(session, partner, validator);
      }
    }

    return {
      success: true,
      message: `Validation session started. ${
        session.sessionType === 'duo' ? 'Your partner has been notified.' : ''
      }`,
    };
  }

  /**
   * Complete a validation session with results
   */
  async completeValidationSession(
    sessionId: string,
    validatorId: string,
    findings: string,
    photos: string[] = [],
    recommendations: string = '',
    rating: 1 | 2 | 3 | 4 | 5 = 5
  ): Promise<{
    success: boolean;
    message: string;
    rewardEarned?: number;
    sessionComplete?: boolean;
  }> {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (!session) {
      return { success: false, message: 'Validation session not found' };
    }

    // Check if validator is assigned to this session
    const validator = session.validators.find((v) => v.validatorId === validatorId);
    if (!validator) {
      return { success: false, message: 'You are not assigned to this validation session' };
    }

    // Add validation result
    const result: ValidationResult = {
      validatorId,
      findings,
      photos,
      recommendations,
      rating,
      timestamp: Date.now(),
    };

    if (!session.results) {
      session.results = [];
    }
    session.results.push(result);
    validator.status = 'Completed';

    // Check if session is complete
    const allValidatorsComplete = session.validators.every((v) => v.status === 'Completed');

    if (allValidatorsComplete) {
      session.status = 'Completed';
      session.endTime = Date.now();

      // Distribute rewards
      const rewardPerValidator =
        session.sessionType === 'duo'
          ? (session.totalReward! / 2) // Split duo reward
          : session.totalReward!; // Full solo reward

      // Update validator OWP balances (mock implementation)
      for (const v of session.validators) {
        await this.awardOWP(v.validatorId, rewardPerValidator);
      }

      return {
        success: true,
        message: `Validation session completed! You earned ${rewardPerValidator} OWP.`,
        rewardEarned: rewardPerValidator,
        sessionComplete: true,
      };
    } else {
      // For duo sessions, notify partner of completion
      if (session.sessionType === 'duo') {
        const partner = session.validators.find((v) => v.validatorId !== validatorId);
        if (partner && partner.status !== 'Completed') {
          await this.notifyPartnerValidationComplete(session, partner, validator);
        }
      }

      return {
        success: true,
        message:
          session.sessionType === 'duo'
            ? 'Your validation submitted. Waiting for your partner to complete their validation.'
            : 'Validation completed successfully!',
        rewardEarned: 0, // Reward distributed only when session is complete
        sessionComplete: false,
      };
    }
  }

  /**
   * Get validation sessions for a user
   */
  async getUserValidationSessions(
    userId: string,
    status?: ValidationSession['status']
  ): Promise<ValidationSession[]> {
    let userSessions = this.sessions.filter((session) =>
      session.validators.some((v) => v.validatorId === userId)
    );

    if (status) {
      userSessions = userSessions.filter((session) => session.status === status);
    }

  return userSessions.sort((a, b) => (b.startTime ?? 0) - (a.startTime ?? 0));
  }

  /**
   * Get session by ID
   */
  async getValidationSession(sessionId: string): Promise<ValidationSession | null> {
    return this.sessions.find((s) => s.id === sessionId) || null;
  }

  /**
   * Cancel a validation session
   */
  async cancelValidationSession(
    sessionId: string,
    userId: string,
    reason: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    const session = this.sessions.find((s) => s.id === sessionId);
    if (!session) {
      return { success: false, message: 'Validation session not found' };
    }

    // Check if user is assigned to this session
    const validator = session.validators.find((v) => v.validatorId === userId);
    if (!validator) {
      return { success: false, message: 'You are not assigned to this validation session' };
    }

    // Only allow cancellation for scheduled sessions
    if (session.status !== 'Scheduled') {
      return { success: false, message: 'Can only cancel scheduled sessions' };
    }

    session.status = 'Cancelled';

    // Notify other validators
    for (const v of session.validators) {
      if (v.validatorId !== userId) {
        await this.notifySessionCancelled(session, v, reason);
      }
    }

    return {
      success: true,
      message: 'Validation session cancelled successfully',
    };
  }

  /**
   * Get validation statistics for a user
   */
  async getUserValidationStats(userId: string): Promise<{
    totalSessions: number;
    completedSessions: number;
    duoSessions: number;
    soloSessions: number;
    totalOWPEarned: number;
    averageRating: number;
    partnerSessions: number;
  }> {
    const userSessions = await this.getUserValidationSessions(userId);

    const completedSessions = userSessions.filter((s) => s.status === 'Completed');
    const duoSessions = userSessions.filter((s) => s.sessionType === 'duo');
    const soloSessions = userSessions.filter((s) => s.sessionType === 'solo');

    // Calculate total OWP earned (mock calculation)
    const totalOWPEarned = completedSessions.reduce((total, session) => {
      const rewardPerValidator =
        session.sessionType === 'duo' ? session.totalReward! / 2 : session.totalReward!;
      return total + rewardPerValidator!;
    }, 0);

    // Calculate average rating from completed sessions
    const ratingsFromUser = completedSessions
      .flatMap((s) => (s.results || []).filter((r) => r.validatorId === userId))
      .map((r) => r.rating);
    const averageRating =
      ratingsFromUser.length > 0
        ? ratingsFromUser.reduce((sum, rating) => sum + rating, 0) / ratingsFromUser.length
        : 0;

    return {
      totalSessions: userSessions.length,
      completedSessions: completedSessions.length,
      duoSessions: duoSessions.length,
      soloSessions: soloSessions.length,
      totalOWPEarned: Math.round(totalOWPEarned),
      averageRating: Number(averageRating.toFixed(1)),
      partnerSessions: duoSessions.length,
    };
  }

  // Private helper methods
  private getBaseRewardForOpportunity(opportunityId: string): number {
    // Mock implementation - in real app, would fetch from validation service
    const rewardMap: Record<string, number> = {
      'val-001': 50,
      'val-002': 40,
      'val-003': 80,
      'val-004': 30,
      'val-005': 70,
    };
    return rewardMap[opportunityId] || 50;
  }

  private async notifyValidators(session: ValidationSession): Promise<void> {
    // Mock notification system - in real app would send push notifications, emails, etc.
    console.log(
      `Notifying validators for session ${session.id}:`,
      session.validators.map((v) => v.validatorName).join(', ')
    );
  }

  private async notifyPartnerSessionStarted(
    session: ValidationSession,
    partner: ValidatorAssignment,
    starter: ValidatorAssignment
  ): Promise<void> {
    console.log(
      `Notifying ${partner.validatorName} that ${starter.validatorName} started session ${session.id}`
    );
  }

  private async notifyPartnerValidationComplete(
    session: ValidationSession,
    partner: ValidatorAssignment,
    completer: ValidatorAssignment
  ): Promise<void> {
    console.log(
      `Notifying ${partner.validatorName} that ${completer.validatorName} completed their validation for session ${session.id}`
    );
  }

  private async notifySessionCancelled(
    session: ValidationSession,
    validator: ValidatorAssignment,
    reason: string
  ): Promise<void> {
    console.log(
      `Notifying ${validator.validatorName} that session ${session.id} was cancelled. Reason: ${reason}`
    );
  }

  private async awardOWP(validatorId: string, amount: number): Promise<void> {
    try {
      const principal = Principal.fromText(validatorId);
      // Convert amount to the smallest indivisible unit using the token's decimals
      const amountInSmallestUnit = BigInt(Math.round(amount * 10 ** OWP_TOKEN_DECIMALS));

      // Call the real OWP token canister to mint the reward
      const result = await owpTokenService.mint(principal, amountInSmallestUnit);

      if (result && 'ok' in result) {
        console.log(`Successfully awarded ${amount} OWP to validator ${validatorId}`);
      } else {
        console.error(
          `Failed to award OWP to ${validatorId}:`,
          result ? ('err' in result ? result.err : 'Unknown error') : 'No result'
        );
      }
    } catch (error) {
      console.error(`Error awarding OWP to ${validatorId}:`, error);
    }
  }
}

export const validationSessionService = new ValidationSessionService();
