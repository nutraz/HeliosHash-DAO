// Dispute Resolution Types for HeliosHash DAO
// Generated TypeScript definitions for the Motoko canister

export type DisputeId = number;
export type UserId = string; // Principal as string
export type ProjectId = string;

export enum DisputeCategory {
  ProjectFunding = 'ProjectFunding',
  ContractorPerformance = 'ContractorPerformance',
  GovernanceDecision = 'GovernanceDecision',
  ResourceAllocation = 'ResourceAllocation',
  TechnicalIssue = 'TechnicalIssue',
  CommunityConflict = 'CommunityConflict',
}

export enum DisputeStatus {
  Filed = 'Filed',
  UnderReview = 'UnderReview',
  InArbitration = 'InArbitration',
  Resolved = 'Resolved',
  Appealed = 'Appealed',
  Closed = 'Closed',
}

export enum DisputePriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export interface Evidence {
  id: number;
  submittedBy: UserId;
  title: string;
  description: string;
  attachments: string[];
  timestamp: bigint;
}

export interface Vote {
  voter: UserId;
  decision: boolean; // true = in favor of complainant
  reasoning?: string;
  timestamp: bigint;
}

export interface ArbitratorDecision {
  arbitrator: UserId;
  decision: string;
  reasoning: string;
  compensationAmount?: number;
  actionRequired?: string;
  timestamp: bigint;
}

export interface Dispute {
  id: DisputeId;
  complainant: UserId;
  respondent: UserId;
  category: DisputeCategory;
  priority: DisputePriority;
  title: string;
  description: string;
  relatedProjectId?: ProjectId;
  evidence: Evidence[];
  status: DisputeStatus;
  votes: Vote[];
  arbitratorDecision?: ArbitratorDecision;
  resolutionDeadline?: bigint;
  createdAt: bigint;
  updatedAt: bigint;
  tags: string[];
}

export interface CreateDisputeRequest {
  respondent: UserId;
  category: DisputeCategory;
  priority: DisputePriority;
  title: string;
  description: string;
  relatedProjectId?: ProjectId;
  tags: string[];
}

export interface ArbitratorProfile {
  userId: UserId;
  isActive: boolean;
  specializations: DisputeCategory[];
  casesResolved: number;
  averageResolutionTime: number; // in hours
  rating: number;
  certifications: string[];
}

export interface DisputeStats {
  total: number;
  byStatus: Array<[DisputeStatus, number]>;
  byCategory: Array<[DisputeCategory, number]>;
  avgResolutionTime: number;
}

// API Response types
export type CreateDisputeResponse = { ok: DisputeId } | { err: string };
export type SubmitEvidenceResponse = { ok: number } | { err: string };
export type VoteResponse = { ok: string } | { err: string };
export type ArbitratorDecisionResponse = { ok: string } | { err: string };
export type RegisterArbitratorResponse = { ok: string } | { err: string };

// Frontend utility types
export interface DisputeFormData {
  respondent: string;
  category: DisputeCategory;
  priority: DisputePriority;
  title: string;
  description: string;
  relatedProjectId?: string;
  tags: string[];
}

export interface EvidenceFormData {
  title: string;
  description: string;
  attachments: File[];
}

export interface VoteFormData {
  decision: boolean;
  reasoning?: string;
}

export interface ArbitratorDecisionFormData {
  decision: string;
  reasoning: string;
  compensationAmount?: number;
  actionRequired?: string;
}

// Helper functions for frontend
export const getDisputeStatusColor = (status: DisputeStatus): string => {
  switch (status) {
    case DisputeStatus.Filed:
      return 'blue';
    case DisputeStatus.UnderReview:
      return 'yellow';
    case DisputeStatus.InArbitration:
      return 'orange';
    case DisputeStatus.Resolved:
      return 'green';
    case DisputeStatus.Appealed:
      return 'purple';
    case DisputeStatus.Closed:
      return 'gray';
    default:
      return 'gray';
  }
};

export const getDisputePriorityColor = (priority: DisputePriority): string => {
  switch (priority) {
    case DisputePriority.Low:
      return 'green';
    case DisputePriority.Medium:
      return 'yellow';
    case DisputePriority.High:
      return 'orange';
    case DisputePriority.Critical:
      return 'red';
    default:
      return 'gray';
  }
};

export const formatDisputeCategory = (category: DisputeCategory): string => {
  switch (category) {
    case DisputeCategory.ProjectFunding:
      return 'Project Funding';
    case DisputeCategory.ContractorPerformance:
      return 'Contractor Performance';
    case DisputeCategory.GovernanceDecision:
      return 'Governance Decision';
    case DisputeCategory.ResourceAllocation:
      return 'Resource Allocation';
    case DisputeCategory.TechnicalIssue:
      return 'Technical Issue';
    case DisputeCategory.CommunityConflict:
      return 'Community Conflict';
    default:
      return category;
  }
};
