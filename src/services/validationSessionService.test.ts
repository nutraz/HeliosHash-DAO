import { describe, it, expect, beforeEach, vi } from 'vitest';
import { validationSessionService, SessionCreationRequest } from './validationSessionService';

describe('ValidationSessionService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createValidationSession', () => {
    const soloRequest: SessionCreationRequest = {
      opportunityId: 'opp-001',
      sessionType: 'solo',
      primaryValidatorId: 'validator-1',
      primaryValidatorName: 'John Doe',
      scheduledStartTime: Date.now() + 3600000,
      estimatedDuration: 2,
    };

    it('should create solo validation session', async () => {
      const result = await validationSessionService.createValidationSession(soloRequest);
      expect(result.success).toBe(true);
      expect(result.session?.sessionType).toBe('solo');
      expect(result.session?.validators).toHaveLength(1);
    });

    it('should create duo validation session with two validators', async () => {
      const duoRequest: SessionCreationRequest = {
        ...soloRequest,
        sessionType: 'duo',
        secondaryValidatorId: 'validator-2',
        secondaryValidatorName: 'Jane Smith',
      };
      const result = await validationSessionService.createValidationSession(duoRequest);
      expect(result.success).toBe(true);
      expect(result.session?.sessionType).toBe('duo');
      expect(result.session?.validators).toHaveLength(2);
    });

    it('should apply 50% bonus for duo sessions', async () => {
      const duoRequest: SessionCreationRequest = {
        ...soloRequest,
        sessionType: 'duo',
        secondaryValidatorId: 'validator-2',
        secondaryValidatorName: 'Jane Smith',
      };
      const result = await validationSessionService.createValidationSession(duoRequest);
      expect(result.session?.totalReward).toBeGreaterThan(50);
    });

    it('should fail without required fields', async () => {
      const invalidRequest = {
        opportunityId: '',
        sessionType: 'solo',
        primaryValidatorId: '',
        primaryValidatorName: '',
        scheduledStartTime: 0,
        estimatedDuration: 0,
      } as SessionCreationRequest;
      const result = await validationSessionService.createValidationSession(invalidRequest);
      expect(result.success).toBe(false);
    });

    it('should fail duo session without secondary validator', async () => {
      const invalidDuoRequest: SessionCreationRequest = {
        ...soloRequest,
        sessionType: 'duo',
      };
      const result = await validationSessionService.createValidationSession(invalidDuoRequest);
      expect(result.success).toBe(false);
      expect(result.message).toContain('second validator');
    });
  });

  describe('startValidationSession', () => {
    let sessionId: string;

    beforeEach(async () => {
      const request: SessionCreationRequest = {
        opportunityId: 'opp-002',
        sessionType: 'solo',
        primaryValidatorId: 'val-1',
        primaryValidatorName: 'Validator One',
        scheduledStartTime: Date.now(),
        estimatedDuration: 1,
      };
      const result = await validationSessionService.createValidationSession(request);
      sessionId = result.session!.id;
    });

    it('should start session for assigned validator', async () => {
      const result = await validationSessionService.startValidationSession(sessionId, 'val-1');
      expect(result.success).toBe(true);
    });

    it('should fail for non-assigned validator', async () => {
      const result = await validationSessionService.startValidationSession(sessionId, 'val-999');
      expect(result.success).toBe(false);
      expect(result.message).toContain('not assigned');
    });

    it('should fail for invalid session ID', async () => {
      const result = await validationSessionService.startValidationSession('invalid-id', 'val-1');
      expect(result.success).toBe(false);
    });
  });

  describe('completeValidationSession', () => {
    let sessionId: string;

    beforeEach(async () => {
      const request: SessionCreationRequest = {
        opportunityId: 'opp-003',
        sessionType: 'solo',
        primaryValidatorId: 'val-complete',
        primaryValidatorName: 'Complete Validator',
        scheduledStartTime: Date.now(),
        estimatedDuration: 1,
      };
      const result = await validationSessionService.createValidationSession(request);
      sessionId = result.session!.id;
      await validationSessionService.startValidationSession(sessionId, 'val-complete');
    });

    it('should complete solo session and award OWP', async () => {
      const result = await validationSessionService.completeValidationSession(
        sessionId,
        'val-complete',
        'All checks passed',
        ['photo1.jpg'],
        'No issues found',
        5
      );
      expect(result.success).toBe(true);
      expect(result.sessionComplete).toBe(true);
      expect(result.rewardEarned).toBeGreaterThan(0);
    });

    it('should wait for partner in duo session', async () => {
      const duoRequest: SessionCreationRequest = {
        opportunityId: 'opp-duo',
        sessionType: 'duo',
        primaryValidatorId: 'val-1',
        primaryValidatorName: 'Val One',
        secondaryValidatorId: 'val-2',
        secondaryValidatorName: 'Val Two',
        scheduledStartTime: Date.now(),
        estimatedDuration: 2,
      };
      const createResult = await validationSessionService.createValidationSession(duoRequest);
      const duoSessionId = createResult.session!.id;
      await validationSessionService.startValidationSession(duoSessionId, 'val-1');

      const result = await validationSessionService.completeValidationSession(
        duoSessionId,
        'val-1',
        'First validation done'
      );
      expect(result.success).toBe(true);
      expect(result.sessionComplete).toBe(false);
      expect(result.rewardEarned).toBe(0);
    });
  });

  describe('getUserValidationSessions', () => {
    it('should return user sessions', async () => {
      const request: SessionCreationRequest = {
        opportunityId: 'opp-user',
        sessionType: 'solo',
        primaryValidatorId: 'user-1',
        primaryValidatorName: 'User One',
        scheduledStartTime: Date.now(),
        estimatedDuration: 1,
      };
      await validationSessionService.createValidationSession(request);
      const sessions = await validationSessionService.getUserValidationSessions('user-1');
      expect(sessions.length).toBeGreaterThan(0);
    });

    it('should filter by status', async () => {
      const sessions = await validationSessionService.getUserValidationSessions(
        'user-1',
        'Scheduled'
      );
      sessions.forEach((s) => expect(s.status).toBe('Scheduled'));
    });
  });

  describe('getUserValidationStats', () => {
    it('should return validation statistics', async () => {
      const stats = await validationSessionService.getUserValidationStats('val-stats');
      expect(stats).toHaveProperty('totalSessions');
      expect(stats).toHaveProperty('completedSessions');
      expect(stats).toHaveProperty('totalOWPEarned');
    });
  });
});