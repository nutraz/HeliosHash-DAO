// === Community Integration Hub ===
// Connect community members with roles, contributions, messaging, and collaboration

'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SolarProject } from '../types/enhanced-solar-project';

interface CommunityMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  timestamp: Date;
  message_type: 'general' | 'technical' | 'announcement' | 'help_request' | 'update';
  replies?: CommunityMessage[];
  attachments?: string[];
  reactions?: { [emoji: string]: string[] }; // emoji -> user_ids
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  event_type: 'meeting' | 'training' | 'maintenance' | 'celebration' | 'volunteer';
  date: Date;
  location: string;
  organizer: string;
  attendees: string[];
  max_attendees?: number;
  requirements?: string[];
}

interface CommunityHubProps {
  project: SolarProject;
  currentUserId?: string;
  className?: string;
}

export const CommunityHub = ({
  project,
  currentUserId = 'user_demo_001',
  className,
}: CommunityHubProps) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'messages' | 'events' | 'contributors' | 'achievements'
  >('overview');
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<CommunityMessage['message_type']>('general');
  const [selectedEvent, setSelectedEvent] = useState<CommunityEvent | null>(null);

  // Mock community data
  useEffect(() => {
    const mockMessages: CommunityMessage[] = [
      {
        id: 'msg_001',
        sender_id: 'user_002',
        sender_name: 'Priya Negi',
        sender_role: 'community_rep',
        content:
          'Great news! Our solar panels are performing 5% above expected capacity this month. Thanks to everyone who helped with the cleaning drive last week!',
        timestamp: new Date('2025-09-29T10:30:00'),
        message_type: 'announcement',
        reactions: { '🎉': ['user_001', 'user_003'], '👏': ['user_001', 'user_004', 'user_005'] },
      },
      {
        id: 'msg_002',
        sender_id: 'user_001',
        sender_name: 'Rajesh Sharma',
        sender_role: 'project_manager',
        content:
          "Reminder: Monthly community meeting scheduled for October 5th at 6 PM at the community center. We'll discuss the expansion plans and new job opportunities.",
        timestamp: new Date('2025-09-28T15:20:00'),
        message_type: 'general',
        reactions: { '📅': ['user_002', 'user_003', 'user_006'] },
      },
      {
        id: 'msg_003',
        sender_id: 'user_006',
        sender_name: 'Amit Rawat',
        sender_role: 'maintainer',
        content:
          "Has anyone noticed issues with Panel Array B-7? I'm seeing slightly lower output. Planning to inspect tomorrow morning.",
        timestamp: new Date('2025-09-27T09:45:00'),
        message_type: 'technical',
        replies: [
          {
            id: 'msg_003_r1',
            sender_id: 'user_001',
            sender_name: 'Rajesh Sharma',
            sender_role: 'project_manager',
            content:
              "I'll check the monitoring data. Could be shading from the new tree growth. Let's coordinate on this.",
            timestamp: new Date('2025-09-27T10:15:00'),
            message_type: 'technical',
          },
        ],
      },
      {
        id: 'msg_004',
        sender_id: 'user_007',
        sender_name: 'Sunita Devi',
        sender_role: 'volunteer',
        content:
          'My family has been saving ₹800/month on electricity since the solar project started. Truly grateful to everyone who made this possible! 🙏',
        timestamp: new Date('2025-09-26T19:30:00'),
        message_type: 'general',
        reactions: {
          '❤️': ['user_001', 'user_002', 'user_003', 'user_006'],
          '🙏': ['user_002', 'user_008'],
        },
      },
    ];

    const mockEvents: CommunityEvent[] = [
      {
        id: 'event_001',
        title: 'Monthly Community Meeting',
        description:
          'Discuss project progress, upcoming expansions, and community feedback. Light refreshments will be provided.',
        event_type: 'meeting',
        date: new Date('2025-10-05T18:00:00'),
        location: 'UrgamU Community Center',
        organizer: 'Priya Negi',
        attendees: ['user_001', 'user_002', 'user_006'],
        max_attendees: 50,
      },
      {
        id: 'event_002',
        title: 'Solar Panel Cleaning Workshop',
        description:
          'Learn proper techniques for maintaining solar panels. Hands-on training with safety protocols.',
        event_type: 'training',
        date: new Date('2025-10-12T09:00:00'),
        location: 'Solar Installation Site',
        organizer: 'Amit Rawat',
        attendees: ['user_007', 'user_008'],
        max_attendees: 15,
        requirements: ['Safety gear provided', 'Comfortable clothing recommended'],
      },
      {
        id: 'event_003',
        title: 'Diwali Solar Festival',
        description:
          'Celebrate our first year of clean energy with a community festival. Cultural programs and traditional feast.',
        event_type: 'celebration',
        date: new Date('2025-11-12T17:00:00'),
        location: 'Village Square',
        organizer: 'Community Collective',
        attendees: [],
        max_attendees: 200,
      },
    ];

    setMessages(mockMessages);
    setEvents(mockEvents);
  }, []);

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: CommunityMessage = {
      id: `msg_${Date.now()}`,
      sender_id: currentUserId,
      sender_name: 'You', // Would be actual user name
      sender_role: 'volunteer', // Would be actual user role
      content: newMessage,
      timestamp: new Date(),
      message_type: messageType,
      reactions: {},
    };

    setMessages((prev) => [message, ...prev]);
    setNewMessage('');
  };

  // Add reaction to message
  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          if (!reactions[emoji]) reactions[emoji] = [];

          if (reactions[emoji].includes(currentUserId)) {
            reactions[emoji] = reactions[emoji].filter((id) => id !== currentUserId);
            if (reactions[emoji].length === 0) delete reactions[emoji];
          } else {
            reactions[emoji].push(currentUserId);
          }

          return { ...msg, reactions };
        }
        return msg;
      })
    );
  };

  // Join event
  const joinEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId && !event.attendees.includes(currentUserId)) {
          return {
            ...event,
            attendees: [...event.attendees, currentUserId],
          };
        }
        return event;
      })
    );
  };

  // Get message type color
  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'border-l-yellow-500 bg-yellow-500/10';
      case 'technical':
        return 'border-l-blue-500 bg-blue-500/10';
      case 'help_request':
        return 'border-l-red-500 bg-red-500/10';
      case 'update':
        return 'border-l-green-500 bg-green-500/10';
      default:
        return 'border-l-gray-500 bg-gray-500/10';
    }
  };

  // Get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'text-blue-400';
      case 'training':
        return 'text-green-400';
      case 'maintenance':
        return 'text-yellow-400';
      case 'celebration':
        return 'text-purple-400';
      case 'volunteer':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'project_manager':
        return 'bg-purple-500 text-white';
      case 'technical_lead':
        return 'bg-blue-500 text-white';
      case 'community_rep':
        return 'bg-green-500 text-white';
      case 'maintainer':
        return 'bg-yellow-500 text-black';
      case 'volunteer':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className='bg-gradient-to-r from-green-600/20 to-blue-600/20 p-6 border-b border-white/10'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-2xl font-bold text-white mb-2'>🏘️ Community Hub</h2>
            <p className='text-gray-300'>
              {project.name} • {project.community.total_beneficiaries} community members
            </p>
          </div>
          <div className='text-right text-sm'>
            <div className='text-yellow-400 font-bold'>
              Active Members: {project.contributors.length}
            </div>
            <div className='text-gray-400'>
              Satisfaction: {project.community.community_feedback_score}/5 ⭐
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className='flex gap-2 mt-6'>
          {[
            { key: 'overview', label: '📊 Overview', count: null },
            { key: 'messages', label: '💬 Messages', count: messages.length },
            { key: 'events', label: '📅 Events', count: events.length },
            { key: 'contributors', label: '👥 Contributors', count: project.contributors.length },
            { key: 'achievements', label: '🏆 Achievements', count: null },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-yellow-500 text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {tab.label} {tab.count && <span className='ml-1 opacity-75'>({tab.count})</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className='p-6'>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
            {/* Community Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div className='bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-4 text-center'>
                <div className='text-2xl font-bold text-green-400'>
                  {project.community.households_served}
                </div>
                <div className='text-sm text-gray-300'>Households Connected</div>
              </div>
              <div className='bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-4 text-center'>
                <div className='text-2xl font-bold text-blue-400'>
                  {project.community.local_employment_created}
                </div>
                <div className='text-sm text-gray-300'>Jobs Created</div>
              </div>
              <div className='bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-4 text-center'>
                <div className='text-2xl font-bold text-purple-400'>
                  {project.community.community_ownership_percent}%
                </div>
                <div className='text-sm text-gray-300'>Community Owned</div>
              </div>
              <div className='bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-lg p-4 text-center'>
                <div className='text-2xl font-bold text-yellow-400'>
                  {project.community.community_feedback_score}/5
                </div>
                <div className='text-sm text-gray-300'>Satisfaction Score</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className='bg-gray-800/50 rounded-lg p-4'>
              <h3 className='text-white font-bold mb-4'>📈 Recent Community Activity</h3>
              <div className='space-y-3'>
                <div className='flex items-center gap-3 text-sm'>
                  <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                  <span className='text-gray-300'>
                    Solar panels cleaned by volunteer team - efficiency up 3%
                  </span>
                  <span className='text-gray-500 ml-auto'>2 days ago</span>
                </div>
                <div className='flex items-center gap-3 text-sm'>
                  <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                  <span className='text-gray-300'>New maintenance technician position filled</span>
                  <span className='text-gray-500 ml-auto'>5 days ago</span>
                </div>
                <div className='flex items-center gap-3 text-sm'>
                  <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
                  <span className='text-gray-300'>Monthly community meeting - 47 attendees</span>
                  <span className='text-gray-500 ml-auto'>1 week ago</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events Preview */}
            <div className='bg-gray-800/50 rounded-lg p-4'>
              <h3 className='text-white font-bold mb-4'>🗓️ Upcoming Events</h3>
              {events.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  className='flex justify-between items-center py-2 border-b border-gray-700 last:border-0'
                >
                  <div>
                    <div className='text-white font-medium'>{event.title}</div>
                    <div className='text-sm text-gray-400'>
                      {event.date.toLocaleDateString()} • {event.location}
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${getEventTypeColor(event.event_type)}`}>
                    {event.event_type.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-4'>
            {/* Message Composer */}
            <div className='bg-gray-800/50 rounded-lg p-4'>
              <div className='flex gap-2 mb-3'>
                <select
                  value={messageType}
                  onChange={(e) => setMessageType(e.target.value as any)}
                  className='bg-gray-700 text-white rounded px-3 py-1 text-sm border border-gray-600'
                >
                  <option value='general'>💬 General</option>
                  <option value='announcement'>📢 Announcement</option>
                  <option value='technical'>🔧 Technical</option>
                  <option value='help_request'>🆘 Help Request</option>
                  <option value='update'>📊 Update</option>
                </select>
              </div>
              <div className='flex gap-2'>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder='Share with the community...'
                  className='flex-1 bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none resize-none'
                  rows={2}
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className='bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold px-4 py-2 rounded-lg transition-colors'
                >
                  Send
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className='space-y-4'>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border-l-4 rounded-lg p-4 ${getMessageTypeColor(
                    message.message_type
                  )}`}
                >
                  <div className='flex justify-between items-start mb-2'>
                    <div className='flex items-center gap-2'>
                      <span className='text-white font-bold'>{message.sender_name}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${getRoleBadgeColor(
                          message.sender_role
                        )}`}
                      >
                        {message.sender_role.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className='text-xs text-gray-400 capitalize'>
                        {message.message_type.replace('_', ' ')}
                      </span>
                    </div>
                    <span className='text-xs text-gray-400'>
                      {message.timestamp.toLocaleString()}
                    </span>
                  </div>

                  <p className='text-gray-300 mb-3'>{message.content}</p>

                  {/* Reactions */}
                  {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <div className='flex gap-2 mb-2'>
                      {Object.entries(message.reactions).map(([emoji, users]) => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(message.id, emoji)}
                          className={`px-2 py-1 rounded text-sm ${
                            users.includes(currentUserId)
                              ? 'bg-yellow-500/30 text-yellow-400'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {emoji} {users.length}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quick Reactions */}
                  <div className='flex gap-1'>
                    {['👍', '❤️', '😊', '🎉', '👏'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => addReaction(message.id, emoji)}
                        className='text-lg hover:bg-gray-700 rounded p-1 transition-colors'
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  {/* Replies */}
                  {message.replies && message.replies.length > 0 && (
                    <div className='ml-6 mt-3 space-y-2 border-l-2 border-gray-600 pl-3'>
                      {message.replies.map((reply) => (
                        <div key={reply.id} className='bg-gray-800/30 rounded p-2'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-white font-medium text-sm'>
                              {reply.sender_name}
                            </span>
                            <span className='text-xs text-gray-400'>
                              {reply.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p className='text-gray-300 text-sm'>{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-yellow-500/50 transition-colors cursor-pointer'
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className='flex justify-between items-start mb-3'>
                    <h3 className='text-white font-bold text-lg'>{event.title}</h3>
                    <span className={`text-sm font-bold ${getEventTypeColor(event.event_type)}`}>
                      {event.event_type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <p className='text-gray-300 text-sm mb-3'>{event.description}</p>

                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>📅 Date:</span>
                      <span className='text-white'>{event.date.toLocaleString()}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>📍 Location:</span>
                      <span className='text-white'>{event.location}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>👤 Organizer:</span>
                      <span className='text-white'>{event.organizer}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>👥 Attendees:</span>
                      <span className='text-white'>
                        {event.attendees.length}
                        {event.max_attendees ? `/${event.max_attendees}` : ''}
                      </span>
                    </div>
                  </div>

                  <div className='mt-4 pt-3 border-t border-gray-600'>
                    {event.attendees.includes(currentUserId) ? (
                      <div className='text-center text-green-400 font-bold'>✓ You're attending</div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          joinEvent(event.id);
                        }}
                        disabled={
                          event.max_attendees
                            ? event.attendees.length >= event.max_attendees
                            : false
                        }
                        className='w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-2 rounded transition-colors'
                      >
                        {event.max_attendees && event.attendees.length >= event.max_attendees
                          ? 'Event Full'
                          : 'Join Event'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Contributors Tab */}
        {activeTab === 'contributors' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {project.contributors.map((contributor) => (
                <motion.div
                  key={contributor.user_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='bg-gray-800/50 rounded-lg p-4 border border-gray-700'
                >
                  <div className='flex justify-between items-start mb-3'>
                    <h3 className='text-white font-bold'>{contributor.name}</h3>
                    <div className='flex items-center gap-1'>
                      <span className='text-yellow-400'>⭐</span>
                      <span className='text-white text-sm'>
                        {contributor.reputation_score.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className='mb-3'>
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${getRoleBadgeColor(
                        contributor.role
                      )}`}
                    >
                      {contributor.role.replace('_', ' ').toUpperCase()}
                    </span>
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs ${
                        contributor.verification_status === 'verified'
                          ? 'bg-green-500 text-white'
                          : contributor.verification_status === 'pending'
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {contributor.verification_status.toUpperCase()}
                    </span>
                  </div>

                  <div className='space-y-2'>
                    <div className='text-sm text-gray-400 font-bold'>Recent Contributions:</div>
                    {contributor.contributions.slice(0, 2).map((contribution, index) => (
                      <div key={index} className='text-sm bg-gray-700/50 rounded p-2'>
                        <div className='text-white capitalize font-medium'>
                          {contribution.type.replace('_', ' ')}
                        </div>
                        <div className='text-gray-300 text-xs'>{contribution.description}</div>
                        {contribution.value_owp && (
                          <div className='text-yellow-400 text-xs'>
                            {contribution.value_owp.toLocaleString()} OWP
                          </div>
                        )}
                        {contribution.hours_contributed && (
                          <div className='text-blue-400 text-xs'>
                            {contribution.hours_contributed} hours
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
            {/* Project Milestones */}
            <div className='bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-6'>
              <h3 className='text-white font-bold text-xl mb-4'>🏆 Project Achievements</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {project.specials.awards_received.length > 0 && (
                  <div>
                    <h4 className='text-yellow-400 font-bold mb-2'>🥇 Awards Received</h4>
                    <ul className='space-y-1'>
                      {project.specials.awards_received.map((award, index) => (
                        <li key={index} className='text-gray-300 text-sm'>
                          • {award}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className='text-green-400 font-bold mb-2'>🌱 Sustainability Impact</h4>
                  <ul className='space-y-1 text-sm text-gray-300'>
                    <li>• {project.community.households_served} families with clean energy</li>
                    <li>• {project.community.local_employment_created} local jobs created</li>
                    <li>
                      • {((project.capacity_kw * 1500 * 0.8) / 1000).toFixed(1)} tons CO₂ saved
                      annually
                    </li>
                    <li>
                      • ₹{((project.community.households_served * 800 * 12) / 100000).toFixed(1)}{' '}
                      lakh saved on electricity
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Innovation Features */}
            {project.specials.innovation_features.length > 0 && (
              <div className='bg-gray-800/50 rounded-lg p-4'>
                <h3 className='text-white font-bold mb-3'>💡 Innovation Features</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                  {project.specials.innovation_features.map((feature, index) => (
                    <div key={index} className='bg-blue-500/20 rounded p-3 text-sm text-gray-300'>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community Milestones */}
            <div className='bg-gray-800/50 rounded-lg p-4'>
              <h3 className='text-white font-bold mb-3'>📈 Community Milestones</h3>
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold'>
                    ✓
                  </div>
                  <div>
                    <div className='text-white font-medium'>First Year Operational</div>
                    <div className='text-gray-400 text-sm'>
                      Successfully completed 12 months of clean energy generation
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold'>
                    ✓
                  </div>
                  <div>
                    <div className='text-white font-medium'>Community Ownership Achieved</div>
                    <div className='text-gray-400 text-sm'>
                      {project.community.community_ownership_percent}% community ownership
                      established
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  <div className='w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                    ✓
                  </div>
                  <div>
                    <div className='text-white font-medium'>High Satisfaction Rating</div>
                    <div className='text-gray-400 text-sm'>
                      {project.community.community_feedback_score}/5 community satisfaction score
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CommunityHub;
