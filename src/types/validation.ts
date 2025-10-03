/**
 * Validation Opportunities Types
 * Extends existing job types to include validation tasks with duo support
 */

export interface ValidationOpportunity {
  id: string;
  projectId: string;
  projectName: string;
  projectLocation: string;
  validationType: 'Installation' | 'Maintenance' | 'Performance' | 'Compliance' | 'Safety';
  title: string;
  description: string;

  // Validation specific fields
  estimatedDuration: number; // in hours
  requiredSkills: string[];
  experienceLevel: 'Entry' | 'Mid' | 'Senior';

  // Duo validation support
  supportsDuoValidation: boolean;
  requiresDuoValidation: boolean; // Some validations might mandate duo
  currentValidators: ValidatorAssignment[];
  maxValidators: 1 | 2; // Solo or duo

  // Rewards
  baseReward: number; // OWP base reward
  duoBonus?: number; // Additional OWP for duo validation (typically +50%)

  // Location & timing
  location: {
    type: 'OnSite' | 'Remote';
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  scheduledDate: number; // Unix timestamp
  deadline: number; // Unix timestamp

  // Status
  status: 'Open' | 'PartiallyFilled' | 'Full' | 'InProgress' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';

  // Metadata
  createdBy: string;
  createdAt: number;
  updatedAt?: number;
}

export interface ValidatorAssignment {
  validatorId: string;
  validatorName: string;
  validatorRole: 'Primary' | 'Secondary'; // For duo validation
  assignedAt: number;
  status: 'Assigned' | 'Confirmed' | 'InProgress' | 'Completed';
  prefersDuoValidation?: boolean;
}

export interface ValidationFilters {
  validationType?: ValidationOpportunity['validationType'][];
  experienceLevel?: ValidationOpportunity['experienceLevel'][];
  location?: string;
  duoPreference?: 'solo-only' | 'duo-only' | 'duo-preferred' | 'any';
  dateRange?: {
    start: number;
    end: number;
  };
  maxDuration?: number; // in hours
  minReward?: number; // minimum OWP reward
}

// For partner matching
export interface DuoValidationMatch {
  opportunityId: string;
  potentialPartners: ValidatorProfile[];
  proximityScore: number; // 0-1 based on location
  skillCompatibility: number; // 0-1 based on required skills
  availabilityMatch: number; // 0-1 based on schedule
  overallScore: number; // Combined score
}

export interface ValidatorProfile {
  id: string;
  name: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  skills: string[];
  experienceLevel: ValidationOpportunity['experienceLevel'];
  prefersDuoValidation: boolean;
  completedValidations: number;
  rating: number; // 1-5 average rating
  availability: TimeSlot[];
}

export interface TimeSlot {
  start: number; // Unix timestamp
  end: number; // Unix timestamp
  recurring?: 'daily' | 'weekly' | 'none';
}

// For the validation session creation
export interface ValidationSession {
  id: string;
  opportunityId: string;
  validators: ValidatorAssignment[];
  sessionType: 'solo' | 'duo';
  startTime: number;
  endTime?: number;
  status: 'Scheduled' | 'InProgress' | 'Completed' | 'Cancelled';
  results?: ValidationResult[];
  totalReward: number; // Calculated based on base + duo bonus
}

export interface ValidationResult {
  validatorId: string;
  findings: string;
  photos?: string[];
  recommendations: string;
  rating: 1 | 2 | 3 | 4 | 5; // Quality rating
  timestamp: number;
}
