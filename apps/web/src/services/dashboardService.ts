// Dashboard data integration service
// Connects role-based dashboards with backend APIs

export interface DashboardData {
  projects: any[];
  jobs: any[];
  proposals: any[];
  userStats: any;
  achievements: any[];
  cycles: any;
}

export interface RoleDashboardMetrics {
  Community: {
    availableJobs: number;
    trainingPrograms: number;
    energySavings: number;
    co2Offset: number;
    skillProgress: { skill: string; progress: number }[];
  };
  Investor: {
    totalInvested: number;
    currentValue: number;
    totalReturn: number;
    returnPercentage: number;
    activeProjects: number;
    portfolio: any[];
  };
  Authority: {
    pendingApprovals: number;
    activeProjects: number;
    totalCapacity: number;
    complianceRate: number;
    iotSensors: any[];
  };
  Partner: {
    activeProposals: number;
    completedProjects: number;
    revenue: number;
    partnerships: number;
    performanceScore: number;
  };
  DAO: {
    activeProposals: number;
    treasuryBalance: number;
    totalMembers: number;
    votingPower: number;
    governanceScore: number;
  };
}

class DashboardService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private async fetchWithCache(endpoint: string): Promise<any> {
    const cached = this.cache.get(endpoint);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch(`/api${endpoint}`);
      if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);

      const data = await response.json();
      this.cache.set(endpoint, { data, timestamp: now });
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      // Return cached data if available, otherwise empty fallback
      return cached?.data || this.getEmptyFallback(endpoint);
    }
  }

  private getEmptyFallback(endpoint: string): any {
    switch (endpoint) {
      case '/projects':
        return { projects: [] };
      case '/jobs':
        return { jobs: [] };
      case '/dao/proposals':
        return { proposals: [] };
      case '/user-stats':
        return { stats: {} };
      case '/achievements':
        return { achievements: [] };
      case '/cycles':
        return { cycles: {} };
      default:
        return {};
    }
  }

  async getDashboardData(userRole: string, userId?: string): Promise<DashboardData> {
    const [projects, jobs, proposals, userStats, achievements, cycles] = await Promise.all([
      this.fetchWithCache('/projects'),
      this.fetchWithCache('/jobs'),
      this.fetchWithCache('/dao/proposals'),
      this.fetchWithCache('/user-stats'),
      this.fetchWithCache('/achievements'),
      this.fetchWithCache('/cycles'),
    ]);

    return {
      projects: projects.projects || [],
      jobs: jobs.jobs || [],
      proposals: proposals.proposals || [],
      userStats: userStats.stats || {},
      achievements: achievements.achievements || [],
      cycles: cycles.cycles || {},
    };
  }

  calculateRoleMetrics(role: string, data: DashboardData, userLocation?: string): any {
    switch (role) {
      case 'Community':
        return this.calculateCommunityMetrics(data, userLocation);
      case 'Investor':
        return this.calculateInvestorMetrics(data);
      case 'Authority':
        return this.calculateAuthorityMetrics(data, userLocation);
      case 'Partner':
        return this.calculatePartnerMetrics(data);
      case 'DAO':
        return this.calculateDAOMetrics(data);
      default:
        return {};
    }
  }

  private calculateCommunityMetrics(data: DashboardData, userLocation?: string): any {
    const localJobs = data.jobs.filter(
      (job) => !userLocation || job.location?.location?.includes(userLocation)
    );

    const trainingJobs = localJobs.filter(
      (job) => job.category === 'Training' || job.title.toLowerCase().includes('training')
    );

    // Mock energy data - in real implementation, fetch from telemetry canister
    const energyData = {
      dailySavings: Math.floor(Math.random() * 50) + 30,
      monthlyKwh: Math.floor(Math.random() * 200) + 250,
      carbonOffset: Math.random() * 3 + 1,
    };

    const skillProgress = [
      { skill: 'Solar Basics', progress: 100 },
      { skill: 'Panel Maintenance', progress: Math.floor(Math.random() * 40) + 60 },
      { skill: 'System Design', progress: Math.floor(Math.random() * 50) + 20 },
      { skill: 'Safety Protocols', progress: Math.floor(Math.random() * 30) + 70 },
    ];

    return {
      availableJobs: localJobs.length,
      trainingPrograms: trainingJobs.length,
      energySavings: energyData.dailySavings,
      monthlyKwh: energyData.monthlyKwh,
      co2Offset: Number(energyData.carbonOffset.toFixed(1)),
      skillProgress,
      opportunities: localJobs.slice(0, 3).map((job) => ({
        id: job.id,
        title: job.title,
        type: job.category,
        location: job.location?.location || 'Remote',
        duration: job.workType === 'FullTime' ? 'Permanent' : 'Contract',
        compensation: `₹${job.compensation?.amount?.toLocaleString() || 'TBD'}${
          job.compensation?.paymentType === 'Monthly' ? '/month' : ''
        }`,
      })),
    };
  }

  private calculateInvestorMetrics(data: DashboardData): any {
    const operationalProjects = data.projects.filter(
      (p) => p.status === 'operational' || p.status === 'completed'
    );

    // Mock portfolio calculation - in real implementation, fetch from user's investment canister
    const totalInvested = 250000 + Math.floor(Math.random() * 100000);
    const returnPercentage = 15 + Math.floor(Math.random() * 10);
    const currentValue = totalInvested * (1 + returnPercentage / 100);

    const portfolio = operationalProjects.slice(0, 4).map((project) => ({
      project: project.name,
      invested: Math.floor(Math.random() * 100000) + 25000,
      currentValue: 0, // Will be calculated
      return: returnPercentage,
      capacity: project.capacity,
      location: `${project.location.city}, ${project.location.state}`,
    }));

    // Calculate current values for portfolio items
    portfolio.forEach((item) => {
      item.currentValue = item.invested * (1 + item.return / 100);
    });

    return {
      totalInvested,
      currentValue: Math.floor(currentValue),
      totalReturn: Math.floor(currentValue - totalInvested),
      returnPercentage,
      activeProjects: operationalProjects.length,
      portfolio,
    };
  }

  private calculateAuthorityMetrics(data: DashboardData, userLocation?: string): any {
    const regionalProjects = data.projects.filter(
      (p) => !userLocation || p.location?.state?.includes(userLocation)
    );

    const pendingApprovals = regionalProjects.filter(
      (p) => p.status === 'proposed' || p.status === 'approved'
    ).length;

    const totalCapacity = regionalProjects.reduce((sum, p) => sum + (p.capacity || 0), 0);

    // Mock compliance calculation
    const complianceRate = Math.floor(Math.random() * 20) + 80;

    // Mock IoT sensor data
    const iotSensors = [
      { id: 1, location: 'Grid Station A', status: 'online', value: 245, unit: 'kW' },
      { id: 2, location: 'Solar Farm B', status: 'online', value: 1850, unit: 'kW' },
      { id: 3, location: 'District Center', status: 'offline', value: 0, unit: 'kW' },
    ];

    return {
      pendingApprovals,
      activeProjects: regionalProjects.length,
      totalCapacity: Math.floor(totalCapacity),
      complianceRate,
      iotSensors,
      regionalProjects: regionalProjects.slice(0, 5),
    };
  }

  private calculatePartnerMetrics(data: DashboardData): any {
    const activeProposals = data.proposals.filter(
      (p) => p.status === 'active' || p.status === 'voting'
    ).length;

    const completedProjects = data.projects.filter((p) => p.status === 'completed').length;

    // Mock partner performance data
    const revenue = Math.floor(Math.random() * 500000) + 200000;
    const partnerships = Math.floor(Math.random() * 8) + 5;
    const performanceScore = Math.floor(Math.random() * 20) + 80;

    return {
      activeProposals,
      completedProjects,
      revenue,
      partnerships,
      performanceScore,
      recentProposals: data.proposals.slice(0, 3),
      projectPipeline: data.projects.filter((p) => p.status === 'proposed').slice(0, 3),
    };
  }

  private calculateDAOMetrics(data: DashboardData): any {
    const activeProposals = data.proposals.filter(
      (p) => p.status === 'active' || p.status === 'voting'
    ).length;

    // Mock treasury and governance data
    const treasuryBalance = 1500000 + Math.floor(Math.random() * 500000);
    const totalMembers = 1250 + Math.floor(Math.random() * 300);
    const votingPower = Math.floor(Math.random() * 30) + 70;
    const governanceScore = Math.floor(Math.random() * 15) + 85;

    return {
      activeProposals,
      treasuryBalance,
      totalMembers,
      votingPower,
      governanceScore,
      recentProposals: data.proposals.slice(0, 4),
      treasuryAllocations: [
        { category: 'Development', amount: treasuryBalance * 0.4, percentage: 40 },
        { category: 'Operations', amount: treasuryBalance * 0.3, percentage: 30 },
        { category: 'Marketing', amount: treasuryBalance * 0.2, percentage: 20 },
        { category: 'Reserve', amount: treasuryBalance * 0.1, percentage: 10 },
      ],
    };
  }
}

export const dashboardService = new DashboardService();
