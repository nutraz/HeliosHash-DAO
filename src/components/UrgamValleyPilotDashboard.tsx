/**
 * Urgam Valley Pilot Dashboard
 *
 * Comprehensive dashboard for managing Urgam Valley pilot operations,
 * field team deployment, and mobile data collection coordination.
 */

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UrgamValleyPilotService, { FieldTeam, PilotReadinessReport } from '@/lib/urgamValleyPilot';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Mountain,
  Navigation,
  QrCode,
  Signal,
  Smartphone,
  Truck,
  Upload,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const UrgamValleyPilotDashboard = () => {
  const [readinessReport, setReadinessReport] = useState<PilotReadinessReport | null>(null);
  const [selectedSite, setSelectedSite] = useState<string>('UV-001');
  const [fieldTeams, setFieldTeams] = useState<FieldTeam[]>([]);
  const [mobileSync, setMobileSync] = useState<any>(null);
  const [deploymentStatus, setDeploymentStatus] = useState<any>(null);

  useEffect(() => {
    const initializePilotData = async () => {
      const report = await UrgamValleyPilotService.generatePilotReadinessReport();
      setReadinessReport(report);

      const syncStatus = await UrgamValleyPilotService.generateMobileSyncReport();
      setMobileSync(syncStatus);

      // Initialize sample field teams
      setFieldTeams([
        {
          teamId: 'TEAM-001',
          leadEngineer: 'Rajesh Kumar Bhatt',
          members: ['Vikash Singh', 'Pradeep Rawat', 'Anita Devi'],
          specialization: ['Solar Assessment', 'Land Survey', 'Community Relations'],
          currentLocation: undefined,
          equipment: ['Solar Irradiation Meter', 'GPS Device', 'Soil Testing Kit', 'Drone'],
          status: 'available',
          deploymentHistory: [
            {
              siteId: 'UV-001',
              deployDate: new Date('2024-01-15'),
              returnDate: new Date('2024-01-20'),
              objectives: ['Site survey', 'Community meeting', 'Technical assessment'],
              outcomes: [
                'Site approved',
                'Community consent obtained',
                'Technical feasibility confirmed',
              ],
            },
          ],
        },
        {
          teamId: 'TEAM-002',
          leadEngineer: 'Sunita Sharma',
          members: ['Mohan Lal', 'Krishna Bhatt'],
          specialization: ['Environmental Assessment', 'Regulatory Compliance'],
          currentLocation: {
            id: 'loc-002',
            name: 'Urgam Valley Upper Slopes',
            coordinates: { latitude: 30.8245, longitude: 79.1578 },
            distanceFromBase: 672,
            altitude: 2350,
            accessibility: 'track',
          },
          equipment: ['Environmental Sensors', 'Camera Equipment', 'Documentation Kit'],
          status: 'deployed',
          deploymentHistory: [],
        },
      ]);
    };

    initializePilotData();
  }, []);

  const handleTeamDeployment = async (teamId: string, siteId: string) => {
    try {
      const deployment = await UrgamValleyPilotService.deployFieldTeam(teamId, siteId);
      setDeploymentStatus(deployment);

      // Update team status
      setFieldTeams((prev) =>
        prev.map((team) =>
          team.teamId === teamId ? { ...team, status: 'deployed' as const } : team
        )
      );
    } catch (error) {
      console.error('Deployment failed:', error);
    }
  };

  const generateQRCode = async (siteId: string) => {
    const qrCode = await UrgamValleyPilotService.generateQRCode(siteId, 'SURV-001');
    // In real implementation, this would display/download QR code
    alert(`QR Code generated: ${qrCode}`);
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-800';
      case 'in_progress':
        return 'bg-blue-50 text-blue-800';
      case 'not_started':
        return 'bg-gray-50 text-gray-800';
      default:
        return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className='space-y-6'>
      <motion.div
        className='text-center'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Urgam Valley Pilot Operations</h1>
        <p className='text-gray-600'>
          Remote solar deployment at 668km • Altitude: 2100-2350m • Pilot Capacity:{' '}
          {readinessReport?.totalCapacity.toFixed(1)}MW
        </p>
      </motion.div>

      <Tabs defaultValue='readiness' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-5'>
          <TabsTrigger value='readiness'>Pilot Readiness</TabsTrigger>
          <TabsTrigger value='sites'>Site Assessment</TabsTrigger>
          <TabsTrigger value='teams'>Field Teams</TabsTrigger>
          <TabsTrigger value='mobile'>Mobile Operations</TabsTrigger>
          <TabsTrigger value='deployment'>Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value='readiness' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Overall Readiness</p>
                    <p className='text-2xl font-bold text-green-600'>
                      {readinessReport?.overallReadiness}%
                    </p>
                  </div>
                  <CheckCircle className='h-8 w-8 text-green-600' />
                </div>
                <Progress value={readinessReport?.overallReadiness || 0} className='mt-2' />
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Sites Ready</p>
                    <p className='text-2xl font-bold text-blue-600'>
                      {readinessReport?.sitesReady}/{readinessReport?.sitesAssessed}
                    </p>
                  </div>
                  <MapPin className='h-8 w-8 text-blue-600' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Total Capacity</p>
                    <p className='text-2xl font-bold text-purple-600'>
                      {readinessReport?.totalCapacity.toFixed(1)}MW
                    </p>
                  </div>
                  <Zap className='h-8 w-8 text-purple-600' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Investment</p>
                    <p className='text-2xl font-bold text-orange-600'>
                      ₹{readinessReport?.estimatedCost.toFixed(1)}Cr
                    </p>
                  </div>
                  <Mountain className='h-8 w-8 text-orange-600' />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <AlertTriangle className='h-5 w-5 text-orange-600' />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {readinessReport?.risks.map((risk, index) => (
                  <Alert key={index} className={getRiskBadgeColor(risk.level)}>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <AlertTitle className='text-sm font-medium'>
                          {risk.category.toUpperCase()}: {risk.level.toUpperCase()} RISK
                        </AlertTitle>
                        <AlertDescription className='text-sm mt-1'>
                          {risk.description}
                        </AlertDescription>
                        <p className='text-xs mt-2 font-medium'>Mitigation: {risk.mitigation}</p>
                      </div>
                    </div>
                  </Alert>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Clock className='h-5 w-5 text-blue-600' />
                  Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {readinessReport?.nextSteps.map((step, index) => (
                  <div key={index} className='p-3 border rounded-lg'>
                    <div className='flex items-center justify-between mb-2'>
                      <h4 className='font-medium text-sm'>{step.action}</h4>
                      <Badge variant='outline'>{step.deadline.toLocaleDateString()}</Badge>
                    </div>
                    <p className='text-xs text-gray-600 mb-1'>Responsible: {step.responsible}</p>
                    <p className='text-xs text-gray-500'>
                      Dependencies: {step.dependencies.join(', ')}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Critical Path Analysis</CardTitle>
              <CardDescription>Key activities determining pilot launch timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                {readinessReport?.criticalPath.map((item, index) => (
                  <div key={index} className='flex items-center gap-2'>
                    <div className='w-6 h-6 rounded-full bg-orange-100 text-orange-800 text-xs flex items-center justify-center font-medium'>
                      {index + 1}
                    </div>
                    <span className='text-sm'>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='sites' className='space-y-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Site UV-001 */}
            <Card className='border-green-200'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center gap-2'>
                    <MapPin className='h-5 w-5 text-green-600' />
                    UV-001: Urgam Village Center
                  </CardTitle>
                  <Badge className='bg-green-50 text-green-800'>Ready</Badge>
                </div>
                <CardDescription>668km • 2100m altitude • 5.2MW capacity</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium'>Infrastructure</h4>
                    <div className='space-y-1 text-xs'>
                      <div className='flex items-center gap-2'>
                        <CheckCircle className='h-3 w-3 text-green-600' />
                        Road Access
                      </div>
                      <div className='flex items-center gap-2'>
                        <CheckCircle className='h-3 w-3 text-green-600' />
                        Communication
                      </div>
                      <div className='flex items-center gap-2'>
                        <CheckCircle className='h-3 w-3 text-green-600' />
                        Water Access
                      </div>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium'>Regulatory</h4>
                    <div className='space-y-1 text-xs'>
                      <Badge variant='outline' className='bg-green-50 text-green-800 text-xs'>
                        Forest Clearance ✓
                      </Badge>
                      <Badge variant='outline' className='bg-green-50 text-green-800 text-xs'>
                        State Permission ✓
                      </Badge>
                      <Badge variant='outline' className='bg-green-50 text-green-800 text-xs'>
                        Community Consent ✓
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className='pt-2 border-t'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium'>Technical Score</span>
                    <span className='text-sm font-bold text-green-600'>92/100</span>
                  </div>
                  <Progress value={92} className='h-2' />
                </div>

                <div className='grid grid-cols-2 gap-2 text-xs'>
                  <div>Solar: 5.8 kWh/m²/day</div>
                  <div>Wind: 3.2 m/s avg</div>
                  <div>Soil: Excellent</div>
                  <div>Flood Risk: None</div>
                </div>
              </CardContent>
            </Card>

            {/* Site UV-002 */}
            <Card className='border-orange-200'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center gap-2'>
                    <MapPin className='h-5 w-5 text-orange-600' />
                    UV-002: Valley Upper Slopes
                  </CardTitle>
                  <Badge className='bg-orange-50 text-orange-800'>In Progress</Badge>
                </div>
                <CardDescription>672km • 2350m altitude • 8.9MW capacity</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium'>Infrastructure</h4>
                    <div className='space-y-1 text-xs'>
                      <div className='flex items-center gap-2'>
                        <AlertTriangle className='h-3 w-3 text-orange-600' />
                        Track Access Only
                      </div>
                      <div className='flex items-center gap-2'>
                        <AlertTriangle className='h-3 w-3 text-orange-600' />
                        No Communication
                      </div>
                      <div className='flex items-center gap-2'>
                        <AlertTriangle className='h-3 w-3 text-orange-600' />
                        No Water Access
                      </div>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <h4 className='text-sm font-medium'>Regulatory</h4>
                    <div className='space-y-1 text-xs'>
                      <Badge variant='outline' className='bg-orange-50 text-orange-800 text-xs'>
                        Forest Clearance Pending
                      </Badge>
                      <Badge variant='outline' className='bg-orange-50 text-orange-800 text-xs'>
                        State Permission Pending
                      </Badge>
                      <Badge variant='outline' className='bg-red-50 text-red-800 text-xs'>
                        Community Consent ✗
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className='pt-2 border-t'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='text-sm font-medium'>Technical Score</span>
                    <span className='text-sm font-bold text-orange-600'>87/100</span>
                  </div>
                  <Progress value={87} className='h-2' />
                </div>

                <div className='grid grid-cols-2 gap-2 text-xs'>
                  <div>Solar: 6.1 kWh/m²/day</div>
                  <div>Wind: 4.7 m/s avg</div>
                  <div>Soil: Good</div>
                  <div>Flood Risk: Low</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='teams' className='space-y-4'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {fieldTeams.map((team) => (
              <Card
                key={team.teamId}
                className={team.status === 'deployed' ? 'border-blue-200' : 'border-green-200'}
              >
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='flex items-center gap-2'>
                      <Users className='h-5 w-5' />
                      {team.teamId}
                    </CardTitle>
                    <Badge
                      className={
                        team.status === 'deployed'
                          ? 'bg-blue-50 text-blue-800'
                          : 'bg-green-50 text-green-800'
                      }
                    >
                      {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>Lead: {team.leadEngineer}</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <h4 className='text-sm font-medium mb-2'>Team Members</h4>
                    <div className='flex flex-wrap gap-1'>
                      {team.members.map((member, idx) => (
                        <Badge key={idx} variant='outline' className='text-xs'>
                          {member}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className='text-sm font-medium mb-2'>Specialization</h4>
                    <div className='flex flex-wrap gap-1'>
                      {team.specialization.map((spec, idx) => (
                        <Badge key={idx} className='bg-purple-50 text-purple-800 text-xs'>
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className='text-sm font-medium mb-2'>Equipment</h4>
                    <div className='text-xs text-gray-600 space-y-1'>
                      {team.equipment.map((item, idx) => (
                        <div key={idx}>• {item}</div>
                      ))}
                    </div>
                  </div>

                  {team.currentLocation && (
                    <Alert className='border-blue-200 bg-blue-50'>
                      <Navigation className='h-4 w-4 text-blue-600' />
                      <AlertTitle className='text-blue-800 text-sm'>Currently Deployed</AlertTitle>
                      <AlertDescription className='text-blue-700 text-xs'>
                        {team.currentLocation.name} • {team.currentLocation.distanceFromBase}km from
                        base
                      </AlertDescription>
                    </Alert>
                  )}

                  {team.status === 'available' && (
                    <div className='flex gap-2'>
                      <Button
                        size='sm'
                        onClick={() => handleTeamDeployment(team.teamId, 'UV-002')}
                        className='flex-1'
                      >
                        <Truck className='h-4 w-4 mr-2' />
                        Deploy to UV-002
                      </Button>
                      <Button size='sm' variant='outline' onClick={() => generateQRCode('UV-002')}>
                        <QrCode className='h-4 w-4' />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {deploymentStatus && (
            <Alert className='border-green-200 bg-green-50'>
              <CheckCircle className='h-4 w-4 text-green-600' />
              <AlertTitle className='text-green-800'>Team Deployment Successful</AlertTitle>
              <AlertDescription className='text-green-700'>
                Deployment ID: {deploymentStatus.deploymentId} • Estimated Duration:{' '}
                {deploymentStatus.estimatedDuration} hours
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value='mobile' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Connectivity</p>
                    <p className='text-lg font-bold text-orange-600'>
                      {mobileSync?.connectivityStatus || 'Limited'}
                    </p>
                  </div>
                  <Signal className='h-6 w-6 text-orange-600' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Pending Uploads</p>
                    <p className='text-lg font-bold text-red-600'>
                      {mobileSync?.pendingUploads || 0}
                    </p>
                  </div>
                  <Upload className='h-6 w-6 text-red-600' />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>Offline Data</p>
                    <p className='text-lg font-bold text-blue-600'>
                      {mobileSync?.offlineData || 0}
                    </p>
                  </div>
                  <Smartphone className='h-6 w-6 text-blue-600' />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <QrCode className='h-5 w-5' />
                QR Code Field Survey System
              </CardTitle>
              <CardDescription>Generate QR codes for offline field data collection</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='p-4 border rounded-lg'>
                  <h4 className='font-medium mb-2'>UV-001 Survey</h4>
                  <p className='text-sm text-gray-600 mb-3'>
                    Village center site - Basic survey complete
                  </p>
                  <Button onClick={() => generateQRCode('UV-001')} className='w-full'>
                    Generate QR Code
                  </Button>
                </div>

                <div className='p-4 border rounded-lg'>
                  <h4 className='font-medium mb-2'>UV-002 Survey</h4>
                  <p className='text-sm text-gray-600 mb-3'>
                    Upper slopes site - Detailed assessment needed
                  </p>
                  <Button
                    onClick={() => generateQRCode('UV-002')}
                    variant='outline'
                    className='w-full'
                  >
                    Generate QR Code
                  </Button>
                </div>
              </div>

              <Alert>
                <Smartphone className='h-4 w-4' />
                <AlertTitle>Mobile App Integration</AlertTitle>
                <AlertDescription>
                  QR codes enable offline data collection with GPS coordinates, photos, and
                  measurements. Data syncs automatically when connectivity is restored.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='deployment' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Deployment Timeline & Logistics</CardTitle>
              <CardDescription>
                668km remote deployment coordination for Urgam Valley pilot
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-4'>
                  <h4 className='font-medium'>Phase 1: UV-001 (Ready for Construction)</h4>
                  <div className='space-y-2'>
                    {['Survey', 'Design', 'Approval', 'Construction', 'Commissioning'].map(
                      (phase, idx) => {
                        const status =
                          idx < 3 ? 'completed' : idx === 3 ? 'in_progress' : 'not_started';
                        return (
                          <div key={phase} className='flex items-center gap-3'>
                            <Badge className={getStatusColor(status)}>
                              {status === 'completed' ? '✓' : status === 'in_progress' ? '◐' : '○'}
                            </Badge>
                            <span className='text-sm'>{phase}</span>
                            {status === 'in_progress' && (
                              <Badge variant='outline' className='text-xs'>
                                Current
                              </Badge>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className='space-y-4'>
                  <h4 className='font-medium'>Phase 2: UV-002 (Preparation)</h4>
                  <div className='space-y-2'>
                    {['Survey', 'Design', 'Approval', 'Construction', 'Commissioning'].map(
                      (phase, idx) => {
                        const status =
                          idx < 2 ? 'completed' : idx === 2 ? 'in_progress' : 'not_started';
                        return (
                          <div key={phase} className='flex items-center gap-3'>
                            <Badge className={getStatusColor(status)}>
                              {status === 'completed' ? '✓' : status === 'in_progress' ? '◐' : '○'}
                            </Badge>
                            <span className='text-sm'>{phase}</span>
                            {status === 'in_progress' && (
                              <Badge variant='outline' className='text-xs'>
                                Current
                              </Badge>
                            )}
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>

              <div className='pt-4 border-t'>
                <h4 className='font-medium mb-3'>Logistics Coordination</h4>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='p-3 border rounded-lg'>
                    <h5 className='text-sm font-medium mb-2'>Transportation</h5>
                    <p className='text-xs text-gray-600'>
                      Material transport via Dehradun → Uttarkashi → Urgam Valley
                    </p>
                    <p className='text-xs text-blue-600 mt-1'>Travel time: ~14 hours</p>
                  </div>

                  <div className='p-3 border rounded-lg'>
                    <h5 className='text-sm font-medium mb-2'>Weather Window</h5>
                    <p className='text-xs text-gray-600'>
                      Optimal construction: March-June, Sept-November
                    </p>
                    <p className='text-xs text-orange-600 mt-1'>Monsoon risk: July-August</p>
                  </div>

                  <div className='p-3 border rounded-lg'>
                    <h5 className='text-sm font-medium mb-2'>Local Support</h5>
                    <p className='text-xs text-gray-600'>
                      Village coordinator: Harish Chandra Bhatt
                    </p>
                    <p className='text-xs text-green-600 mt-1'>127 local beneficiaries</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UrgamValleyPilotDashboard;
