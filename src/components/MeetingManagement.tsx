'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import meetingManagementService from '@/services/meetingManagementService';
import {
  CreateMeetingRequest,
  formatDuration,
  formatMeetingType,
  getMeetingStatusColor,
  getMeetingTypeIcon,
  Meeting,
  MeetingStatus,
  MeetingType,
} from '@/types/meeting-management';
import {
  BarChart3,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Mic,
  MicOff,
  Play,
  Plus,
  Square,
  Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

// Utility function for formatting timestamps
const formatTimestampLocal = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString();
};

interface MeetingManagementProps {
  // Props for integration
}

const MeetingManagement: React.FC<MeetingManagementProps> = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [realtimeTranscript, setRealtimeTranscript] = useState('');

  // Form state for creating meetings
  const [newMeeting, setNewMeeting] = useState<Partial<CreateMeetingRequest>>({
    title: '',
    description: '',
    meetingType: MeetingType.CommunityTownHall,
    agenda: [],
    attendeeIds: [],
    isPublic: true,
    recordingConsent: false,
    tags: [],
  });

  // Load meetings on mount
  useEffect(() => {
    loadMeetings();
  }, []);

  // Filter meetings based on active tab
  useEffect(() => {
    filterMeetings();
  }, [meetings, activeTab]);

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const userMeetings = await meetingManagementService.getUserMeetings();
      const publicMeetings = await meetingManagementService.getPublicMeetings();

      // Combine and deduplicate meetings
      const allMeetings = [...userMeetings, ...publicMeetings];
      const uniqueMeetings = allMeetings.filter(
        (meeting, index, self) => index === self.findIndex((m) => m.id === meeting.id)
      );

      setMeetings(uniqueMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMeetings = () => {
    const now = Date.now();
    let filtered: Meeting[] = [];

    switch (activeTab) {
      case 'upcoming':
        filtered = meetings.filter(
          (m) => m.status === MeetingStatus.Scheduled && m.scheduledStart > now
        );
        break;
      case 'live':
        filtered = meetings.filter((m) => m.status === MeetingStatus.InProgress);
        break;
      case 'completed':
        filtered = meetings.filter((m) => m.status === MeetingStatus.Completed);
        break;
      case 'all':
      default:
        filtered = meetings;
        break;
    }

    setFilteredMeetings(filtered.sort((a, b) => b.scheduledStart - a.scheduledStart));
  };

  const handleCreateMeeting = async () => {
    if (!newMeeting.title || !newMeeting.scheduledStart || !newMeeting.scheduledEnd) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const result = await meetingManagementService.createMeeting(
        newMeeting as CreateMeetingRequest
      );

      if (result.success) {
        setIsCreateDialogOpen(false);
        setNewMeeting({
          title: '',
          description: '',
          meetingType: MeetingType.CommunityTownHall,
          agenda: [],
          attendeeIds: [],
          isPublic: true,
          recordingConsent: false,
          tags: [],
        });
        loadMeetings();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
      alert('Failed to create meeting');
    }
  };

  const handleStartMeeting = async (meetingId: number) => {
    try {
      const result = await meetingManagementService.startMeeting(meetingId);
      if (result.success) {
        loadMeetings();
        // Start real-time transcription if enabled
        if (selectedMeeting?.recordingConsent) {
          startTranscription(meetingId);
        }
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error starting meeting:', error);
    }
  };

  const handleEndMeeting = async (meetingId: number) => {
    try {
      const result = await meetingManagementService.endMeeting(meetingId);
      if (result.success) {
        loadMeetings();
        stopTranscription();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error ending meeting:', error);
    }
  };

  const startTranscription = async (meetingId: number) => {
    try {
      setIsRecording(true);
      await meetingManagementService.startRealTimeTranscription(meetingId, (text: string) => {
        setRealtimeTranscript((prev) => prev + text + ' ');
      });
    } catch (error) {
      console.error('Error starting transcription:', error);
      setIsRecording(false);
    }
  };

  const stopTranscription = async () => {
    try {
      await meetingManagementService.stopRealTimeTranscription();
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping transcription:', error);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-gray-900'>Meeting Management</h1>
          <p className='text-gray-600 mt-1'>
            Local-first AI-powered meetings for HeliosHash DAO governance
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl'>
            <DialogHeader>
              <DialogTitle>Schedule New Meeting</DialogTitle>
              <DialogDescription>
                Create a new DAO meeting with AI transcription and summary features
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='title'>Meeting Title</Label>
                  <Input
                    id='title'
                    placeholder='e.g., Community Governance Call'
                    value={newMeeting.title || ''}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='type'>Meeting Type</Label>
                  <Select
                    value={newMeeting.meetingType}
                    onValueChange={(value) =>
                      setNewMeeting({ ...newMeeting, meetingType: value as MeetingType })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(MeetingType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {getMeetingTypeIcon(type)} {formatMeetingType(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='description'>Description</Label>
                <Textarea
                  id='description'
                  placeholder='Meeting description and objectives...'
                  value={newMeeting.description || ''}
                  onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='startDate'>Start Date & Time</Label>
                  <Input
                    id='startDate'
                    type='datetime-local'
                    onChange={(e) =>
                      setNewMeeting({
                        ...newMeeting,
                        scheduledStart: new Date(e.target.value).getTime(),
                      })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='endDate'>End Date & Time</Label>
                  <Input
                    id='endDate'
                    type='datetime-local'
                    onChange={(e) =>
                      setNewMeeting({
                        ...newMeeting,
                        scheduledEnd: new Date(e.target.value).getTime(),
                      })
                    }
                  />
                </div>
              </div>

              <div className='flex items-center gap-4'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={newMeeting.isPublic || false}
                    onChange={(e) => setNewMeeting({ ...newMeeting, isPublic: e.target.checked })}
                  />
                  Public Meeting
                </label>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={newMeeting.recordingConsent || false}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, recordingConsent: e.target.checked })
                    }
                  />
                  Enable AI Transcription
                </label>
              </div>

              <div className='flex justify-end gap-2'>
                <Button variant='outline' onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMeeting}>Schedule Meeting</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meeting Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-4'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='upcoming'>Upcoming</TabsTrigger>
          <TabsTrigger value='live'>Live</TabsTrigger>
          <TabsTrigger value='completed'>Completed</TabsTrigger>
          <TabsTrigger value='all'>All Meetings</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className='space-y-4'>
          {filteredMeetings.length === 0 ? (
            <Card className='p-8 text-center'>
              <Calendar className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>No {activeTab} meetings</h3>
              <p className='text-gray-600'>
                {activeTab === 'upcoming'
                  ? 'Schedule your first meeting to get started.'
                  : `No ${activeTab} meetings found.`}
              </p>
            </Card>
          ) : (
            <div className='grid gap-4'>
              {filteredMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onSelect={() => setSelectedMeeting(meeting)}
                  onStart={() => handleStartMeeting(meeting.id)}
                  onEnd={() => handleEndMeeting(meeting.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Selected Meeting Details */}
      {selectedMeeting && (
        <MeetingDetails
          meeting={selectedMeeting}
          isRecording={isRecording}
          realtimeTranscript={realtimeTranscript}
          onClose={() => setSelectedMeeting(null)}
          onStartTranscription={() => startTranscription(selectedMeeting.id)}
          onStopTranscription={stopTranscription}
        />
      )}
    </div>
  );
};

// Meeting Card Component
const MeetingCard: React.FC<{
  meeting: Meeting;
  onSelect: () => void;
  onStart: () => void;
  onEnd: () => void;
}> = ({ meeting, onSelect, onStart, onEnd }) => {
  const statusColor = getMeetingStatusColor(meeting.status);
  const typeIcon = getMeetingTypeIcon(meeting.meetingType);

  return (
    <Card className='hover:shadow-md transition-shadow cursor-pointer' onClick={onSelect}>
      <CardContent className='p-6'>
        <div className='flex items-start justify-between mb-4'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-xl'>{typeIcon}</span>
              <h3 className='text-lg font-semibold text-gray-900'>{meeting.title}</h3>
              <Badge variant='outline' className={`bg-${statusColor}-50 text-${statusColor}-700`}>
                {meeting.status}
              </Badge>
            </div>
            <p className='text-gray-600 text-sm mb-3 line-clamp-2'>{meeting.description}</p>

            <div className='flex items-center gap-4 text-sm text-gray-500'>
              <span className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                {formatTimestampLocal(meeting.scheduledStart)}
              </span>
              <span className='flex items-center gap-1'>
                <Clock className='h-4 w-4' />
                {formatDuration(meeting.scheduledStart, meeting.scheduledEnd)}
              </span>
              <span className='flex items-center gap-1'>
                <Users className='h-4 w-4' />
                {meeting.attendees.length} attendees
              </span>
            </div>
          </div>

          {meeting.status === MeetingStatus.Scheduled && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
              size='sm'
            >
              <Play className='h-4 w-4 mr-1' />
              Start
            </Button>
          )}

          {meeting.status === MeetingStatus.InProgress && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onEnd();
              }}
              variant='destructive'
              size='sm'
            >
              <Square className='h-4 w-4 mr-1' />
              End
            </Button>
          )}
        </div>

        <div className='flex flex-wrap gap-1'>
          {meeting.tags.map((tag) => (
            <Badge key={tag} variant='secondary' className='text-xs'>
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Meeting Details Component
const MeetingDetails: React.FC<{
  meeting: Meeting;
  isRecording: boolean;
  realtimeTranscript: string;
  onClose: () => void;
  onStartTranscription: () => void;
  onStopTranscription: () => void;
}> = ({
  meeting,
  isRecording,
  realtimeTranscript,
  onClose,
  onStartTranscription,
  onStopTranscription,
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <span className='text-xl'>{getMeetingTypeIcon(meeting.meetingType)}</span>
            {meeting.title}
          </DialogTitle>
          <DialogDescription>
            {formatMeetingType(meeting.meetingType)} •{' '}
            {formatTimestampLocal(meeting.scheduledStart)}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue='overview' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='transcript'>Live Transcript</TabsTrigger>
            <TabsTrigger value='notes'>Notes</TabsTrigger>
            <TabsTrigger value='summary'>AI Summary</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <Card>
                <CardHeader>
                  <CardTitle className='text-sm'>Meeting Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className='space-y-2 text-sm'>
                    <div>
                      <dt className='font-medium'>Status</dt>
                      <dd>
                        <Badge>{meeting.status}</Badge>
                      </dd>
                    </div>
                    <div>
                      <dt className='font-medium'>Duration</dt>
                      <dd>{formatDuration(meeting.scheduledStart, meeting.scheduledEnd)}</dd>
                    </div>
                    <div>
                      <dt className='font-medium'>Attendees</dt>
                      <dd>{meeting.attendees.length} participants</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-sm'>AI Features</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  {meeting.recordingConsent ? (
                    <div className='space-y-2'>
                      <Button
                        onClick={isRecording ? onStopTranscription : onStartTranscription}
                        variant={isRecording ? 'destructive' : 'default'}
                        className='w-full'
                      >
                        {isRecording ? (
                          <>
                            <MicOff className='h-4 w-4 mr-2' />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Mic className='h-4 w-4 mr-2' />
                            Start Recording
                          </>
                        )}
                      </Button>
                      {isRecording && (
                        <div className='flex items-center gap-2 text-sm text-green-600'>
                          <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
                          Live transcription active
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className='text-sm text-gray-500'>Recording consent not provided</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {meeting.agenda.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className='text-sm'>Agenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className='list-decimal list-inside space-y-1 text-sm'>
                    {meeting.agenda.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value='transcript' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm flex items-center gap-2'>
                  <MessageSquare className='h-4 w-4' />
                  Live Transcript
                  {isRecording && (
                    <Badge variant='destructive' className='ml-auto'>
                      <div className='w-2 h-2 bg-white rounded-full animate-pulse mr-1'></div>
                      Recording
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='bg-gray-50 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto'>
                  {realtimeTranscript || meeting.transcript.length > 0 ? (
                    <div className='space-y-2 text-sm'>
                      {meeting.transcript.map((segment) => (
                        <div key={segment.id} className='border-l-2 border-blue-200 pl-3'>
                          <div className='flex items-center justify-between text-xs text-gray-500 mb-1'>
                            <span>{segment.speaker || 'Unknown Speaker'}</span>
                            <span>{formatTimestampLocal(segment.timestamp)}</span>
                          </div>
                          <p>{segment.content}</p>
                        </div>
                      ))}
                      {realtimeTranscript && (
                        <div className='border-l-2 border-green-200 pl-3'>
                          <div className='text-xs text-gray-500 mb-1'>Live</div>
                          <p>{realtimeTranscript}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='text-center text-gray-500 py-8'>
                      <MessageSquare className='h-8 w-8 mx-auto mb-2 opacity-50' />
                      <p>No transcript available yet</p>
                      <p className='text-xs'>Start recording to see live transcription</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='notes' className='space-y-4'>
            <Card>
              <CardHeader>
                <CardTitle className='text-sm flex items-center gap-2'>
                  <FileText className='h-4 w-4' />
                  Meeting Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {meeting.notes.length > 0 ? (
                  <div className='space-y-4'>
                    {meeting.notes.map((note) => (
                      <div key={note.id} className='border rounded-lg p-3'>
                        <div className='flex items-center justify-between mb-2'>
                          <span className='text-sm font-medium'>{note.author}</span>
                          <span className='text-xs text-gray-500'>
                            {formatTimestampLocal(note.timestamp)}
                          </span>
                        </div>
                        <p className='text-sm'>{note.content}</p>
                        {note.isPrivate && (
                          <Badge variant='secondary' className='mt-2 text-xs'>
                            Private
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center text-gray-500 py-8'>
                    <FileText className='h-8 w-8 mx-auto mb-2 opacity-50' />
                    <p>No notes available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='summary' className='space-y-4'>
            {meeting.summary ? (
              <div className='space-y-4'>
                <Card>
                  <CardHeader>
                    <CardTitle className='text-sm'>Key Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className='list-disc list-inside space-y-1 text-sm'>
                      {meeting.summary.keyPoints.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-sm'>Action Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {meeting.summary.actionItems.length > 0 ? (
                      <div className='space-y-2'>
                        {meeting.summary.actionItems.map((item) => (
                          <div
                            key={item.id}
                            className='flex items-center justify-between p-2 bg-gray-50 rounded'
                          >
                            <span className='text-sm'>{item.description}</span>
                            <Badge variant='secondary'>{item.status}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className='text-sm text-gray-500'>No action items identified</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className='text-sm'>Decisions Made</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {meeting.summary.decisions.length > 0 ? (
                      <ul className='list-disc list-inside space-y-1 text-sm'>
                        {meeting.summary.decisions.map((decision, index) => (
                          <li key={index}>{decision}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className='text-sm text-gray-500'>No decisions recorded</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className='text-center py-8'>
                  <BarChart3 className='h-8 w-8 mx-auto mb-2 opacity-50' />
                  <p className='text-gray-500'>AI summary will be generated after the meeting</p>
                  <Button className='mt-4' variant='outline'>
                    Generate Summary Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingManagement;
