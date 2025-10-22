'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Application, applicationService, ApplicationStatus } from '@/services/applicationService';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Filter,
  Plus,
  Upload,
  User,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface MyApplicationsProps {
  onNewApplication?: () => void;
}

export function MyApplications({ onNewApplication }: MyApplicationsProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const userApplications = await applicationService.getUserApplications();
      setApplications(userApplications);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const statusMatch =
      selectedStatus === 'all' ||
      applicationService.getStatusText(app.status).toLowerCase().includes(selectedStatus);
    const typeMatch =
      selectedType === 'all' ||
      applicationService
        .getApplicationTypeText(app.applicationType)
        .toLowerCase()
        .includes(selectedType.toLowerCase());
    return statusMatch && typeMatch;
  });

  const getStatusIcon = (status: ApplicationStatus) => {
    if ('Submitted' in status) return <Clock className='w-4 h-4' />;
    if ('UnderReview' in status) return <AlertCircle className='w-4 h-4' />;
    if ('DocumentsRequested' in status) return <Upload className='w-4 h-4' />;
    if ('Interview' in status) return <User className='w-4 h-4' />;
    if ('Approved' in status) return <CheckCircle className='w-4 h-4' />;
    if ('Rejected' in status) return <XCircle className='w-4 h-4' />;
    return <Clock className='w-4 h-4' />;
  };

  const getProgressPercentage = (status: ApplicationStatus): number => {
    if ('Submitted' in status) return 20;
    if ('UnderReview' in status) return 40;
    if ('DocumentsRequested' in status) return 50;
    if ('Interview' in status) return 70;
    if ('Approved' in status) return 100;
    if ('Rejected' in status) return 100;
    return 0;
  };

  const formatDate = (timestamp: bigint): string => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-IN');
  };

  const getDaysRemaining = (deadline?: bigint): number | null => {
    if (!deadline) return null;
    const now = Date.now() * 1000000;
    const diff = Number(deadline) - now;
    return Math.ceil(diff / (24 * 60 * 60 * 1000000000));
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-white'>My Applications</h2>
          <Button disabled className='bg-blue-600'>
            <Plus className='w-4 h-4 mr-2' />
            Loading...
          </Button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[1, 2, 3].map((i) => (
            <Card key={i} className='bg-gray-800/50 border-gray-700 animate-pulse'>
              <CardContent className='p-4'>
                <div className='h-4 bg-gray-600 rounded w-3/4 mb-2'></div>
                <div className='h-3 bg-gray-600 rounded w-1/2'></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h2 className='text-2xl font-bold text-white'>My Applications</h2>
          <p className='text-gray-400'>Track your applications and submissions</p>
        </div>
        <Button onClick={onNewApplication} className='bg-blue-600 hover:bg-blue-700'>
          <Plus className='w-4 h-4 mr-2' />
          New Application
        </Button>
      </div>

      {/* Filters */}
      <Card className='bg-gray-800/50 border-gray-700'>
        <CardHeader>
          <CardTitle className='text-white text-sm flex items-center'>
            <Filter className='w-4 h-4 mr-2' />
            Filter Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-4'>
            <div>
              <label className='block text-sm text-gray-400 mb-2'>Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className='bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm'
              >
                <option value='all'>All Statuses</option>
                <option value='submitted'>Submitted</option>
                <option value='under review'>Under Review</option>
                <option value='documents'>Documents Requested</option>
                <option value='approved'>Approved</option>
                <option value='rejected'>Rejected</option>
              </select>
            </div>
            <div>
              <label className='block text-sm text-gray-400 mb-2'>Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className='bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm'
              >
                <option value='all'>All Types</option>
                <option value='land partner'>Land Partner</option>
                <option value='tech collaborator'>Tech Collaborator</option>
                <option value='community contributor'>Community Contributor</option>
                <option value='investor'>Investor</option>
                <option value='vendor'>Vendor</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Grid */}
      {filteredApplications.length === 0 ? (
        <Card className='bg-gray-800/50 border-gray-700'>
          <CardContent className='p-8 text-center'>
            <FileText className='w-12 h-12 text-gray-500 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-white mb-2'>No Applications Found</h3>
            <p className='text-gray-400 mb-4'>
              {applications.length === 0
                ? "You haven't submitted any applications yet."
                : 'No applications match your current filters.'}
            </p>
            <Button onClick={onNewApplication} className='bg-blue-600 hover:bg-blue-700'>
              Submit Your First Application
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onRefresh={loadApplications}
            />
          ))}
        </div>
      )}

      {/* Statistics */}
      {applications.length > 0 && (
        <Card className='bg-gray-800/50 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-white text-sm'>Application Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-5 gap-4 text-center'>
              <div>
                <div className='text-2xl font-bold text-blue-400'>{applications.length}</div>
                <div className='text-xs text-gray-400'>Total</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-green-400'>
                  {applications.filter((app) => 'Approved' in app.status).length}
                </div>
                <div className='text-xs text-gray-400'>Approved</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-yellow-400'>
                  {applications.filter((app) => 'UnderReview' in app.status).length}
                </div>
                <div className='text-xs text-gray-400'>In Review</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-orange-400'>
                  {applications.filter((app) => 'DocumentsRequested' in app.status).length}
                </div>
                <div className='text-xs text-gray-400'>Docs Needed</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-red-400'>
                  {applications.filter((app) => 'Rejected' in app.status).length}
                </div>
                <div className='text-xs text-gray-400'>Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ApplicationCardProps {
  application: Application;
  onRefresh: () => void;
}

function ApplicationCard({ application, onRefresh }: ApplicationCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const formatDate = (timestamp: bigint): string => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-IN');
  };

  const getDaysRemaining = (deadline?: bigint): number | null => {
    if (!deadline) return null;
    const now = Date.now() * 1000000;
    const diff = Number(deadline) - now;
    return Math.ceil(diff / (24 * 60 * 60 * 1000000000));
  };

  const getProgressPercentage = (status: ApplicationStatus): number => {
    if ('Submitted' in status) return 20;
    if ('UnderReview' in status) return 40;
    if ('DocumentsRequested' in status) return 50;
    if ('Interview' in status) return 70;
    if ('Approved' in status) return 100;
    if ('Rejected' in status) return 100;
    return 0;
  };

  const statusColor = applicationService.getStatusColor(application.status);
  const statusText = applicationService.getStatusText(application.status);
  const typeText = applicationService.getApplicationTypeText(application.applicationType);
  const priorityText = applicationService.getPriorityText(application.priority);

  const daysRemaining = getDaysRemaining(application.reviewDeadline);
  const progressPercentage = getProgressPercentage(application.status);

  return (
    <Card className='bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors'>
      <CardHeader>
        <div className='flex justify-between items-start'>
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-2'>
              <Badge
                variant='outline'
                className={`text-${statusColor}-400 border-${statusColor}-500`}
              >
                {statusText}
              </Badge>
              <Badge variant='outline' className='text-blue-400 border-blue-500'>
                {typeText}
              </Badge>
              {priorityText !== 'Low' && (
                <Badge
                  variant='outline'
                  className={`text-${priorityText === 'Urgent' ? 'red' : 'yellow'}-400`}
                >
                  {priorityText}
                </Badge>
              )}
            </div>
            <CardTitle className='text-white text-sm font-semibold mb-1'>
              {application.title}
            </CardTitle>
            <p className='text-gray-400 text-xs line-clamp-2'>{application.description}</p>
          </div>
          <div className='text-right ml-4'>
            <div className='text-xs text-gray-400'>ID: {application.id}</div>
            {daysRemaining !== null && daysRemaining > 0 && (
              <div className='text-xs text-yellow-400 flex items-center mt-1'>
                <Calendar className='w-3 h-3 mr-1' />
                {daysRemaining}d left
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Progress Bar */}
        <div className='space-y-2'>
          <div className='flex justify-between text-xs'>
            <span className='text-gray-400'>Progress</span>
            <span className='text-gray-300'>{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className='h-2' />
        </div>

        {/* Timeline Info */}
        <div className='grid grid-cols-2 gap-4 text-xs'>
          <div>
            <span className='text-gray-400'>Submitted:</span>
            <div className='text-white'>{formatDate(application.submittedAt)}</div>
          </div>
          <div>
            <span className='text-gray-400'>Updated:</span>
            <div className='text-white'>{formatDate(application.lastUpdatedAt)}</div>
          </div>
        </div>

        {/* Latest Status */}
        {application.statusHistory.length > 0 && (
          <div className='bg-gray-700/50 rounded p-3'>
            <div className='flex items-start gap-2'>
              {getStatusIcon(application.status)}
              <div className='flex-1'>
                <div className='text-xs text-gray-400 mb-1'>Latest Update</div>
                <div className='text-sm text-white'>
                  {application.statusHistory[application.statusHistory.length - 1].comments ||
                    statusText}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex gap-2'>
          <Button
            size='sm'
            variant='outline'
            onClick={() => setShowDetails(!showDetails)}
            className='flex-1 text-xs'
          >
            <FileText className='w-3 h-3 mr-1' />
            {showDetails ? 'Hide' : 'View'} Details
          </Button>

          {'DocumentsRequested' in application.status && (
            <Button size='sm' className='bg-orange-600 hover:bg-orange-700 text-xs'>
              <Upload className='w-3 h-3 mr-1' />
              Upload Docs
            </Button>
          )}

          {'Approved' in application.status && (
            <Button size='sm' className='bg-green-600 hover:bg-green-700 text-xs'>
              <ExternalLink className='w-3 h-3 mr-1' />
              Next Steps
            </Button>
          )}
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className='border-t border-gray-600 pt-4 space-y-3'>
            {/* Documents */}
            {application.uploadedDocuments.length > 0 && (
              <div>
                <h4 className='text-sm font-semibold text-white mb-2'>
                  Documents ({application.uploadedDocuments.length})
                </h4>
                <div className='space-y-2'>
                  {application.uploadedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className='flex items-center justify-between bg-gray-700/50 rounded p-2'
                    >
                      <div className='flex items-center gap-2'>
                        <FileText className='w-3 h-3 text-blue-400' />
                        <span className='text-xs text-white'>{doc.fileName}</span>
                      </div>
                      <Badge
                        variant='outline'
                        className={`text-xs ${
                          'Verified' in doc.verificationStatus
                            ? 'text-green-400'
                            : 'Rejected' in doc.verificationStatus
                              ? 'text-red-400'
                              : 'text-yellow-400'
                        }`}
                      >
                        {'Verified' in doc.verificationStatus
                          ? 'Verified'
                          : 'Rejected' in doc.verificationStatus
                            ? 'Rejected'
                            : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status History */}
            <div>
              <h4 className='text-sm font-semibold text-white mb-2'>Status History</h4>
              <div className='space-y-2 max-h-32 overflow-y-auto'>
                {application.statusHistory.map((history, index) => (
                  <div key={index} className='flex items-start gap-2 text-xs'>
                    <div className='w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0'></div>
                    <div className='flex-1'>
                      <div className='text-white font-medium'>
                        {applicationService.getStatusText(history.status)}
                      </div>
                      <div className='text-gray-400'>{formatDate(history.updatedAt)}</div>
                      {history.comments && (
                        <div className='text-gray-300 mt-1'>{history.comments}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getStatusIcon(status: ApplicationStatus) {
  if ('Submitted' in status) return <Clock className='w-4 h-4' />;
  if ('UnderReview' in status) return <AlertCircle className='w-4 h-4' />;
  if ('DocumentsRequested' in status) return <Upload className='w-4 h-4' />;
  if ('Interview' in status) return <User className='w-4 h-4' />;
  if ('Approved' in status) return <CheckCircle className='w-4 h-4' />;
  if ('Rejected' in status) return <XCircle className='w-4 h-4' />;
  return <Clock className='w-4 h-4' />;
}
