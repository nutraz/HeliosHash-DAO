// Meeting Management Types for HeliosHash DAO
// Inspired by Hyprnote's local-first meeting approach

export type MeetingId = number;
export type UserId = string; // Principal as string
export type Timestamp = number;

export enum MeetingType {
  GovernanceCall = 'GovernanceCall',
  ProjectReview = 'ProjectReview',
  DisputeHearing = 'DisputeHearing',
  CommunityTownHall = 'CommunityTownHall',
  TechnicalDiscussion = 'TechnicalDiscussion',
  StrategicPlanning = 'StrategicPlanning',
}

export enum MeetingStatus {
  Scheduled = 'Scheduled',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

export enum AttendeeRole {
  Organizer = 'Organizer',
  Speaker = 'Speaker',
  Participant = 'Participant',
  Observer = 'Observer',
}

export interface Attendee {
  userId: UserId;
  role: AttendeeRole;
  joinedAt?: Timestamp;
  leftAt?: Timestamp;
}

export interface ActionItem {
  id: number;
  description: string;
  assignedTo: UserId;
  dueDate?: Timestamp;
  status: 'Open' | 'InProgress' | 'Completed';
  createdAt: Timestamp;
}

export interface MeetingNote {
  id: number;
  content: string;
  author: UserId;
  timestamp: Timestamp;
  isPrivate: boolean;
}

export interface TranscriptSegment {
  id: number;
  speaker?: string; // Speaker identification (optional)
  content: string;
  timestamp: Timestamp;
  confidence?: number; // AI confidence score (0-1)
}

export interface MeetingSummary {
  keyPoints: string[];
  actionItems: ActionItem[];
  decisions: string[];
  nextSteps: string[];
  attendeeSummary: string;
  aiGenerated: boolean;
  generatedAt: Timestamp;
}

export interface Meeting {
  id: MeetingId;
  title: string;
  description: string;
  meetingType: MeetingType;
  status: MeetingStatus;
  organizer: UserId;
  attendees: Attendee[];
  scheduledStart: Timestamp;
  scheduledEnd: Timestamp;
  actualStart?: Timestamp;
  actualEnd?: Timestamp;
  location?: string; // Virtual room link or physical location
  agenda: string[];
  notes: MeetingNote[];
  transcript: TranscriptSegment[];
  summary?: MeetingSummary;
  relatedProposalId?: number; // Link to governance proposals
  relatedDisputeId?: number; // Link to dispute resolutions
  tags: string[];
  isPublic: boolean;
  recordingConsent: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateMeetingRequest {
  title: string;
  description: string;
  meetingType: MeetingType;
  scheduledStart: Timestamp;
  scheduledEnd: Timestamp;
  agenda: string[];
  attendeeIds: UserId[];
  location?: string;
  isPublic: boolean;
  recordingConsent: boolean;
  tags: string[];
}

export interface MeetingStats {
  totalMeetings: number;
  activeMeetings: number;
  completedMeetings: number;
}

// Local AI Processing Types (Hyprnote-inspired)
export interface AudioChunk {
  id: string;
  audioData: ArrayBuffer;
  timestamp: Timestamp;
  duration: number;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
  segments: {
    start: number;
    end: number;
    text: string;
  }[];
  language?: string;
}

export interface SummarizationRequest {
  transcript: string;
  notes: string;
  meetingType: MeetingType;
  template: SummaryTemplate;
  autonomyLevel: AutonomyLevel;
}

export enum SummaryTemplate {
  BulletPoints = 'BulletPoints',
  AgendaBased = 'AgendaBased',
  ParagraphSummary = 'ParagraphSummary',
  ActionFocused = 'ActionFocused',
  DecisionFocused = 'DecisionFocused',
}

export enum AutonomyLevel {
  StrictNotes = 'StrictNotes', // Only use explicit notes
  Balanced = 'Balanced', // Mix of notes and transcript
  Creative = 'Creative', // Full transcript interpretation
}

// AI Service Configuration
export interface AIConfig {
  transcriptionModel: 'whisper' | 'deepgram' | 'custom';
  summaryModel: 'ollama' | 'openai' | 'claude' | 'gemini';
  localOnly: boolean;
  enableRealtime: boolean;
  confidenceThreshold: number;
}

// Utility Functions
export const formatMeetingType = (type: MeetingType): string => {
  switch (type) {
    case MeetingType.GovernanceCall:
      return 'Governance Call';
    case MeetingType.ProjectReview:
      return 'Project Review';
    case MeetingType.DisputeHearing:
      return 'Dispute Hearing';
    case MeetingType.CommunityTownHall:
      return 'Community Town Hall';
    case MeetingType.TechnicalDiscussion:
      return 'Technical Discussion';
    case MeetingType.StrategicPlanning:
      return 'Strategic Planning';
    default:
      return type;
  }
};

export const getMeetingStatusColor = (status: MeetingStatus): string => {
  switch (status) {
    case MeetingStatus.Scheduled:
      return 'blue';
    case MeetingStatus.InProgress:
      return 'green';
    case MeetingStatus.Completed:
      return 'gray';
    case MeetingStatus.Cancelled:
      return 'red';
    default:
      return 'gray';
  }
};

export const getMeetingTypeIcon = (type: MeetingType): string => {
  switch (type) {
    case MeetingType.GovernanceCall:
      return '🏛️';
    case MeetingType.ProjectReview:
      return '📊';
    case MeetingType.DisputeHearing:
      return '⚖️';
    case MeetingType.CommunityTownHall:
      return '🏘️';
    case MeetingType.TechnicalDiscussion:
      return '🔧';
    case MeetingType.StrategicPlanning:
      return '🎯';
    default:
      return '📅';
  }
};

export const formatTimestamp = (timestamp: Timestamp): string => {
  return new Date(timestamp).toLocaleDateString();
};

export const formatDuration = (start: Timestamp, end: Timestamp): string => {
  const duration = end - start;
  const hours = Math.floor(duration / (1000 * 60 * 60));
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// API Response Types
export interface CreateMeetingResponse {
  success: boolean;
  meetingId?: MeetingId;
  error?: string;
}

export interface MeetingListResponse {
  meetings: Meeting[];
  total: number;
}

export interface TranscriptionResponse {
  success: boolean;
  segmentId?: number;
  error?: string;
}

export interface SummaryResponse {
  success: boolean;
  summary?: MeetingSummary;
  error?: string;
}
