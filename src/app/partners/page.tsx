'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppHeader } from '@/components/app-header';
import { ActionCard } from '@/components/action-card';
import { ProjectApplicationForm } from '@/components/project-application-form';
import { ProjectDetail } from '@/components/project-detail';
import {
  Upload,
  File,
  Video,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Building,
  Plus,
  Edit,
  Eye,
  Download,
} from 'lucide-react';

/**
 * Render the Partners Portal page with tabs for Projects, Land Records, Applications, and Government Permissions, and provide in-memory state and handlers for viewing, creating, and navigating project/application data.
 *
 * The component maintains local state for land records, testimonials, applications, government permission statuses, and the current view (main, application, detail). It supplies handlers to open the application form, view project details, return to the main dashboard, and submit a new application (which prepends the application and a derived land record into state).
 *
 * @returns The React element representing the Partners Portal UI.
 */
export default function PartnersPage() {
  const [landRecords, setLandRecords] = useState([
    {
      id: 1,
      owner: 'Raj Kumar',
      location: 'Urgam Village - Plot 42',
      area: '2.5 acres',
      status: 'verified',
      submissionDate: '2024-12-01',
      documents: ['Khasra', 'Ownership deed', 'Land map'],
      project: {
        type: 'Solar Farm',
        capacity: '500kW',
        status: 'operational',
        production: '2.1 MW/day',
        milestones: {
          land_prepared: { completed: true, date: '2024-11-15' },
          permissions_approved: { completed: true, date: '2024-12-01' },
          construction: { completed: true, date: '2024-12-20' },
          operational: { completed: true, date: '2025-01-05' },
        },
      },
    },
    {
      id: 2,
      owner: 'Sunita Devi',
      location: 'Dewal Village - Plot 18',
      area: '1.8 acres',
      status: 'pending',
      submissionDate: '2024-12-05',
      documents: ['Khasra', 'Ownership deed'],
      project: {
        type: 'Solar + Mining',
        capacity: '300kW',
        status: 'permissions',
        production: '0 MW/day',
        milestones: {
          land_prepared: { completed: true, date: '2024-12-02' },
          permissions_approved: { completed: false, estimated: '2024-12-15' },
          construction: { completed: false, estimated: '2024-12-30' },
          operational: { completed: false, estimated: '2025-01-20' },
        },
      },
    },
    {
      id: 3,
      owner: 'Amit Sharma',
      location: 'Lata Village - Plot 33',
      area: '3.2 acres',
      status: 'under_review',
      submissionDate: '2024-12-03',
      documents: ['Khasra', 'Ownership deed', 'Land map', 'NO objection certificate'],
      project: {
        type: 'Data Center',
        capacity: '200kW',
        status: 'assessment',
        production: '0 MW/day',
        milestones: {
          land_prepared: { completed: false, estimated: '2024-12-10' },
          permissions_approved: { completed: false, estimated: '2024-12-25' },
          construction: { completed: false, estimated: '2025-01-15' },
          operational: { completed: false, estimated: '2025-02-01' },
        },
      },
    },
  ]);

  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      author: 'Priya Sharma',
      role: 'Solar Panel Owner',
      content:
        'HHDAO transformed my 2.5 acres of unused land into a productive solar farm. Now I earn regular income while contributing to clean energy!',
      videoUrl: '/testimonials/priya-sharma.mp4',
      status: 'approved',
      date: '2024-11-28',
    },
    {
      id: 2,
      author: 'Vikram Singh',
      role: 'Community Leader',
      content:
        "The transparency and regular payments from HHDAO have helped our community develop infrastructure. We've built a new community center with the revenue.",
      videoUrl: '/testimonials/vikram-singh.mp4',
      status: 'pending',
      date: '2024-12-02',
    },
  ]);

  const [applications, setApplications] = useState([
    {
      id: 1,
      type: 'Land Partnership',
      applicant: 'Raj Kumar',
      status: 'approved',
      submittedDate: '2024-11-25',
      approvedDate: '2024-12-01',
      nextStep: 'Installation scheduled',
      documents: ['Application form', 'Land proof', 'ID proof'],
    },
    {
      id: 2,
      type: 'Solar Connection',
      applicant: 'Sunita Devi',
      status: 'under_review',
      submittedDate: '2024-12-01',
      estimatedCompletion: '2024-12-15',
      nextStep: 'Document verification',
      documents: ['Application form', 'Land proof'],
    },
    {
      id: 3,
      type: 'Mining Facility',
      applicant: 'Urgam Cooperative',
      status: 'pending',
      submittedDate: '2024-12-04',
      estimatedCompletion: '2024-12-20',
      nextStep: 'Initial assessment',
      documents: ['Application form', 'Cooperative registration'],
    },
  ]);

  const [governmentStatus, setGovernmentStatus] = useState({
    landUse: {
      status: 'approved',
      authority: 'District Land Revenue Office',
      approvalDate: '2024-11-20',
      reference: 'DLRO/HHDAO/2024/042',
      documents: ['Land use application', 'Revenue records', 'Survey map'],
    },
    environmental: {
      status: 'under_review',
      authority: 'State Environmental Board',
      submittedDate: '2024-11-25',
      expectedDate: '2024-12-15',
      documents: ['Environmental impact assessment', 'Tree survey report'],
    },
    electrical: {
      status: 'approved',
      authority: 'State Electricity Board',
      approvalDate: '2024-11-28',
      reference: 'SEB/HHDAO/2024/118',
      documents: ['Electrical load application', 'Transformer capacity proof'],
    },
    building: {
      status: 'pending',
      authority: 'Gram Panchayat',
      submittedDate: '2024-12-01',
      expectedDate: '2024-12-10',
      documents: ['Building plan', 'Structural design'],
    },
  });

  // View states
  const [currentView, setCurrentView] = useState<'main' | 'application' | 'detail'>('main');
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-600';
      case 'pending':
        return 'bg-yellow-600';
      case 'under_review':
        return 'bg-blue-600';
      case 'rejected':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className='w-4 h-4' />;
      case 'pending':
        return <Clock className='w-4 h-4' />;
      case 'under_review':
        return <AlertCircle className='w-4 h-4' />;
      case 'rejected':
        return <AlertCircle className='w-4 h-4' />;
      default:
        return <File className='w-4 h-4' />;
    }
  };

  const getMilestoneIcon = (milestone: string, completed: boolean) => {
    const icons = {
      land_prepared: '🚜',
      permissions_approved: '📋',
      construction: '🏗️',
      operational: '⚡',
    };
    return completed ? '✅' : icons[milestone] || '📌';
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-600';
      case 'construction':
        return 'bg-blue-600';
      case 'permissions':
        return 'bg-yellow-600';
      case 'assessment':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  // Handler functions
  const handleNewProject = () => {
    setCurrentView('application');
  };

  const handleViewProject = (project: any) => {
    setSelectedProject(project);
    setCurrentView('detail');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedProject(null);
  };

  const handleApplicationSubmit = (data: any) => {
    // Add to applications list
    setApplications((prev) => [data, ...prev]);
    // Add to land records
    setLandRecords((prev) => [
      {
        id: Date.now(),
        owner: data.ownerName,
        location: data.location,
        area: data.area,
        status: 'pending',
        submissionDate: data.submittedDate,
        documents: data.documents.map((d: File) => d.name),
        project: {
          type: data.projectType,
          capacity: data.capacity,
          status: 'assessment',
          production: '0 MW/day',
          milestones: {
            land_prepared: { completed: false, estimated: '2024-12-10' },
            permissions_approved: { completed: false, estimated: '2024-12-25' },
            construction: { completed: false, estimated: '2025-01-15' },
            operational: { completed: false, estimated: '2025-02-01' },
          },
        },
      },
      ...prev,
    ]);
    setCurrentView('main');
  };

  // Render different views
  if (currentView === 'application') {
    return (
      <ProjectApplicationForm onSubmit={handleApplicationSubmit} onCancel={handleBackToMain} />
    );
  }

  if (currentView === 'detail' && selectedProject) {
    return <ProjectDetail project={selectedProject} onBack={handleBackToMain} />;
  }

  return (
    <div className='min-h-screen app-container p-4 pb-20'>
      {/* Status Bar */}
      <div className='flex justify-between items-center mb-4 text-sm text-gray-300'>
        <span>9:41</span>
        <div className='flex gap-1'>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Header */}
      <AppHeader
        title='Partners Portal'
        subtitle='Land Records • Projects • Applications'
        stats={[
          { label: 'Active Partners', value: '23' },
          { label: 'Land Area', value: '45 acres' },
          { label: 'Projects', value: '12' },
        ]}
        showLogo={true}
      />

      {/* Main Tabs */}
      <Tabs defaultValue='projects' className='w-full'>
        <TabsList className='grid w-full grid-cols-4 bg-gray-800'>
          <TabsTrigger value='projects' className='data-[state=active]:bg-gray-700 text-white'>
            🏗️ Projects
          </TabsTrigger>
          <TabsTrigger value='land' className='data-[state=active]:bg-gray-700 text-white'>
            📄 Land Records
          </TabsTrigger>
          <TabsTrigger value='applications' className='data-[state=active]:bg-gray-700 text-white'>
            📋 Applications
          </TabsTrigger>
          <TabsTrigger value='government' className='data-[state=active]:bg-gray-700 text-white'>
            🏛️ Government
          </TabsTrigger>
        </TabsList>

        <TabsContent value='projects' className='space-y-3'>
          <Card className='card-readable'>
            <CardHeader>
              <CardTitle className='text-sm text-white flex items-center gap-2'>
                <MapPin className='w-4 h-4' />
                Active Projects & Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {landRecords.map((record) => (
                  <div key={record.id} className='border border-gray-600 rounded-lg p-4'>
                    {/* Project Header */}
                    <div className='flex items-start justify-between mb-3'>
                      <div>
                        <h4 className='font-medium text-white'>{record.owner}</h4>
                        <p className='text-sm text-gray-300'>{record.location}</p>
                        <div className='flex gap-2 mt-1'>
                          <Badge
                            className={`${getProjectStatusColor(record.project.status)} text-white`}
                          >
                            {record.project.status}
                          </Badge>
                          <Badge variant='outline' className='border-gray-600 text-white'>
                            {record.project.type}
                          </Badge>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='text-lg font-bold text-white'>{record.project.production}</p>
                        <p className='text-xs text-gray-400'>Daily Production</p>
                      </div>
                    </div>

                    {/* Milestones */}
                    <div className='mb-3'>
                      <h5 className='text-sm font-medium text-white mb-2'>Project Milestones</h5>
                      <div className='grid grid-cols-2 gap-2'>
                        {Object.entries(record.project.milestones).map(([key, milestone]) => (
                          <div key={key} className='bg-gray-800 rounded-lg p-2'>
                            <div className='flex items-center gap-2 mb-1'>
                              <span className='text-sm'>
                                {getMilestoneIcon(key, milestone.completed)}
                              </span>
                              <span className='text-xs text-white capitalize'>
                                {key.replace('_', ' ')}
                              </span>
                            </div>
                            {milestone.completed ? (
                              <p className='text-xs text-green-400'>✅ {milestone.date}</p>
                            ) : (
                              <p className='text-xs text-yellow-400'>📅 {milestone.estimated}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className='mb-3'>
                      <div className='flex justify-between items-center mb-1'>
                        <span className='text-xs text-gray-400'>Overall Progress</span>
                        <span className='text-xs text-white'>
                          {
                            Object.values(record.project.milestones).filter((m) => m.completed)
                              .length
                          }
                          /4
                        </span>
                      </div>
                      <Progress
                        value={
                          (Object.values(record.project.milestones).filter((m) => m.completed)
                            .length /
                            4) *
                          100
                        }
                        className='h-2'
                      />
                    </div>

                    {/* Quick Actions */}
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        className='border-gray-600 text-white flex-1'
                        onClick={() => handleViewProject(record)}
                      >
                        <Eye className='w-3 h-3 mr-1' />
                        View Details
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        className='border-gray-600 text-white flex-1'
                      >
                        <Download className='w-3 h-3 mr-1' />
                        Reports
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className='w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white'
                onClick={handleNewProject}
              >
                <Plus className='w-4 h-4 mr-2' />
                Start New Project
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='land' className='space-y-3'>
          <Card className='card-readable'>
            <CardHeader>
              <CardTitle className='text-sm text-white flex items-center gap-2'>
                <MapPin className='w-4 h-4' />
                Land Records Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {landRecords.map((record) => (
                  <div key={record.id} className='border border-gray-600 rounded-lg p-3'>
                    <div className='flex items-start justify-between mb-2'>
                      <div>
                        <h4 className='font-medium text-white'>{record.owner}</h4>
                        <p className='text-sm text-gray-300'>{record.location}</p>
                        <p className='text-xs text-gray-400'>
                          {record.area} • Submitted {record.submissionDate}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(record.status)} text-white`}>
                        {record.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div className='flex items-center gap-2 mb-2'>
                      <File className='w-4 h-4 text-gray-400' />
                      <span className='text-xs text-gray-300'>
                        {record.documents.length} documents uploaded
                      </span>
                    </div>

                    <div className='flex gap-2'>
                      <Button size='sm' variant='outline' className='border-gray-600 text-white'>
                        <Eye className='w-3 h-3 mr-1' />
                        View Documents
                      </Button>
                      <Button size='sm' variant='outline' className='border-gray-600 text-white'>
                        <Download className='w-3 h-3 mr-1' />
                        Download Map
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button className='w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white'>
                <Upload className='w-4 h-4 mr-2' />
                Upload Land Record
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='applications' className='space-y-3'>
          <Card className='card-readable'>
            <CardHeader>
              <CardTitle className='text-sm text-white flex items-center gap-2'>
                <File className='w-4 h-4' />
                Application Status Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {applications.map((app) => (
                  <div key={app.id} className='border border-gray-600 rounded-lg p-3'>
                    <div className='flex items-start justify-between mb-2'>
                      <div>
                        <h4 className='font-medium text-white'>{app.type}</h4>
                        <p className='text-sm text-gray-300'>{app.applicant}</p>
                        <p className='text-xs text-gray-400'>Submitted {app.submittedDate}</p>
                      </div>
                      <div className='flex items-center gap-1'>
                        {getStatusIcon(app.status)}
                        <Badge className={`${getStatusColor(app.status)} text-white`}>
                          {app.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className='bg-gray-800 rounded-lg p-2 mb-2'>
                      <p className='text-xs text-gray-300 mb-1'>Next Step:</p>
                      <p className='text-sm text-white'>{app.nextStep}</p>
                    </div>

                    <div className='flex items-center gap-2 mb-2'>
                      <File className='w-4 h-4 text-gray-400' />
                      <span className='text-xs text-gray-300'>
                        {app.documents.length} documents
                      </span>
                    </div>

                    {app.approvedDate && (
                      <p className='text-xs text-green-400'>Approved on {app.approvedDate}</p>
                    )}

                    {app.estimatedCompletion && (
                      <p className='text-xs text-yellow-400'>
                        Estimated completion: {app.estimatedCompletion}
                      </p>
                    )}

                    <div className='flex gap-2 mt-2'>
                      <Button size='sm' variant='outline' className='border-gray-600 text-white'>
                        <Eye className='w-3 h-3 mr-1' />
                        View Details
                      </Button>
                      <Button size='sm' variant='outline' className='border-gray-600 text-white'>
                        <Edit className='w-3 h-3 mr-1' />
                        Update
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                className='w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white'
                onClick={handleNewProject}
              >
                <Plus className='w-4 h-4 mr-2' />
                New Application
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='government' className='space-y-3'>
          <Card className='card-readable'>
            <CardHeader>
              <CardTitle className='text-sm text-white flex items-center gap-2'>
                <Building className='w-4 h-4' />
                Government Permissions Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {Object.entries(governmentStatus).map(([key, status]) => (
                  <div key={key} className='border border-gray-600 rounded-lg p-3'>
                    <div className='flex items-start justify-between mb-2'>
                      <div>
                        <h4 className='font-medium text-white capitalize'>
                          {key.replace('_', ' ')}
                        </h4>
                        <p className='text-sm text-gray-300'>{status.authority}</p>
                      </div>
                      <div className='flex items-center gap-1'>
                        {getStatusIcon(status.status)}
                        <Badge className={`${getStatusColor(status.status)} text-white`}>
                          {status.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    {'approvalDate' in status && status.approvalDate && (
                      <div className='flex items-center justify-between mt-2'>
                        <span className='text-xs text-gray-400'>Approval Date:</span>
                        <span className='text-xs text-green-400'>{status.approvalDate}</span>
                      </div>
                    )}

                    {'submittedDate' in status && status.submittedDate && (
                      <div className='flex items-center justify-between mt-1'>
                        <span className='text-xs text-gray-400'>Submitted:</span>
                        <span className='text-xs text-blue-400'>{status.submittedDate}</span>
                      </div>
                    )}

                    {'expectedDate' in status && status.expectedDate && (
                      <div className='flex items-center justify-between mt-1'>
                        <span className='text-xs text-gray-400'>Expected:</span>
                        <span className='text-xs text-yellow-400'>{status.expectedDate}</span>
                      </div>
                    )}

                    {'reference' in status && status.reference && (
                      <div className='flex items-center justify-between mt-1'>
                        <span className='text-xs text-gray-400'>Reference:</span>
                        <span className='text-xs text-white font-mono'>{status.reference}</span>
                      </div>
                    )}

                    <div className='flex items-center gap-2 mt-2'>
                      <File className='w-4 h-4 text-gray-400' />
                      <span className='text-xs text-gray-300'>
                        {status.documents.length} documents
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-4 p-3 bg-blue-900/20 border border-blue-600 rounded-lg'>
                <h4 className='font-medium text-white mb-2'>📊 Overall Progress</h4>
                <Progress value={50} className='h-2 mb-2' />
                <p className='text-xs text-gray-300'>2 of 4 permissions approved • 50% complete</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}