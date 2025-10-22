// HeliosHash DAO Meeting Management Canister
// Inspired by Hyprnote's local-first approach for DAO governance meetings

import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Buffer "mo:base/Buffer";
import Option "mo:base/Option";
import Array "mo:base/Array";
<<<<<<< HEAD

import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Option "mo:base/Option";
=======
import Float "mo:base/Float";
>>>>>>> audit-clean

persistent actor MeetingManagement {

  // Types for Meeting Management
  public type MeetingId = Nat;
  public type UserId = Principal;
  public type Timestamp = Int;

  public type MeetingType = {
    #GovernanceCall;
    #ProjectReview;
    #DisputeHearing;
    #CommunityTownHall;
    #TechnicalDiscussion;
    #StrategicPlanning;
  };

  public type MeetingStatus = {
    #Scheduled;
    #InProgress;
    #Completed;
    #Cancelled;
  };

  public type AttendeeRole = {
    #Organizer;
    #Speaker;
    #Participant;
    #Observer;
  };

  public type Attendee = {
    userId: UserId;
    role: AttendeeRole;
    joinedAt: ?Timestamp;
    leftAt: ?Timestamp;
  };

  public type ActionItem = {
    id: Nat;
    description: Text;
    assignedTo: UserId;
    dueDate: ?Timestamp;
    status: {#Open; #InProgress; #Completed};
    createdAt: Timestamp;
  };

  public type MeetingNote = {
    id: Nat;
    content: Text;
    author: UserId;
    timestamp: Timestamp;
    isPrivate: Bool;
  };

  public type TranscriptSegment = {
    id: Nat;
    speaker: ?Text; // Speaker identification (optional)
    content: Text;
    timestamp: Timestamp;
    confidence: ?Float; // AI confidence score
  };

  public type MeetingSummary = {
    keyPoints: [Text];
    actionItems: [ActionItem];
    decisions: [Text];
    nextSteps: [Text];
    attendeeSummary: Text;
    aiGenerated: Bool;
    generatedAt: Timestamp;
  };

  public type Meeting = {
    id: MeetingId;
    title: Text;
    description: Text;
    meetingType: MeetingType;
    status: MeetingStatus;
    organizer: UserId;
    attendees: [Attendee];
    scheduledStart: Timestamp;
    scheduledEnd: Timestamp;
    actualStart: ?Timestamp;
    actualEnd: ?Timestamp;
    location: ?Text; // Virtual room link or physical location
    agenda: [Text];
    notes: [MeetingNote];
    transcript: [TranscriptSegment];
    summary: ?MeetingSummary;
    relatedProposalId: ?Nat; // Link to governance proposals
    relatedDisputeId: ?Nat; // Link to dispute resolutions
    tags: [Text];
    isPublic: Bool;
    recordingConsent: Bool;
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };

  public type CreateMeetingRequest = {
    title: Text;
    description: Text;
    meetingType: MeetingType;
    scheduledStart: Timestamp;
    scheduledEnd: Timestamp;
    agenda: [Text];
    attendeeIds: [UserId];
    location: ?Text;
    isPublic: Bool;
    recordingConsent: Bool;
    tags: [Text];
  };

  // State Management
  private var nextMeetingId: MeetingId = 1;
  private var nextActionItemId: Nat = 1; // Reserved for future use
  private var nextNoteId: Nat = 1;
  private var nextTranscriptId: Nat = 1;

  // Stable storage snapshots
  private var meetingEntries: [(MeetingId, Meeting)] = [];
  private var userMeetingEntries: [(UserId, [MeetingId])] = [];

  // In-memory maps (rebuilt on init/post-upgrade)
  private transient var meetings = HashMap.HashMap<MeetingId, Meeting>(10, Nat.equal, func (n: Nat): Nat32 { Nat32.fromNat(n % 100000) });
  private transient var userMeetings = HashMap.HashMap<UserId, [MeetingId]>(10, Principal.equal, Principal.hash);

  // Meeting Management Functions
  public shared({ caller }) func createMeeting(request: CreateMeetingRequest): async Result.Result<MeetingId, Text> {
    let meetingId = nextMeetingId;
    nextMeetingId += 1;

    let attendees = Array.map<UserId, Attendee>(request.attendeeIds, func(userId) = {
      userId = userId;
      role = if (Principal.equal(userId, caller)) #Organizer else #Participant;
      joinedAt = null;
      leftAt = null;
    });

    let meeting: Meeting = {
      id = meetingId;
      title = request.title;
      description = request.description;
      meetingType = request.meetingType;
      status = #Scheduled;
      organizer = caller;
      attendees = attendees;
      scheduledStart = request.scheduledStart;
      scheduledEnd = request.scheduledEnd;
      actualStart = null;
      actualEnd = null;
      location = request.location;
      agenda = request.agenda;
      notes = [];
      transcript = [];
      summary = null;
      relatedProposalId = null;
      relatedDisputeId = null;
      tags = request.tags;
      isPublic = request.isPublic;
      recordingConsent = request.recordingConsent;
      createdAt = Time.now();
      updatedAt = Time.now();
    };

    meetings.put(meetingId, meeting);
    
    // Update user meetings index
    for (attendee in attendees.vals()) {
      switch (userMeetings.get(attendee.userId)) {
        case (?existingMeetings) {
          let buffer = Buffer.fromArray<MeetingId>(existingMeetings);
          buffer.add(meetingId);
          userMeetings.put(attendee.userId, Buffer.toArray(buffer));
        };
        case (null) {
          userMeetings.put(attendee.userId, [meetingId]);
        };
      };
    };

    #ok(meetingId)
  };

  public shared({ caller }) func startMeeting(meetingId: MeetingId): async Result.Result<Bool, Text> {
    switch (meetings.get(meetingId)) {
      case (?meeting) {
        if (not Principal.equal(meeting.organizer, caller)) {
          return #err("Only organizer can start meeting");
        };
        
        let updatedMeeting = {
          meeting with 
          status = #InProgress;
          actualStart = ?Time.now();
          updatedAt = Time.now();
        };
        
        meetings.put(meetingId, updatedMeeting);
        #ok(true)
      };
      case (null) { #err("Meeting not found") };
    }
  };

  public shared({ caller }) func endMeeting(meetingId: MeetingId): async Result.Result<Bool, Text> {
    switch (meetings.get(meetingId)) {
      case (?meeting) {
        if (not Principal.equal(meeting.organizer, caller)) {
          return #err("Only organizer can end meeting");
        };
        
        let updatedMeeting = {
          meeting with 
          status = #Completed;
          actualEnd = ?Time.now();
          updatedAt = Time.now();
        };
        
        meetings.put(meetingId, updatedMeeting);
        #ok(true)
      };
      case (null) { #err("Meeting not found") };
    }
  };

  public shared({ caller }) func addMeetingNote(meetingId: MeetingId, content: Text, isPrivate: Bool): async Result.Result<Nat, Text> {
    switch (meetings.get(meetingId)) {
      case (?meeting) {
        // Check if user is attendee
        let isAttendee = Array.find<Attendee>(meeting.attendees, func(a) = Principal.equal(a.userId, caller));
        if (Option.isNull(isAttendee) and not meeting.isPublic) {
          return #err("Not authorized to add notes");
        };

        let noteId = nextNoteId;
        nextNoteId += 1;

        let note: MeetingNote = {
          id = noteId;
          content = content;
          author = caller;
          timestamp = Time.now();
          isPrivate = isPrivate;
        };

        let buffer = Buffer.fromArray<MeetingNote>(meeting.notes);
        buffer.add(note);

        let updatedMeeting = {
          meeting with 
          notes = Buffer.toArray(buffer);
          updatedAt = Time.now();
        };

        meetings.put(meetingId, updatedMeeting);
        #ok(noteId)
      };
      case (null) { #err("Meeting not found") };
    }
  };

  public shared({ caller }) func addTranscriptSegment(meetingId: MeetingId, content: Text, speaker: ?Text, confidence: ?Float): async Result.Result<Nat, Text> {
    switch (meetings.get(meetingId)) {
      case (?meeting) {
        // Check if user is organizer or authorized transcriber
        if (not Principal.equal(meeting.organizer, caller)) {
          return #err("Not authorized to add transcript");
        };

        let segmentId = nextTranscriptId;
        nextTranscriptId += 1;

        let segment: TranscriptSegment = {
          id = segmentId;
          speaker = speaker;
          content = content;
          timestamp = Time.now();
          confidence = confidence;
        };

        let buffer = Buffer.fromArray<TranscriptSegment>(meeting.transcript);
        buffer.add(segment);

        let updatedMeeting = {
          meeting with 
          transcript = Buffer.toArray(buffer);
          updatedAt = Time.now();
        };

        meetings.put(meetingId, updatedMeeting);
        #ok(segmentId)
      };
      case (null) { #err("Meeting not found") };
    }
  };

  public shared({ caller }) func addMeetingSummary(meetingId: MeetingId, summary: MeetingSummary): async Result.Result<Bool, Text> {
    switch (meetings.get(meetingId)) {
      case (?meeting) {
        if (not Principal.equal(meeting.organizer, caller)) {
          return #err("Only organizer can add summary");
        };

        let updatedMeeting = {
          meeting with 
          summary = ?summary;
          updatedAt = Time.now();
        };

        meetings.put(meetingId, updatedMeeting);
        #ok(true)
      };
      case (null) { #err("Meeting not found") };
    }
  };

  // Query Functions
  public query func getMeeting(meetingId: MeetingId): async ?Meeting {
    meetings.get(meetingId)
  };

  public query({ caller }) func getUserMeetings(): async [Meeting] {
    switch (userMeetings.get(caller)) {
      case (?meetingIds) {
        let buffer = Buffer.Buffer<Meeting>(meetingIds.size());
        for (id in meetingIds.vals()) {
          switch (meetings.get(id)) {
            case (?meeting) { buffer.add(meeting); };
            case (null) {};
          };
        };
        Buffer.toArray(buffer)
      };
      case (null) { [] };
    }
  };

  public query func getPublicMeetings(): async [Meeting] {
    let buffer = Buffer.Buffer<Meeting>(0);
    for (meeting in meetings.vals()) {
      if (meeting.isPublic) {
        buffer.add(meeting);
      };
    };
    Buffer.toArray(buffer)
  };

  public query func getMeetingsByType(meetingType: MeetingType): async [Meeting] {
    let buffer = Buffer.Buffer<Meeting>(0);
    for (meeting in meetings.vals()) {
      if (meeting.meetingType == meetingType and meeting.isPublic) {
        buffer.add(meeting);
      };
    };
    Buffer.toArray(buffer)
  };

  public query func getMeetingStats(): async {totalMeetings: Nat; activeMeetings: Nat; completedMeetings: Nat} {
    var total = 0;
    var active = 0;
    var completed = 0;

    for (meeting in meetings.vals()) {
      total += 1;
      switch (meeting.status) {
        case (#InProgress) { active += 1; };
        case (#Completed) { completed += 1; };
        case (_) {};
      };
    };

    {
      totalMeetings = total;
      activeMeetings = active;
      completedMeetings = completed;
    }
  };

  // System functions for upgrade persistence
  system func preupgrade() {
    meetingEntries := Iter.toArray(meetings.entries());
    userMeetingEntries := Iter.toArray(userMeetings.entries());
  };

  system func postupgrade() {
    meetings := HashMap.HashMap<MeetingId, Meeting>(meetingEntries.size(), Nat.equal, func (n: Nat): Nat32 { Nat32.fromNat(n % 100000) });
    for ((k,v) in meetingEntries.vals()) { meetings.put(k,v); };
    userMeetings := HashMap.HashMap<UserId, [MeetingId]>(userMeetingEntries.size(), Principal.equal, Principal.hash);
    for ((k,v) in userMeetingEntries.vals()) { userMeetings.put(k,v); };
  };
}