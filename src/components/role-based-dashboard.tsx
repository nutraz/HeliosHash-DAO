'use client';

import {
  ApprovalItemCard,
  ComplianceReportGenerator,
  IoTSensorCard,
} from '@/components/authority/AuthorityComponents';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { dashboardService } from '@/services/dashboardService';
import { telemetryService } from '@/services/telemetryService';
import {
  AlertTriangle,
  Award,
  BarChart3,
  Briefcase,
  Eye,
  FileText,
  GraduationCap,
  MapPin,
  Shield,
  Sun,
  TrendingUp,
  Vote,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export type UserRole = 'Community' | 'Investor' | 'Authority' | 'Partner' | 'DAO';

interface RoleBasedDashboardProps {
  userRole: UserRole;
  userName?: string;
  location?: string;
  owpBalance?: number;
}

// Community Member Dashboard
const CommunityDashboard = ({ userName, location, owpBalance = 0 }: any) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        const dashboardData = await dashboardService.getDashboardData('Community');
        const communityMetrics = dashboardService.calculateRoleMetrics(
          'Community',
          dashboardData,
          location
        );
        setMetrics(communityMetrics);
      } catch (error) {
        console.error('Error loading community data:', error);
        // Fallback to mock data
        setMetrics({
          availableJobs: 8,
          trainingPrograms: 3,
          energySavings: 45,
          monthlyKwh: 312,
          co2Offset: 2.3,
          skillProgress: [
            { skill: 'Solar Basics', progress: 100 },
            { skill: 'Panel Maintenance', progress: 60 },
            { skill: 'System Design', progress: 35 },
            { skill: 'Safety Protocols', progress: 80 },
          ],
          opportunities: [
            {
              id: 1,
              title: 'Solar Technician Training',
              type: 'Training',
              location: 'UrgamU Valley',
              duration: '2 weeks',
              compensation: '₹5,000',
            },
            {
              id: 2,
              title: 'Panel Maintenance Assistant',
              type: 'Job',
              location: 'Local Project',
              duration: 'Permanent',
              compensation: '₹12,000/month',
            },
            {
              id: 3,
              title: 'Community Energy Coordinator',
              type: 'Leadership',
              location: 'Village Council',
              duration: '6 months',
              compensation: '₹8,000/month',
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    loadCommunityData();
  }, [location]);

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4'></div>
          <div className='text-white'>Loading your community dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Welcome Section */}
      <Card className='bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold text-white mb-2'>
                🏡 Welcome, {userName || 'Community Member'}!
              </h2>
              <p className='text-gray-300'>
                <MapPin className='w-4 h-4 inline mr-1' />
                {location || 'Your Local Community'}
              </p>
            </div>
            <div className='text-right'>
              <div className='text-sm text-gray-400'>Your OWP Balance</div>
              <div className='text-2xl font-bold text-yellow-400'>
                {owpBalance.toLocaleString()} OWP
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Energy Impact */}
        <Card className='bg-gray-800/50 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-white flex items-center'>
              <Sun className='w-5 h-5 mr-2 text-yellow-500' />
              Your Energy Impact
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <div className='flex justify-between text-sm mb-1'>
                <span className='text-gray-400'>Daily Savings</span>
                <span className='text-green-400'>₹{metrics?.energySavings || 0}</span>
              </div>
              <Progress value={75} className='h-2' />
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-400'>{metrics?.monthlyKwh || 0} kWh</div>
              <div className='text-sm text-gray-400'>Clean energy this month</div>
            </div>
            <div className='text-center'>
              <div className='text-lg font-bold text-green-400'>{metrics?.co2Offset || 0} tons</div>
              <div className='text-sm text-gray-400'>CO₂ offset</div>
            </div>
            <div className='mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-300'>Available Jobs</span>
                <span className='text-green-400 font-semibold'>
                  {metrics?.availableJobs || 0} openings
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Opportunities */}
        <Card className='bg-gray-800/50 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-white flex items-center'>
              <Briefcase className='w-5 h-5 mr-2 text-blue-500' />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {(metrics?.opportunities || []).slice(0, 2).map((opp: any) => (
                <div key={opp.id} className='p-3 bg-gray-700/50 rounded-lg'>
                  <div className='flex justify-between items-start mb-2'>
                    <h4 className='font-semibold text-white text-sm'>{opp.title}</h4>
                    <Badge variant='secondary' className='text-xs'>
                      {opp.type}
                    </Badge>
                  </div>
                  <div className='text-xs text-gray-400'>
                    <div>📍 {opp.location}</div>
                    <div>💰 {opp.compensation}</div>
                  </div>
                </div>
              ))}
              <div className='flex space-x-2 mt-3'>
                <Button variant='outline' size='sm' className='flex-1'>
                  View Jobs ({metrics?.availableJobs || 0})
                </Button>
                <Button variant='outline' size='sm' className='flex-1'>
                  Training ({metrics?.trainingPrograms || 0})
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills & Training */}
        <Card className='bg-gray-800/50 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-white flex items-center'>
              <GraduationCap className='w-5 h-5 mr-2 text-purple-500' />
              Skills & Training
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {(metrics?.skillProgress || []).slice(0, 3).map((skill: any) => (
              <div key={skill.skill}>
                <div className='flex justify-between text-sm mb-1'>
                  <span className='text-gray-400'>{skill.skill}</span>
                  <span className={skill.progress === 100 ? 'text-green-400' : 'text-yellow-400'}>
                    {skill.progress === 100 ? 'Completed' : `${skill.progress}%`}
                  </span>
                </div>
                <Progress value={skill.progress} className='h-2' />
              </div>
            ))}
            <div className='flex space-x-2 mt-4'>
              <Button variant='outline' size='sm' className='flex-1'>
                Continue Learning
              </Button>
              <Button variant='outline' size='sm' className='flex-1'>
                Earn OWP
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Investor Dashboard
const InvestorDashboard = ({ userName, owpBalance = 0 }: any) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvestorData = async () => {
      try {
        const dashboardData = await dashboardService.getDashboardData('Investor');
        const investorMetrics = dashboardService.calculateRoleMetrics('Investor', dashboardData);
        setMetrics(investorMetrics);
      } catch (error) {
        console.error('Error loading investor data:', error);
        // Fallback data
        setMetrics({
          totalInvested: 250000,
          currentValue: 287500,
          totalReturn: 37500,
          returnPercentage: 15,
          activeProjects: 4,
          portfolio: [
            {
              project: 'UrgamU Valley Solar',
              invested: 50000,
              currentValue: 57500,
              return: 15,
              capacity: 5,
              location: 'Gujarat',
            },
            {
              project: 'Delhi Metro Solar',
              invested: 100000,
              currentValue: 115000,
              return: 15,
              capacity: 10,
              location: 'Delhi',
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    loadInvestorData();
  }, []);

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4'></div>
          <div className='text-white'>Loading your investment portfolio...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Portfolio Overview */}
      <Card className='bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h2 className='text-2xl font-bold text-white mb-2'>📈 Investment Portfolio</h2>
              <p className='text-gray-300'>Welcome back, {userName || 'Investor'}!</p>
            </div>
            <div className='text-right'>
              <div className='text-sm text-gray-400'>OWP Holdings</div>
              <div className='text-2xl font-bold text-yellow-400'>
                {owpBalance.toLocaleString()} OWP
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>
                ₹{((metrics?.totalInvested || 0) / 1000).toFixed(0)}K
              </div>
              <div className='text-sm text-gray-400'>Total Invested</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-400'>
                ₹{((metrics?.currentValue || 0) / 1000).toFixed(0)}K
              </div>
              <div className='text-sm text-gray-400'>Current Value</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-yellow-400'>
                +{metrics?.returnPercentage || 0}%
              </div>
              <div className='text-sm text-gray-400'>Total Return</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-400'>{metrics?.activeProjects || 0}</div>
              <div className='text-sm text-gray-400'>Active Projects</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Investment Performance */}
        <Card className='bg-gray-800/50 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-white flex items-center'>
              <TrendingUp className='w-5 h-5 mr-2 text-green-500' />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {(metrics?.investments || []).map((inv: any, idx: number) => (
              <div
                key={idx}
                className='flex justify-between items-center p-3 bg-gray-700/50 rounded-lg'
              >
                <div>
                  <div className='font-semibold text-white text-sm'>{inv.project}</div>
                  <div className='text-xs text-gray-400'>
                    ₹{(inv.invested / 1000).toFixed(0)}K invested
                  </div>
                </div>
                <div className='text-right'>
                  <div className='text-green-400 font-bold'>+{inv.return}%</div>
                  <div className='text-xs text-gray-400'>
                    ₹{(inv.currentValue / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Staking & Rewards */}
        <Card className='bg-gray-800/50 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-white flex items-center'>
              <Award className='w-5 h-5 mr-2 text-purple-500' />
              Staking & Rewards
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='p-4 bg-purple-500/20 rounded-lg'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-white'>Staked OWP</span>
                <span className='text-purple-400 font-bold'>
                  {(owpBalance * 0.7).toLocaleString()} OWP
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-gray-400'>APY</span>
                <span className='text-green-400'>12.5%</span>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Daily Rewards</span>
                <span className='text-yellow-400'>+23 OWP</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>This Month</span>
                <span className='text-yellow-400'>+687 OWP</span>
              </div>
            </div>

            <Button className='w-full bg-purple-600 hover:bg-purple-700'>Manage Staking</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Authority Dashboard
const AuthorityDashboard = ({ userName, location }: any) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [telemetryData, setTelemetryData] = useState<any>(null);
  const [approvalItems, setApprovalItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthorityData = async () => {
      try {
        // Load dashboard data
        const dashboardData = await dashboardService.getDashboardData('Authority');
        const authorityMetrics = dashboardService.calculateRoleMetrics(
          'Authority',
          dashboardData,
          location
        );

        // Load telemetry data
        const telemetry = await telemetryService.getTelemetryData(location);

        // Load approval items
        const approvals = await telemetryService.getApprovalItems(location);

        setMetrics(authorityMetrics);
        setTelemetryData(telemetry);
        setApprovalItems(approvals);

        // Initialize real-time connection
        await telemetryService.initializeConnection();
      } catch (error) {
        console.error('Error loading authority data:', error);
        // Enhanced fallback data
        setMetrics({
          pendingApprovals: 3,
          activeProjects: 8,
          totalCapacity: 245,
          complianceRate: 87,
          iotSensors: [
            {
              id: 'sensor-1',
              type: 'energy_production',
              name: 'Main Solar Array',
              location: { address: 'Grid Station A' },
              status: 'online',
              lastReading: { value: 245, unit: 'kW', timestamp: new Date().toISOString() },
              thresholds: { max: 300 },
              alerts: { count: 0, severity: 'low' },
            },
            {
              id: 'sensor-2',
              type: 'mining_heat',
              name: 'Mining Thermal Monitor',
              location: { address: 'Mining Facility B' },
              status: 'online',
              lastReading: { value: 68, unit: '°C', timestamp: new Date().toISOString() },
              thresholds: { max: 75, critical: 85 },
              alerts: { count: 1, severity: 'medium' },
            },
          ],
        });
        setApprovalItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadAuthorityData();

    // Cleanup on unmount
    return () => {
      telemetryService.disconnect();
    };
  }, [location]);

  const handleApproval = async (itemId: string, notes?: string) => {
    try {
      await telemetryService.processApproval(itemId, 'approve', notes);
      // Refresh approval items
      const approvals = await telemetryService.getApprovalItems(location);
      setApprovalItems(approvals);
    } catch (error) {
      console.error('Error processing approval:', error);
    }
  };

  const handleRejection = async (itemId: string, notes?: string) => {
    try {
      await telemetryService.processApproval(itemId, 'reject', notes);
      // Refresh approval items
      const approvals = await telemetryService.getApprovalItems(location);
      setApprovalItems(approvals);
    } catch (error) {
      console.error('Error processing rejection:', error);
    }
  };

  const handleEscalation = async (itemId: string, reason: string) => {
    try {
      await telemetryService.escalateDispute(itemId, reason);
      // Refresh approval items
      const approvals = await telemetryService.getApprovalItems(location);
      setApprovalItems(approvals);
    } catch (error) {
      console.error('Error escalating dispute:', error);
    }
  };

  const handleGenerateReport = async (params: any) => {
    try {
      const report = await telemetryService.generateComplianceReport(params);
      console.log('Generated compliance report:', report);

      // In production, this would trigger a download
      // For demo, show success message
      alert(`Compliance report "${report.title}" generated successfully!`);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <div className='text-white'>Loading authority dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Authority Overview */}
      <Card className='bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h2 className='text-2xl font-bold text-white mb-2'>🏛️ Authority Dashboard</h2>
              <p className='text-gray-300'>
                <Shield className='w-4 h-4 inline mr-1' />
                {userName || 'Government Official'} • {location || 'Administrative Region'}
              </p>
            </div>
            <div className='flex items-center space-x-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-orange-400'>
                  {metrics?.pendingApprovals || 0}
                </div>
                <div className='text-sm text-gray-400'>Pending Approvals</div>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>{metrics?.totalProjects || 0}</div>
              <div className='text-sm text-gray-400'>Total Projects</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-400'>
                {metrics?.activeProjects || 0}
              </div>
              <div className='text-sm text-gray-400'>Active</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-400'>
                {metrics?.totalCapacity || 0} MW
              </div>
              <div className='text-sm text-gray-400'>Total Capacity</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-purple-400'>
                {(metrics?.householdsServed || 0).toLocaleString()}
              </div>
              <div className='text-sm text-gray-400'>Households Served</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-yellow-400'>98%</div>
              <div className='text-sm text-gray-400'>Compliance Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Real-time Telemetry */}
        <div className='lg:col-span-2 space-y-4'>
          <h3 className='text-lg font-semibold text-white mb-4'>Live IoT Telemetry</h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {(metrics?.iotSensors || []).map((sensor: any) => (
              <IoTSensorCard
                key={sensor.id}
                sensor={sensor}
                onViewDetails={(sensorId) => console.log('View details for sensor:', sensorId)}
              />
            ))}
          </div>

          {/* Aggregated Metrics */}
          <Card className='bg-gray-800/50 border-gray-700 mt-6'>
            <CardHeader>
              <CardTitle className='text-white flex items-center'>
                <BarChart3 className='w-5 h-5 mr-2 text-green-500' />
                Regional Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-green-400'>
                    {(metrics?.totalCapacity || 0).toLocaleString()} MW
                  </div>
                  <div className='text-sm text-gray-400'>Total Capacity</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-blue-400'>
                    {metrics?.activeProjects || 0}
                  </div>
                  <div className='text-sm text-gray-400'>Active Projects</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-yellow-400'>
                    {metrics?.complianceRate || 0}%
                  </div>
                  <div className='text-sm text-gray-400'>Compliance Rate</div>
                </div>
                <div className='text-center'>
                  <div className='text-2xl font-bold text-orange-400'>
                    {metrics?.pendingApprovals || 0}
                  </div>
                  <div className='text-sm text-gray-400'>Pending Approvals</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Report Generator */}
        <div className='space-y-6'>
          <ComplianceReportGenerator onGenerateReport={(params) => handleGenerateReport(params)} />

          {/* Quick Actions */}
          <Card className='bg-gray-800/50 border-gray-700'>
            <CardHeader>
              <CardTitle className='text-white text-sm'>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Button variant='outline' size='sm' className='w-full text-xs'>
                <Eye className='w-3 h-3 mr-2' />
                View All IoT Sensors
              </Button>
              <Button variant='outline' size='sm' className='w-full text-xs'>
                <FileText className='w-3 h-3 mr-2' />
                Compliance Dashboard
              </Button>
              <Button variant='outline' size='sm' className='w-full text-xs'>
                <AlertTriangle className='w-3 h-3 mr-2' />
                Alert Management
              </Button>
              <Button variant='outline' size='sm' className='w-full text-xs'>
                <Shield className='w-3 h-3 mr-2' />
                Project Oversight
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approval Workflow Section */}
      <div className='mt-8'>
        <h3 className='text-lg font-semibold text-white mb-4'>Pending Approvals & Workflow</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {approvalItems.map((item: any) => (
            <ApprovalItemCard
              key={item.id}
              item={item}
              onApprove={handleApproval}
              onReject={handleRejection}
              onEscalate={handleEscalation}
              onViewDocuments={(id) => console.log('View documents for:', id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Partner Dashboard
const PartnerDashboard = ({ userName }: any) => {
  const [partnershipStats] = useState({
    activePartnerships: 6,
    projectsSupported: 15,
    impactReach: 5200,
    fundingProvided: 1250000,
  });

  return (
    <div className='space-y-6'>
      {/* Partner Overview */}
      <Card className='bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <h2 className='text-2xl font-bold text-white mb-2'>🤝 Partnership Hub</h2>
              <p className='text-gray-300'>Welcome, {userName || 'Partner Organization'}</p>
            </div>
            <div className='text-right'>
              <div className='text-sm text-gray-400'>Partnership Level</div>
              <div className='text-2xl font-bold text-purple-400'>Strategic</div>
            </div>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>
                {partnershipStats.activePartnerships}
              </div>
              <div className='text-sm text-gray-400'>Active Partnerships</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-400'>
                {partnershipStats.projectsSupported}
              </div>
              <div className='text-sm text-gray-400'>Projects Supported</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-400'>
                {partnershipStats.impactReach.toLocaleString()}
              </div>
              <div className='text-sm text-gray-400'>People Reached</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-yellow-400'>
                ₹{(partnershipStats.fundingProvided / 100000).toFixed(1)}L
              </div>
              <div className='text-sm text-gray-400'>Funding Provided</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partnership Actions */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='bg-gray-800/50 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-white'>🎯 New Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className='w-full bg-purple-600 hover:bg-purple-700 mb-4'>
              Submit Partnership Proposal
            </Button>
            <div className='text-sm text-gray-400'>
              Create new collaboration opportunities with communities and projects.
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gray-800/50 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-white'>📊 Impact Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className='w-full bg-blue-600 hover:bg-blue-700 mb-4'>
              Generate Impact Report
            </Button>
            <div className='text-sm text-gray-400'>
              Track and measure the social and environmental impact of your partnerships.
            </div>
          </CardContent>
        </Card>

        <Card className='bg-gray-800/50 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-white'>🌐 Network</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className='w-full bg-green-600 hover:bg-green-700 mb-4'>Expand Network</Button>
            <div className='text-sm text-gray-400'>
              Connect with other partners, communities, and stakeholders in the ecosystem.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// DAO Governance Dashboard
const DAODashboard = ({ userName, owpBalance = 0 }: any) => {
  const [governanceStats] = useState({
    activeProposals: 8,
    votingPower: Math.floor(owpBalance * 0.1),
    participationRate: 89,
    proposalsVoted: 23,
  });

  const [recentProposals] = useState([
    {
      id: 1,
      title: 'Increase Community Ownership Threshold to 65%',
      status: 'Active',
      votesFor: 2340,
      votesAgainst: 890,
      timeLeft: '3 days',
    },
    {
      id: 2,
      title: 'Establish Solar Training Academy Fund',
      status: 'Passed',
      votesFor: 3200,
      votesAgainst: 450,
      timeLeft: 'Completed',
    },
    {
      id: 3,
      title: 'Partnership with Maharashtra State Energy Board',
      status: 'Active',
      votesFor: 1800,
      votesAgainst: 1200,
      timeLeft: '5 days',
    },
  ]);

  return (
    <div className='space-y-6'>
      {/* DAO Overview */}
      <Card className='bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30'>
        <CardContent className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <div>
              <h2 className='text-2xl font-bold text-white mb-2'>🗳️ DAO Governance</h2>
              <p className='text-gray-300'>Welcome, {userName || 'DAO Member'}</p>
            </div>
            <div className='text-right'>
              <div className='text-sm text-gray-400'>Voting Power</div>
              <div className='text-2xl font-bold text-orange-400'>
                {governanceStats.votingPower.toLocaleString()}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>{governanceStats.activeProposals}</div>
              <div className='text-sm text-gray-400'>Active Proposals</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-400'>
                {governanceStats.participationRate}%
              </div>
              <div className='text-sm text-gray-400'>Participation Rate</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-400'>
                {governanceStats.proposalsVoted}
              </div>
              <div className='text-sm text-gray-400'>Proposals Voted</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-yellow-400'>
                {owpBalance.toLocaleString()}
              </div>
              <div className='text-sm text-gray-400'>OWP Holdings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Active Proposals */}
        <Card className='bg-gray-800/50 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-white flex items-center'>
              <Vote className='w-5 h-5 mr-2 text-orange-500' />
              Active Proposals
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {recentProposals
              .filter((p) => p.status === 'Active')
              .map((proposal) => (
                <div key={proposal.id} className='p-3 bg-gray-700/50 rounded-lg'>
                  <h4 className='font-semibold text-white text-sm mb-2'>{proposal.title}</h4>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-xs'>
                      <span className='text-green-400'>
                        For: {proposal.votesFor.toLocaleString()}
                      </span>
                      <span className='text-red-400'>
                        Against: {proposal.votesAgainst.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={
                        (proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100
                      }
                      className='h-2'
                    />
                    <div className='flex justify-between items-center'>
                      <span className='text-xs text-gray-400'>{proposal.timeLeft} left</span>
                      <div className='flex space-x-2'>
                        <Button size='sm' className='bg-green-600 hover:bg-green-700 text-xs'>
                          Vote For
                        </Button>
                        <Button size='sm' variant='outline' className='text-xs'>
                          Vote Against
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Governance Analytics */}
        <Card className='bg-gray-800/50 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-white flex items-center'>
              <BarChart3 className='w-5 h-5 mr-2 text-blue-500' />
              Your DAO Activity
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='p-3 bg-blue-500/20 rounded-lg'>
              <div className='flex justify-between items-center mb-2'>
                <span className='text-white'>Participation Score</span>
                <span className='text-blue-400 font-bold'>Excellent</span>
              </div>
              <Progress value={92} className='h-2' />
              <div className='text-xs text-gray-400 mt-1'>92% of proposals voted on</div>
            </div>

            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Governance Rewards</span>
                <span className='text-yellow-400'>+156 OWP</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Proposals Created</span>
                <span className='text-blue-400'>3</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Community Rank</span>
                <span className='text-purple-400'>Top 15%</span>
              </div>
            </div>

            <Button className='w-full bg-orange-600 hover:bg-orange-700'>
              Create New Proposal
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const RoleBasedDashboard = ({
  userRole,
  userName,
  location,
  owpBalance = 0,
}: RoleBasedDashboardProps) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6'>
      <div className='max-w-7xl mx-auto'>
        {userRole === 'Community' && (
          <CommunityDashboard userName={userName} location={location} owpBalance={owpBalance} />
        )}
        {userRole === 'Investor' && (
          <InvestorDashboard userName={userName} owpBalance={owpBalance} />
        )}
        {userRole === 'Authority' && <AuthorityDashboard userName={userName} location={location} />}
        {userRole === 'Partner' && <PartnerDashboard userName={userName} />}
        {userRole === 'DAO' && <DAODashboard userName={userName} owpBalance={owpBalance} />}
      </div>
    </div>
  );
};

export default RoleBasedDashboard;
