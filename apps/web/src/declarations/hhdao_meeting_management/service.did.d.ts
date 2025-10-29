import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ActionItem {
  id: bigint;
  status: { Open: null } | { InProgress: null } | { Completed: null };
  assignedTo: UserId;
  createdAt: Timestamp;
  dueDate: [] | [Timestamp];
  description: string;
}
export interface Attendee {
  userId: UserId;
  joinedAt: [] | [Timestamp];
  role: AttendeeRole;
  leftAt: [] | [Timestamp];
}
export type AttendeeRole =
  | { Participant: null }
  | { Speaker: null }
  | { Organizer: null }
  | { Observer: null };
export interface CreateMeetingRequest {
  recordingConsent: boolean;
  title: string;
  scheduledStart: Timestamp;
  tags: Array<string>;
  agenda: Array<string>;
  description: string;
  attendeeIds: Array<UserId>;
  meetingType: MeetingType;
  scheduledEnd: Timestamp;
  isPublic: boolean;
  location: [] | [string];
}
export interface Meeting {
  id: MeetingId;
  status: MeetingStatus;
  recordingConsent: boolean;
  organizer: UserId;
  title: string;
  scheduledStart: Timestamp;
  relatedProposalId: [] | [bigint];
  createdAt: Timestamp;
  tags: Array<string>;
  agenda: Array<string>;
  description: string;
  relatedDisputeId: [] | [bigint];
  meetingType: MeetingType;
  summary: [] | [MeetingSummary];
  updatedAt: Timestamp;
  notes: Array<MeetingNote>;
  scheduledEnd: Timestamp;
  attendees: Array<Attendee>;
  isPublic: boolean;
  actualEnd: [] | [Timestamp];
  transcript: Array<TranscriptSegment>;
  location: [] | [string];
  actualStart: [] | [Timestamp];
}
export type MeetingId = bigint;
export interface MeetingNote {
  id: bigint;
  content: string;
  author: UserId;
  isPrivate: boolean;
  timestamp: Timestamp;
}
export type MeetingStatus =
  | { Scheduled: null }
  | { Cancelled: null }
  | { InProgress: null }
  | { Completed: null };
export interface MeetingSummary {
  nextSteps: Array<string>;
  generatedAt: Timestamp;
  decisions: Array<string>;
  keyPoints: Array<string>;
  actionItems: Array<ActionItem>;
  attendeeSummary: string;
  aiGenerated: boolean;
}
export type MeetingType =
  | { ProjectReview: null }
  | { GovernanceCall: null }
  | { TechnicalDiscussion: null }
  | { StrategicPlanning: null }
  | { DisputeHearing: null }
  | { CommunityTownHall: null };
export type Result = { ok: boolean } | { err: string };
export type Result_1 = { ok: MeetingId } | { err: string };
export type Result_2 = { ok: bigint } | { err: string };
export type Timestamp = bigint;
export interface TranscriptSegment {
  id: bigint;
  content: string;
  timestamp: Timestamp;
  confidence: [] | [number];
  speaker: [] | [string];
}
export type UserId = Principal;
export interface _SERVICE {
  addMeetingNote: ActorMethod<[MeetingId, string, boolean], Result_2>;
  addMeetingSummary: ActorMethod<[MeetingId, MeetingSummary], Result>;
  addTranscriptSegment: ActorMethod<[MeetingId, string, [] | [string], [] | [number]], Result_2>;
  createMeeting: ActorMethod<[CreateMeetingRequest], Result_1>;
  endMeeting: ActorMethod<[MeetingId], Result>;
  getMeeting: ActorMethod<[MeetingId], [] | [Meeting]>;
  getMeetingStats: ActorMethod<
    [],
    {
      activeMeetings: bigint;
      totalMeetings: bigint;
      completedMeetings: bigint;
    }
  >;
  getMeetingsByType: ActorMethod<[MeetingType], Array<Meeting>>;
  getPublicMeetings: ActorMethod<[], Array<Meeting>>;
  getUserMeetings: ActorMethod<[], Array<Meeting>>;
  startMeeting: ActorMethod<[MeetingId], Result>;
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
