// Stub types for validation session service
export interface ValidationResult {
  validatorId: string;
  findings: string;
  photos: string[];
  recommendations: string;
  rating: 1 | 2 | 3 | 4 | 5;
  timestamp: number;
}

export interface ValidationSession {
  id: string;
  opportunityId: string;
  validators: ValidatorAssignment[];
  startedAt?: number;
  completedAt?: number;
  status: string;
  sessionType?: string;
  startTime?: number;
  endTime?: number;
  totalReward?: number;
  results: ValidationResult[];
}

export interface ValidatorAssignment {
  validatorId: string;
  validatorName: string;
  validatorRole: string;
  assignedAt: number;
  status: string;
}
export interface Validator {
  validatorId: string;
  validatorName: string;
  validatorRole: string;
  assignedAt?: number;
  status?: string;
  prefersDuoValidation?: boolean;
}
// Minimal stub for validation types

export type ValidationFilters = {
  status?: string;
  type?: string;
  validationType?: string[];
  experienceLevel?: string[];
  location?: string;
  duoPreference?: 'solo-only' | 'duo-only' | 'duo-preferred' | 'any';
  minReward?: number;
  maxDuration?: number;
  dateRange?: { start: number; end: number };
};

export interface ValidationOpportunity {
  id: string;
  title: string;
  description?: string;
  status?: string;
  type?: string;
  projectId?: string;
  projectName?: string;
  projectLocation?: string;
  validationType?: string;
  estimatedDuration?: number;
  requiredSkills?: string[];
  experienceLevel?: string;
  supportsDuoValidation?: boolean;
  requiresDuoValidation?: boolean;
  currentValidators: Validator[];
  maxValidators?: number;
  baseReward?: number;
  duoBonus?: number;
  location?: {
    type?: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  scheduledDate?: number;
  deadline?: number;
  priority?: string;
  createdBy?: string;
  createdAt?: number;
}
