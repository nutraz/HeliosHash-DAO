export const idlFactory = ({ IDL }) => {
  const MeetingId = IDL.Nat;
  const Result_2 = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const Timestamp = IDL.Int;
  const UserId = IDL.Principal;
  const ActionItem = IDL.Record({
    id: IDL.Nat,
    status: IDL.Variant({
      Open: IDL.Null,
      InProgress: IDL.Null,
      Completed: IDL.Null,
    }),
    assignedTo: UserId,
    createdAt: Timestamp,
    dueDate: IDL.Opt(Timestamp),
    description: IDL.Text,
  });
  const MeetingSummary = IDL.Record({
    nextSteps: IDL.Vec(IDL.Text),
    generatedAt: Timestamp,
    decisions: IDL.Vec(IDL.Text),
    keyPoints: IDL.Vec(IDL.Text),
    actionItems: IDL.Vec(ActionItem),
    attendeeSummary: IDL.Text,
    aiGenerated: IDL.Bool,
  });
  const Result = IDL.Variant({ ok: IDL.Bool, err: IDL.Text });
  const MeetingType = IDL.Variant({
    ProjectReview: IDL.Null,
    GovernanceCall: IDL.Null,
    TechnicalDiscussion: IDL.Null,
    StrategicPlanning: IDL.Null,
    DisputeHearing: IDL.Null,
    CommunityTownHall: IDL.Null,
  });
  const CreateMeetingRequest = IDL.Record({
    recordingConsent: IDL.Bool,
    title: IDL.Text,
    scheduledStart: Timestamp,
    tags: IDL.Vec(IDL.Text),
    agenda: IDL.Vec(IDL.Text),
    description: IDL.Text,
    attendeeIds: IDL.Vec(UserId),
    meetingType: MeetingType,
    scheduledEnd: Timestamp,
    isPublic: IDL.Bool,
    location: IDL.Opt(IDL.Text),
  });
  const Result_1 = IDL.Variant({ ok: MeetingId, err: IDL.Text });
  const MeetingStatus = IDL.Variant({
    Scheduled: IDL.Null,
    Cancelled: IDL.Null,
    InProgress: IDL.Null,
    Completed: IDL.Null,
  });
  const MeetingNote = IDL.Record({
    id: IDL.Nat,
    content: IDL.Text,
    author: UserId,
    isPrivate: IDL.Bool,
    timestamp: Timestamp,
  });
  const AttendeeRole = IDL.Variant({
    Participant: IDL.Null,
    Speaker: IDL.Null,
    Organizer: IDL.Null,
    Observer: IDL.Null,
  });
  const Attendee = IDL.Record({
    userId: UserId,
    joinedAt: IDL.Opt(Timestamp),
    role: AttendeeRole,
    leftAt: IDL.Opt(Timestamp),
  });
  const TranscriptSegment = IDL.Record({
    id: IDL.Nat,
    content: IDL.Text,
    timestamp: Timestamp,
    confidence: IDL.Opt(IDL.Float64),
    speaker: IDL.Opt(IDL.Text),
  });
  const Meeting = IDL.Record({
    id: MeetingId,
    status: MeetingStatus,
    recordingConsent: IDL.Bool,
    organizer: UserId,
    title: IDL.Text,
    scheduledStart: Timestamp,
    relatedProposalId: IDL.Opt(IDL.Nat),
    createdAt: Timestamp,
    tags: IDL.Vec(IDL.Text),
    agenda: IDL.Vec(IDL.Text),
    description: IDL.Text,
    relatedDisputeId: IDL.Opt(IDL.Nat),
    meetingType: MeetingType,
    summary: IDL.Opt(MeetingSummary),
    updatedAt: Timestamp,
    notes: IDL.Vec(MeetingNote),
    scheduledEnd: Timestamp,
    attendees: IDL.Vec(Attendee),
    isPublic: IDL.Bool,
    actualEnd: IDL.Opt(Timestamp),
    transcript: IDL.Vec(TranscriptSegment),
    location: IDL.Opt(IDL.Text),
    actualStart: IDL.Opt(Timestamp),
  });
  return IDL.Service({
    addMeetingNote: IDL.Func([MeetingId, IDL.Text, IDL.Bool], [Result_2], []),
    addMeetingSummary: IDL.Func([MeetingId, MeetingSummary], [Result], []),
    addTranscriptSegment: IDL.Func(
      [MeetingId, IDL.Text, IDL.Opt(IDL.Text), IDL.Opt(IDL.Float64)],
      [Result_2],
      []
    ),
    createMeeting: IDL.Func([CreateMeetingRequest], [Result_1], []),
    endMeeting: IDL.Func([MeetingId], [Result], []),
    getMeeting: IDL.Func([MeetingId], [IDL.Opt(Meeting)], ['query']),
    getMeetingStats: IDL.Func(
      [],
      [
        IDL.Record({
          activeMeetings: IDL.Nat,
          totalMeetings: IDL.Nat,
          completedMeetings: IDL.Nat,
        }),
      ],
      ['query']
    ),
    getMeetingsByType: IDL.Func([MeetingType], [IDL.Vec(Meeting)], ['query']),
    getPublicMeetings: IDL.Func([], [IDL.Vec(Meeting)], ['query']),
    getUserMeetings: IDL.Func([], [IDL.Vec(Meeting)], ['query']),
    startMeeting: IDL.Func([MeetingId], [Result], []),
  });
};
export const init = ({ IDL }) => {
  return [];
};
