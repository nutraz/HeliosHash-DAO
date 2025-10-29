// Meeting Management Service for HeliosHash DAO
// Inspired by Hyprnote's local-first approach
// Temporarily comment out missing import and define types inline
// import {
//   AIConfig,
//   CreateMeetingRequest,
//   Meeting,
//   MeetingId,
//   MeetingStats,
//   MeetingSummary,
//   SummarizationRequest,
//   TranscriptionResult,
// } from '@/types/meeting-management';

// Define types inline for now
interface AIConfig {
  transcriptionModel: string;
  summaryModel: string;
  localOnly: boolean;
  enableRealtime: boolean;
  confidenceThreshold: number;
}

interface CreateMeetingRequest {
  title: string;
  description: string;
  meetingType: any;
  scheduledStart: number;
  scheduledEnd: number;
  agenda: string[];
  attendeeIds: string[];
  location?: string;
  isPublic: boolean;
  recordingConsent: boolean;
  tags: string[];
}

interface Meeting {
  id: number;
  title: string;
  description: string;
  meetingType: any;
  status: any;
  organizer: any;
  attendees: any[];
  scheduledStart: number;
  scheduledEnd: number;
  actualStart?: number;
  actualEnd?: number;
  location?: string;
  agenda: string[];
  notes: any[];
  transcript: any[];
  summary?: any;
  relatedProposalId?: number;
  relatedDisputeId?: number;
  tags: string[];
  isPublic: boolean;
  recordingConsent: boolean;
  createdAt: number;
  updatedAt: number;
}

type MeetingId = number;

interface MeetingStats {
  totalMeetings: number;
  activeMeetings: number;
  completedMeetings: number;
}

interface MeetingSummary {
  keyPoints: string[];
  actionItems: any[];
  decisions: string[];
  nextSteps: string[];
  attendeeSummary: string;
  aiGenerated: boolean;
  generatedAt: number;
}

interface SummarizationRequest {
  meetingId: number;
  template?: string;
  autonomyLevel?: string;
}

interface TranscriptionResult {
  text: string;
  confidence: number;
  segments: any[];
  language: string;
}
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// Candid interface definitions (auto-generated would go in declarations)
const meetingManagementIDL = ({ IDL }: any) => {
  const MeetingType = IDL.Variant({
    GovernanceCall: IDL.Null,
    ProjectReview: IDL.Null,
    DisputeHearing: IDL.Null,
    CommunityTownHall: IDL.Null,
    TechnicalDiscussion: IDL.Null,
    StrategicPlanning: IDL.Null,
  });

  const MeetingStatus = IDL.Variant({
    Scheduled: IDL.Null,
    InProgress: IDL.Null,
    Completed: IDL.Null,
    Cancelled: IDL.Null,
  });

  const AttendeeRole = IDL.Variant({
    Organizer: IDL.Null,
    Speaker: IDL.Null,
    Participant: IDL.Null,
    Observer: IDL.Null,
  });

  const Attendee = IDL.Record({
    userId: IDL.Principal,
    role: AttendeeRole,
    joinedAt: IDL.Opt(IDL.Int),
    leftAt: IDL.Opt(IDL.Int),
  });

  const ActionItem = IDL.Record({
    id: IDL.Nat,
    description: IDL.Text,
    assignedTo: IDL.Principal,
    dueDate: IDL.Opt(IDL.Int),
    status: IDL.Variant({
      Open: IDL.Null,
      InProgress: IDL.Null,
      Completed: IDL.Null,
    }),
    createdAt: IDL.Int,
  });

  const MeetingNote = IDL.Record({
    id: IDL.Nat,
    content: IDL.Text,
    author: IDL.Principal,
    timestamp: IDL.Int,
    isPrivate: IDL.Bool,
  });

  const TranscriptSegment = IDL.Record({
    id: IDL.Nat,
    speaker: IDL.Opt(IDL.Text),
    content: IDL.Text,
    timestamp: IDL.Int,
    confidence: IDL.Opt(IDL.Float64),
  });

  const MeetingSummary = IDL.Record({
    keyPoints: IDL.Vec(IDL.Text),
    actionItems: IDL.Vec(ActionItem),
    decisions: IDL.Vec(IDL.Text),
    nextSteps: IDL.Vec(IDL.Text),
    attendeeSummary: IDL.Text,
    aiGenerated: IDL.Bool,
    generatedAt: IDL.Int,
  });

  const Meeting = IDL.Record({
    id: IDL.Nat,
    title: IDL.Text,
    description: IDL.Text,
    meetingType: MeetingType,
    status: MeetingStatus,
    organizer: IDL.Principal,
    attendees: IDL.Vec(Attendee),
    scheduledStart: IDL.Int,
    scheduledEnd: IDL.Int,
    actualStart: IDL.Opt(IDL.Int),
    actualEnd: IDL.Opt(IDL.Int),
    location: IDL.Opt(IDL.Text),
    agenda: IDL.Vec(IDL.Text),
    notes: IDL.Vec(MeetingNote),
    transcript: IDL.Vec(TranscriptSegment),
    summary: IDL.Opt(MeetingSummary),
    relatedProposalId: IDL.Opt(IDL.Nat),
    relatedDisputeId: IDL.Opt(IDL.Nat),
    tags: IDL.Vec(IDL.Text),
    isPublic: IDL.Bool,
    recordingConsent: IDL.Bool,
    createdAt: IDL.Int,
    updatedAt: IDL.Int,
  });

  const CreateMeetingRequest = IDL.Record({
    title: IDL.Text,
    description: IDL.Text,
    meetingType: MeetingType,
    scheduledStart: IDL.Int,
    scheduledEnd: IDL.Int,
    agenda: IDL.Vec(IDL.Text),
    attendeeIds: IDL.Vec(IDL.Principal),
    location: IDL.Opt(IDL.Text),
    isPublic: IDL.Bool,
    recordingConsent: IDL.Bool,
    tags: IDL.Vec(IDL.Text),
  });

  return IDL.Service({
    createMeeting: IDL.Func(
      [CreateMeetingRequest],
      [IDL.Variant({ ok: IDL.Nat, err: IDL.Text })],
      []
    ),
    startMeeting: IDL.Func([IDL.Nat], [IDL.Variant({ ok: IDL.Bool, err: IDL.Text })], []),
    endMeeting: IDL.Func([IDL.Nat], [IDL.Variant({ ok: IDL.Bool, err: IDL.Text })], []),
    addMeetingNote: IDL.Func(
      [IDL.Nat, IDL.Text, IDL.Bool],
      [IDL.Variant({ ok: IDL.Nat, err: IDL.Text })],
      []
    ),
    addTranscriptSegment: IDL.Func(
      [IDL.Nat, IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Float64)],
      [IDL.Variant({ ok: IDL.Nat, err: IDL.Text })],
      []
    ),
    addMeetingSummary: IDL.Func(
      [IDL.Nat, MeetingSummary],
      [IDL.Variant({ ok: IDL.Bool, err: IDL.Text })],
      []
    ),
    getMeeting: IDL.Func([IDL.Nat], [IDL.Opt(Meeting)], ['query']),
    getUserMeetings: IDL.Func([], [IDL.Vec(Meeting)], ['query']),
    getPublicMeetings: IDL.Func([], [IDL.Vec(Meeting)], ['query']),
    getMeetingsByType: IDL.Func([MeetingType], [IDL.Vec(Meeting)], ['query']),
    getMeetingStats: IDL.Func(
      [],
      [IDL.Record({ totalMeetings: IDL.Nat, activeMeetings: IDL.Nat, completedMeetings: IDL.Nat })],
      ['query']
    ),
  });
};

class MeetingManagementService {
  private actor: any;
  private aiConfig: AIConfig = {
    transcriptionModel: 'whisper',
    summaryModel: 'ollama',
    localOnly: true,
    enableRealtime: true,
    confidenceThreshold: 0.7,
  };

  constructor() {
    this.initializeActor();
  }

  private async initializeActor() {
    try {
      // In production, use the deployed canister ID
      const canisterId =
        process.env.CANISTER_ID_HHDAO_MEETING_MANAGEMENT || 'rrkah-fqaaa-aaaaa-aaaaq-cai';

      const agent = new HttpAgent({
        host: process.env.NODE_ENV === 'production' ? 'https://ic0.app' : 'http://localhost:8000',
      });

      if (process.env.NODE_ENV !== 'production') {
        await agent.fetchRootKey();
      }

      this.actor = Actor.createActor(meetingManagementIDL, {
        agent,
        canisterId,
      });
    } catch (error) {
      console.error('Failed to initialize meeting management actor:', error);
    }
  }

  // Meeting CRUD Operations
  async createMeeting(
    request: CreateMeetingRequest
  ): Promise<{ success: boolean; meetingId?: MeetingId; error?: string }> {
    try {
      const result = await this.actor.createMeeting({
        ...request,
        attendeeIds: request.attendeeIds.map((id) => Principal.fromText(id)),
      });

      if ('ok' in result) {
        return { success: true, meetingId: Number(result.ok) };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      return { success: false, error: 'Failed to create meeting' };
    }
  }

  async startMeeting(meetingId: MeetingId): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.actor.startMeeting(meetingId);

      if ('ok' in result) {
        return { success: true };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error starting meeting:', error);
      return { success: false, error: 'Failed to start meeting' };
    }
  }

  async endMeeting(meetingId: MeetingId): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.actor.endMeeting(meetingId);

      if ('ok' in result) {
        return { success: true };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error ending meeting:', error);
      return { success: false, error: 'Failed to end meeting' };
    }
  }

  async addNote(
    meetingId: MeetingId,
    content: string,
    isPrivate: boolean
  ): Promise<{ success: boolean; noteId?: number; error?: string }> {
    try {
      const result = await this.actor.addMeetingNote(meetingId, content, isPrivate);

      if ('ok' in result) {
        return { success: true, noteId: Number(result.ok) };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error adding note:', error);
      return { success: false, error: 'Failed to add note' };
    }
  }

  async addTranscriptSegment(
    meetingId: MeetingId,
    content: string,
    speaker?: string,
    confidence?: number
  ): Promise<{ success: boolean; segmentId?: number; error?: string }> {
    try {
      const result = await this.actor.addTranscriptSegment(
        meetingId,
        content,
        speaker ? [speaker] : [],
        confidence ? [confidence] : []
      );

      if ('ok' in result) {
        return { success: true, segmentId: Number(result.ok) };
      } else {
        return { success: false, error: result.err };
      }
    } catch (error) {
      console.error('Error adding transcript:', error);
      return { success: false, error: 'Failed to add transcript segment' };
    }
  }

  // Query Operations
  async getMeeting(meetingId: MeetingId): Promise<Meeting | null> {
    try {
      const meeting = await this.actor.getMeeting(meetingId);
      return meeting[0] || null;
    } catch (error) {
      console.error('Error fetching meeting:', error);
      return null;
    }
  }

  async getUserMeetings(): Promise<Meeting[]> {
    try {
      return await this.actor.getUserMeetings();
    } catch (error) {
      console.error('Error fetching user meetings:', error);
      return [];
    }
  }

  async getPublicMeetings(): Promise<Meeting[]> {
    try {
      return await this.actor.getPublicMeetings();
    } catch (error) {
      console.error('Error fetching public meetings:', error);
      return [];
    }
  }

  async getMeetingStats(): Promise<MeetingStats> {
    try {
      return await this.actor.getMeetingStats();
    } catch (error) {
      console.error('Error fetching meeting stats:', error);
      return { totalMeetings: 0, activeMeetings: 0, completedMeetings: 0 };
    }
  }

  // Local AI Processing (Hyprnote-inspired)
  async transcribeAudio(audioData: ArrayBuffer): Promise<TranscriptionResult | null> {
    try {
      // This would integrate with local Whisper or similar
      // For now, return mock data
      console.log('Transcribing audio locally...');

      // In real implementation, this would use:
      // - Web Audio API for processing
      // - Local Whisper model via WASM or WebRTC
      // - Real-time streaming transcription

      return {
        text: 'Transcribed text would appear here...',
        confidence: 0.85,
        segments: [
          { start: 0, end: 3000, text: 'Hello everyone, welcome to the meeting.' },
          { start: 3000, end: 6000, text: "Today we'll discuss the solar project updates." },
        ],
        language: 'en',
      };
    } catch (error) {
      console.error('Error transcribing audio:', error);
      return null;
    }
  }

  async generateSummary(request: SummarizationRequest): Promise<MeetingSummary | null> {
    try {
      // This would integrate with local LLM (Ollama) or external APIs
      console.log('Generating summary locally...');

      // In real implementation, this would:
      // - Use Ollama API for local processing
      // - Apply the specified template and autonomy level
      // - Respect privacy settings (local-only processing)

      return {
        keyPoints: [
          'Solar project Phase 2 approved for funding',
          'Community engagement increased by 40%',
          'Technical challenges identified and solutions proposed',
        ],
        actionItems: [
          {
            id: 1,
            description: 'Finalize contractor selection',
            assignedTo: 'user123',
            status: 'Open',
            createdAt: Date.now(),
          },
        ],
        decisions: [
          'Approved budget increase for Phase 2',
          'Selected new contractor for installation',
        ],
        nextSteps: [
          'Schedule contractor kickoff meeting',
          'Update community on progress',
          'Begin Phase 2 implementation',
        ],
        attendeeSummary: '8 community members participated actively',
        aiGenerated: true,
        generatedAt: Date.now(),
      };
    } catch (error) {
      console.error('Error generating summary:', error);
      return null;
    }
  }

  // Configuration
  updateAIConfig(config: Partial<AIConfig>): void {
    this.aiConfig = { ...this.aiConfig, ...config };
  }

  getAIConfig(): AIConfig {
    return { ...this.aiConfig };
  }

  // Real-time features (WebSocket/WebRTC integration)
  async startRealTimeTranscription(
    meetingId: MeetingId,
    onTranscript: (text: string) => void
  ): Promise<void> {
    // This would integrate with Web Audio API and real-time transcription
    console.log(`Starting real-time transcription for meeting ${meetingId}`);

    // Mock real-time updates
    const mockTranscripts = [
      "Welcome everyone to today's governance call.",
      'First item on the agenda is the solar project update.',
      "We've received three proposals for the new installation.",
      'The community feedback has been overwhelmingly positive.',
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < mockTranscripts.length) {
        onTranscript(mockTranscripts[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 5000);
  }

  async stopRealTimeTranscription(): Promise<void> {
    console.log('Stopping real-time transcription');
    // Stop audio capture and processing
  }
}

const meetingManagementService = new MeetingManagementService();
export default meetingManagementService;
