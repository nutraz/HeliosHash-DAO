// === Project Application System ===
// Apply for projects and track application status in real-time

'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ProjectApplication, ProjectVacancy, SolarProject } from '../types/enhanced-solar-project';

interface ProjectApplicationSystemProps {
  project: SolarProject;
  userId?: string;
  onApplicationSubmit?: (application: Partial<ProjectApplication>) => Promise<void>;
  className?: string;
}

export const ProjectApplicationSystem = ({
  project,
  userId = 'user_demo_001',
  onApplicationSubmit,
  className,
}: ProjectApplicationSystemProps) => {
  const [selectedVacancy, setSelectedVacancy] = useState<ProjectVacancy | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cover_letter: '',
    skills: [] as string[],
    experience_years: 0,
    availability: '',
    contribution_type: 'time' as 'time' | 'money' | 'materials' | 'expertise',
    contribution_description: '',
    contribution_amount: 0,
  });
  const [userApplications, setUserApplications] = useState<ProjectApplication[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user applications for demonstration
  useEffect(() => {
    const mockApplications: ProjectApplication[] = [
      {
        id: 'app_001',
        project_id: project.id,
        applicant_user_id: userId,
        vacancy_id: project.vacancies[0]?.id,
        application_type: 'job',
        cover_letter:
          'I am passionate about solar energy and would love to contribute to this project.',
        skills: ['Solar panel maintenance', 'Electrical troubleshooting', 'Community relations'],
        experience_years: 3,
        availability: 'Full-time, weekdays preferred',
        expected_contribution: {
          type: 'time',
          description: 'Regular maintenance and community engagement',
        },
        status: 'under_review',
        submitted_date: new Date('2025-09-20'),
        reviewed_date: new Date('2025-09-25'),
        reviewer_id: 'reviewer_001',
        feedback: 'Good technical background, scheduling interview next week.',
        status_updates: [
          {
            status: 'submitted',
            message: 'Application received and initial review completed',
            timestamp: new Date('2025-09-20'),
            updated_by: 'System',
          },
          {
            status: 'under_review',
            message: 'Technical team is reviewing your qualifications',
            timestamp: new Date('2025-09-22'),
            updated_by: 'Rajesh Sharma',
          },
          {
            status: 'interview_scheduled',
            message: 'Interview scheduled for Oct 5th at 10 AM via video call',
            timestamp: new Date('2025-09-25'),
            updated_by: 'Priya Negi',
          },
        ],
      },
    ];
    setUserApplications(mockApplications);
  }, [project.id, userId]);

  // Handle application submission
  const handleSubmitApplication = async () => {
    if (!selectedVacancy) return;

    setIsSubmitting(true);
    try {
      const newApplication: Partial<ProjectApplication> = {
        project_id: project.id,
        applicant_user_id: userId,
        vacancy_id: selectedVacancy.id,
        application_type: 'job',
        ...applicationData,
        expected_contribution: {
          type: applicationData.contribution_type,
          amount: applicationData.contribution_amount || undefined,
          description: applicationData.contribution_description,
        },
        status: 'submitted',
        submitted_date: new Date(),
        status_updates: [
          {
            status: 'submitted',
            message: 'Application submitted successfully',
            timestamp: new Date(),
            updated_by: 'System',
          },
        ],
      };

      await onApplicationSubmit?.(newApplication);

      // Add to local state for demo
      setUserApplications((prev) => [
        ...prev,
        {
          ...newApplication,
          id: `app_${Date.now()}`,
        } as ProjectApplication,
      ]);

      // Reset form
      setApplicationData({
        cover_letter: '',
        skills: [],
        experience_years: 0,
        availability: '',
        contribution_type: 'time',
        contribution_description: '',
        contribution_amount: 0,
      });
      setShowApplicationForm(false);
      setSelectedVacancy(null);
    } catch (error) {
      console.error('Failed to submit application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-400';
      case 'under_review':
        return 'text-yellow-400';
      case 'interview_scheduled':
        return 'text-blue-400';
      case 'submitted':
        return 'text-gray-400';
      case 'rejected':
        return 'text-red-400';
      case 'on_hold':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  // Get urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  // Add skill
  const addSkill = (skill: string) => {
    if (skill.trim() && !applicationData.skills.includes(skill.trim())) {
      setApplicationData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }));
    }
  };

  // Remove skill
  const removeSkill = (skill: string) => {
    setApplicationData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  return (
    <div className={`bg-gray-900 rounded-xl p-6 ${className}`}>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-2xl font-bold text-white mb-2'>💼 Project Applications</h2>
          <p className='text-gray-400'>{project.name}</p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-sm text-gray-400'>Open Positions:</span>
          <span className='bg-yellow-500 text-black px-2 py-1 rounded font-bold'>
            {project.vacancies.length}
          </span>
        </div>
      </div>

      {/* Available Positions */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
        {project.vacancies.map((vacancy) => (
          <motion.div
            key={vacancy.id}
            className='bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-yellow-500/50 transition-colors cursor-pointer'
            whileHover={{ scale: 1.02 }}
            onClick={() => {
              setSelectedVacancy(vacancy);
              setShowApplicationForm(true);
            }}
          >
            <div className='flex justify-between items-start mb-3'>
              <h3 className='text-white font-bold text-lg'>{vacancy.title}</h3>
              <span
                className={`text-xs font-bold px-2 py-1 rounded ${getUrgencyColor(
                  vacancy.urgency
                )}`}
              >
                {vacancy.urgency.toUpperCase()}
              </span>
            </div>

            <p className='text-gray-300 text-sm mb-3 line-clamp-2'>{vacancy.description}</p>

            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Category:</span>
                <span className='text-white capitalize'>{vacancy.category.replace('_', ' ')}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Compensation:</span>
                <span className='text-yellow-400 font-bold'>
                  {vacancy.compensation_owp.toLocaleString()} OWP
                  {vacancy.compensation_inr && ` + ₹${vacancy.compensation_inr.toLocaleString()}`}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Positions:</span>
                <span className='text-white'>{vacancy.positions_available} available</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Applications:</span>
                <span className='text-blue-400'>{vacancy.applications_count} received</span>
              </div>
            </div>

            <div className='mt-3 pt-3 border-t border-gray-600'>
              <div className='text-xs text-gray-400 mb-1'>Requirements:</div>
              <div className='flex flex-wrap gap-1'>
                {vacancy.requirements.slice(0, 2).map((req, index) => (
                  <span key={index} className='bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs'>
                    {req}
                  </span>
                ))}
                {vacancy.requirements.length > 2 && (
                  <span className='text-gray-400 text-xs'>
                    +{vacancy.requirements.length - 2} more
                  </span>
                )}
              </div>
            </div>

            <button className='w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded transition-colors'>
              Apply Now
            </button>
          </motion.div>
        ))}
      </div>

      {/* Your Applications */}
      <div className='mb-8'>
        <h3 className='text-xl font-bold text-white mb-4 flex items-center gap-2'>
          📋 Your Applications ({userApplications.length})
        </h3>

        {userApplications.length > 0 ? (
          <div className='space-y-4'>
            {userApplications.map((application) => {
              const vacancy = project.vacancies.find((v) => v.id === application.vacancy_id);
              return (
                <motion.div
                  key={application.id}
                  className='bg-gray-800/50 rounded-lg p-4 border border-gray-700'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className='flex justify-between items-start mb-3'>
                    <div>
                      <h4 className='text-white font-bold'>{vacancy?.title || 'Position'}</h4>
                      <p className='text-gray-400 text-sm'>
                        Applied: {application.submitted_date.toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm font-bold ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {application.feedback && (
                    <div className='bg-blue-500/20 border border-blue-500/30 rounded p-3 mb-3'>
                      <div className='text-blue-400 font-bold text-sm mb-1'>Feedback:</div>
                      <p className='text-gray-300 text-sm'>{application.feedback}</p>
                    </div>
                  )}

                  {/* Status Timeline */}
                  <div className='space-y-2'>
                    <div className='text-sm text-gray-400 font-bold'>Status Updates:</div>
                    {application.status_updates.map((update, index) => (
                      <div key={index} className='flex items-start gap-3 text-sm'>
                        <div className='w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0'></div>
                        <div className='flex-1'>
                          <div className='flex justify-between items-center'>
                            <span className='text-white font-medium'>{update.message}</span>
                            <span className='text-gray-400 text-xs'>
                              {update.timestamp.toLocaleDateString()}
                            </span>
                          </div>
                          <div className='text-gray-400 text-xs'>by {update.updated_by}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className='text-center py-8 text-gray-400'>
            <div className='text-4xl mb-2'>📄</div>
            <p>No applications submitted yet</p>
            <p className='text-sm'>Apply to available positions above to get started</p>
          </div>
        )}
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && selectedVacancy && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center p-6 z-50'
          onClick={() => setShowApplicationForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className='bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='p-6'>
              <div className='flex justify-between items-center mb-6'>
                <h3 className='text-2xl font-bold text-white'>Apply: {selectedVacancy.title}</h3>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className='text-gray-400 hover:text-white text-2xl'
                >
                  ×
                </button>
              </div>

              <div className='space-y-6'>
                {/* Cover Letter */}
                <div>
                  <label className='block text-white font-bold mb-2'>Cover Letter</label>
                  <textarea
                    value={applicationData.cover_letter}
                    onChange={(e) =>
                      setApplicationData((prev) => ({ ...prev, cover_letter: e.target.value }))
                    }
                    placeholder="Tell us why you're interested in this position..."
                    className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none'
                    rows={4}
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className='block text-white font-bold mb-2'>Skills</label>
                  <div className='flex flex-wrap gap-2 mb-2'>
                    {applicationData.skills.map((skill) => (
                      <span
                        key={skill}
                        className='bg-yellow-500 text-black px-3 py-1 rounded-full text-sm flex items-center gap-2'
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className='text-red-600 hover:text-red-800'
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type='text'
                    placeholder='Add a skill and press Enter'
                    className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none'
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>

                {/* Experience & Availability */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-white font-bold mb-2'>Experience (years)</label>
                    <input
                      type='number'
                      value={applicationData.experience_years}
                      onChange={(e) =>
                        setApplicationData((prev) => ({
                          ...prev,
                          experience_years: parseInt(e.target.value) || 0,
                        }))
                      }
                      className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none'
                      min='0'
                    />
                  </div>
                  <div>
                    <label className='block text-white font-bold mb-2'>Availability</label>
                    <input
                      type='text'
                      value={applicationData.availability}
                      onChange={(e) =>
                        setApplicationData((prev) => ({ ...prev, availability: e.target.value }))
                      }
                      placeholder='e.g., Full-time, Part-time, Weekends'
                      className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none'
                    />
                  </div>
                </div>

                {/* Expected Contribution */}
                <div>
                  <label className='block text-white font-bold mb-2'>Expected Contribution</label>
                  <select
                    value={applicationData.contribution_type}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        contribution_type: e.target.value as any,
                      }))
                    }
                    className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none mb-3'
                  >
                    <option value='time'>Time & Labor</option>
                    <option value='money'>Financial Investment</option>
                    <option value='materials'>Materials & Equipment</option>
                    <option value='expertise'>Technical Expertise</option>
                  </select>
                  <textarea
                    value={applicationData.contribution_description}
                    onChange={(e) =>
                      setApplicationData((prev) => ({
                        ...prev,
                        contribution_description: e.target.value,
                      }))
                    }
                    placeholder='Describe what you can contribute to this project...'
                    className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none'
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className='flex gap-4 mt-8'>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className='flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApplication}
                  disabled={isSubmitting || !applicationData.cover_letter.trim()}
                  className='flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors'
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectApplicationSystem;
