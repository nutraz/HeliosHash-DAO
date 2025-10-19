/**
<<<<<<< HEAD
 * Urgam Valley Pilot System
 *
 * Comprehensive pilot deployment system for solar installations in Urgam Valley
 * with 668km proximity operations, field testing workflows, and regulatory compliance.
 */

export interface UrgamValleyLocation {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distanceFromBase: number; // kilometers
  altitude: number; // meters above sea level
  accessibility: 'road' | 'track' | 'foot_path' | 'helicopter_only';
  lastSurveyDate?: Date;
}

export interface PilotSite {
  siteId: string;
  location: UrgamValleyLocation;
  landArea: number; // acres
  suitabilityScore: number; // 0-100
  estimatedCapacity: number; // MW
  infrastructure: {
    roadAccess: boolean;
    powerGrid: boolean;
    communication: boolean;
    waterAccess: boolean;
  };
  regulatory: {
    forestClearance: 'required' | 'not_required' | 'obtained';
    environmentalImpact: 'minimal' | 'moderate' | 'high';
    tribalConsent: 'required' | 'not_required' | 'obtained';
    statePermission: 'pending' | 'approved' | 'rejected';
  };
  communityEngagement: {
    villageConsent: boolean;
    beneficiaryCount: number;
    leadContact: string;
    contactNumber: string;
  };
  technicalAssessment: {
    solarIrradiation: number; // kWh/m²/day
    windSpeed: number; // m/s average
    soilStability: 'excellent' | 'good' | 'fair' | 'poor';
    floodRisk: 'none' | 'low' | 'moderate' | 'high';
  };
  timeline: {
    surveyCompleted: boolean;
    designPhase: 'not_started' | 'in_progress' | 'completed';
    approvalPhase: 'not_started' | 'in_progress' | 'completed';
    constructionPhase: 'not_started' | 'in_progress' | 'completed';
    commissioningPhase: 'not_started' | 'in_progress' | 'completed';
  };
}

=======
 * Urgam Valley Pilot Operations Service
 *
 * Manages remote solar deployment operations in Urgam Valley,
 * including field team coordination, mobile data collection,
 * and pilot readiness assessment.
 */

>>>>>>> audit-clean
export interface FieldTeam {
  teamId: string;
  leadEngineer: string;
  members: string[];
  specialization: string[];
<<<<<<< HEAD
  currentLocation?: UrgamValleyLocation;
  equipment: string[];
  status: 'available' | 'deployed' | 'returning' | 'maintenance';
  deploymentHistory: {
    siteId: string;
    deployDate: Date;
    returnDate?: Date;
    objectives: string[];
    outcomes: string[];
  }[];
}

export interface QRCodeData {
  siteId: string;
  surveyorId: string;
  timestamp: Date;
  gpsCoordinates: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  measurements: {
    area: number;
    solarReadings: number[];
    windMeasurements: number[];
    soilSamples: string[];
  };
  photos: string[]; // base64 encoded images for offline storage
  notes: string;
  verified: boolean;
}

export interface PilotReadinessReport {
  overallReadiness: number; // 0-100 percentage
  sitesAssessed: number;
  sitesReady: number;
  totalCapacity: number; // MW
  estimatedCost: number; // in lakhs
  criticalPath: string[];
  risks: {
    level: 'low' | 'medium' | 'high' | 'critical';
    category: 'technical' | 'regulatory' | 'financial' | 'environmental' | 'social';
    description: string;
    mitigation: string;
  }[];
  recommendations: string[];
  nextSteps: {
=======
  currentLocation?: {
    id: string;
    name: string;
    coordinates: { latitude: number; longitude: number };
    distanceFromBase: number;
    altitude: number;
    accessibility: string;
  };
  equipment: string[];
  status: 'available' | 'deployed' | 'maintenance';
  deploymentHistory: Array<{
    siteId: string;
    deployDate: Date;
    returnDate: Date;
    objectives: string[];
    outcomes: string[];
  }>;
}

export interface PilotReadinessReport {
  overallReadiness: number;
  sitesAssessed: number;
  sitesReady: number;
  totalCapacity: number;
  estimatedCost: number;
  risks: Array<{
    category: string;
    level: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    mitigation: string;
  }>;
  nextSteps: Array<{
>>>>>>> audit-clean
    action: string;
    responsible: string;
    deadline: Date;
    dependencies: string[];
<<<<<<< HEAD
  }[];
}

export class UrgamValleyPilotService {
  private static readonly BASE_COORDINATES = {
    latitude: 30.7333, // Uttarakhand approximate center
    longitude: 79.0667,
  };

  private static readonly SAMPLE_SITES: PilotSite[] = [
    {
      siteId: 'UV-001',
      location: {
        id: 'loc-001',
        name: 'Urgam Village Center',
        coordinates: { latitude: 30.8123, longitude: 79.1456 },
        distanceFromBase: 668,
        altitude: 2100,
        accessibility: 'road',
      },
      landArea: 25.5,
      suitabilityScore: 92,
      estimatedCapacity: 5.2,
      infrastructure: {
        roadAccess: true,
        powerGrid: false,
        communication: true,
        waterAccess: true,
      },
      regulatory: {
        forestClearance: 'obtained',
        environmentalImpact: 'minimal',
        tribalConsent: 'obtained',
        statePermission: 'approved',
      },
      communityEngagement: {
        villageConsent: true,
        beneficiaryCount: 127,
        leadContact: 'Harish Chandra Bhatt',
        contactNumber: '+91-9876543210',
      },
      technicalAssessment: {
        solarIrradiation: 5.8,
        windSpeed: 3.2,
        soilStability: 'excellent',
        floodRisk: 'none',
      },
      timeline: {
        surveyCompleted: true,
        designPhase: 'completed',
        approvalPhase: 'completed',
        constructionPhase: 'not_started',
        commissioningPhase: 'not_started',
      },
    },
    {
      siteId: 'UV-002',
      location: {
        id: 'loc-002',
        name: 'Urgam Valley Upper Slopes',
        coordinates: { latitude: 30.8245, longitude: 79.1578 },
        distanceFromBase: 672,
        altitude: 2350,
        accessibility: 'track',
      },
      landArea: 42.3,
      suitabilityScore: 87,
      estimatedCapacity: 8.9,
      infrastructure: {
        roadAccess: false,
        powerGrid: false,
        communication: false,
        waterAccess: false,
      },
      regulatory: {
        forestClearance: 'required',
        environmentalImpact: 'moderate',
        tribalConsent: 'not_required',
        statePermission: 'pending',
      },
      communityEngagement: {
        villageConsent: false,
        beneficiaryCount: 89,
        leadContact: 'Devi Singh Rawat',
        contactNumber: '+91-9876543211',
      },
      technicalAssessment: {
        solarIrradiation: 6.1,
        windSpeed: 4.7,
        soilStability: 'good',
        floodRisk: 'low',
      },
      timeline: {
        surveyCompleted: true,
        designPhase: 'in_progress',
        approvalPhase: 'not_started',
        constructionPhase: 'not_started',
        commissioningPhase: 'not_started',
      },
=======
  }>;
  criticalPath: string[];
}

class UrgamValleyPilotService {
  private static readonly PILOT_SITES = [
    {
      id: 'UV-001',
      name: 'Urgam Village Center',
      capacity: 5.2,
      altitude: 2100,
      distance: 668,
      readiness: 95,
    },
    {
      id: 'UV-002',
      name: 'Valley Upper Slopes',
      capacity: 8.9,
      altitude: 2350,
      distance: 672,
      readiness: 87,
>>>>>>> audit-clean
    },
  ];

  static async generatePilotReadinessReport(): Promise<PilotReadinessReport> {
<<<<<<< HEAD
    const sites = this.SAMPLE_SITES;
    const readySites = sites.filter(
      (site) =>
        site.timeline.designPhase === 'completed' &&
        site.timeline.approvalPhase === 'completed' &&
        site.regulatory.statePermission === 'approved'
    );

    const totalCapacity = sites.reduce((sum, site) => sum + site.estimatedCapacity, 0);
    const readyCapacity = readySites.reduce((sum, site) => sum + site.estimatedCapacity, 0);

    const overallReadiness = Math.round((readyCapacity / totalCapacity) * 100);

    return {
      overallReadiness,
      sitesAssessed: sites.length,
      sitesReady: readySites.length,
      totalCapacity,
      estimatedCost: totalCapacity * 4.5, // ₹4.5 crore per MW
      criticalPath: [
        'Forest clearance for UV-002',
        'Community engagement for upper slopes',
        'Grid connection planning',
        'Construction access road development',
      ],
      risks: [
        {
          level: 'medium',
          category: 'regulatory',
          description: 'Forest clearance pending for UV-002 site',
          mitigation: 'Parallel processing with forest department, alternative site identification',
        },
        {
          level: 'high',
          category: 'environmental',
          description: 'Monsoon accessibility to upper slopes',
          mitigation: 'Pre-monsoon material positioning, weather contingency planning',
        },
        {
          level: 'medium',
          category: 'social',
          description: 'Community consent for UV-002',
          mitigation: 'Enhanced community engagement program, benefit sharing clarity',
        },
      ],
      recommendations: [
        'Expedite forest clearance process for UV-002',
        'Establish local material storage facility',
        'Deploy field team for extended community engagement',
        'Develop micro-grid connection strategy',
        'Create weather-resilient construction timeline',
      ],
      nextSteps: [
        {
          action: 'Complete forest clearance application for UV-002',
          responsible: 'Regulatory Team',
          deadline: new Date('2024-02-15'),
          dependencies: ['Environmental impact assessment', 'Tribal consultation'],
        },
        {
          action: 'Deploy field team to UV-002 for community engagement',
          responsible: 'Community Relations Team',
          deadline: new Date('2024-02-01'),
          dependencies: ['Weather clearance', 'Local guide arrangement'],
        },
        {
          action: 'Finalize micro-grid connection design',
          responsible: 'Technical Team',
          deadline: new Date('2024-02-28'),
          dependencies: ['State electricity board approval', 'Load assessment'],
        },
      ],
    };
  }

  static async deployFieldTeam(
    teamId: string,
    siteId: string
  ): Promise<{ success: boolean; deploymentId: string; estimatedDuration: number }> {
    // Simulate field team deployment to Urgam Valley
    const site = this.SAMPLE_SITES.find((s) => s.siteId === siteId);
    if (!site) {
      throw new Error(`Site ${siteId} not found`);
    }

    const travelTime = Math.round(site.location.distanceFromBase / 50); // hours at 50km/h average
    const surveyDuration = site.landArea * 0.5; // 0.5 days per acre
    const totalDuration = travelTime + surveyDuration * 24; // in hours

    return {
      success: true,
      deploymentId: `DEP-${Date.now()}`,
      estimatedDuration: totalDuration,
    };
  }

  static async generateQRCode(siteId: string, surveyorId: string): Promise<string> {
    // Generate QR code data for field surveys
    const qrData: QRCodeData = {
      siteId,
      surveyorId,
      timestamp: new Date(),
      gpsCoordinates: {
        latitude: 0, // To be filled by field app
        longitude: 0,
        accuracy: 0,
      },
      measurements: {
        area: 0,
        solarReadings: [],
        windMeasurements: [],
        soilSamples: [],
      },
      photos: [],
      notes: '',
      verified: false,
    };

    // In real implementation, this would generate actual QR code
    return `QR_UV_${siteId}_${surveyorId}_${Date.now()}`;
  }

  static async processMobileFieldData(
    qrCode: string,
    fieldData: Partial<QRCodeData>
  ): Promise<{ success: boolean; validationErrors: string[] }> {
    const errors: string[] = [];

    // Validate GPS coordinates
    if (!fieldData.gpsCoordinates || fieldData.gpsCoordinates.accuracy > 10) {
      errors.push('GPS accuracy insufficient (>10m)');
    }

    // Validate measurements
    if (!fieldData.measurements?.area || fieldData.measurements.area <= 0) {
      errors.push('Land area measurement required');
    }

    if (!fieldData.measurements?.solarReadings || fieldData.measurements.solarReadings.length < 5) {
      errors.push('Minimum 5 solar irradiation readings required');
    }

    // Validate photos
    if (!fieldData.photos || fieldData.photos.length < 3) {
      errors.push('Minimum 3 site photos required');
    }

    return {
      success: errors.length === 0,
      validationErrors: errors,
    };
  }

  static async bulkSiteAssessment(siteIds: string[]): Promise<{
    assessed: number;
    ready: number;
    totalCapacity: number;
    criticalIssues: string[];
  }> {
    const sites = this.SAMPLE_SITES.filter((site) => siteIds.includes(site.siteId));

    const readySites = sites.filter(
      (site) =>
        site.timeline.surveyCompleted &&
        site.regulatory.statePermission === 'approved' &&
        site.communityEngagement.villageConsent
    );

    const criticalIssues = sites.flatMap((site) => {
      const issues: string[] = [];
      if (!site.infrastructure.roadAccess) issues.push(`${site.siteId}: No road access`);
      if (site.regulatory.forestClearance === 'required')
        issues.push(`${site.siteId}: Forest clearance pending`);
      if (!site.communityEngagement.villageConsent)
        issues.push(`${site.siteId}: Community consent pending`);
      return issues;
    });

    return {
      assessed: sites.length,
      ready: readySites.length,
      totalCapacity: sites.reduce((sum, site) => sum + site.estimatedCapacity, 0),
      criticalIssues: criticalIssues.slice(0, 5), // Top 5 critical issues
    };
  }

  static async generateMobileSyncReport(): Promise<{
    lastSync: Date;
    pendingUploads: number;
    offlineData: number;
    connectivityStatus: 'online' | 'limited' | 'offline';
  }> {
    // Simulate mobile field app sync status
    return {
      lastSync: new Date(),
      pendingUploads: 3,
      offlineData: 7,
      connectivityStatus: 'limited', // Typical for remote Urgam Valley locations
    };
  }

  static getDistanceFromBase(coordinates: { latitude: number; longitude: number }): number {
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((coordinates.latitude - this.BASE_COORDINATES.latitude) * Math.PI) / 180;
    const dLon = ((coordinates.longitude - this.BASE_COORDINATES.longitude) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((this.BASE_COORDINATES.latitude * Math.PI) / 180) *
        Math.cos((coordinates.latitude * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
=======
    return {
      overallReadiness: 91,
      sitesAssessed: 2,
      sitesReady: 1,
      totalCapacity: 14.1,
      estimatedCost: 85.2,
      risks: [
        {
          category: 'Logistics',
          level: 'medium',
          description: 'Remote location requires specialized transport coordination',
          mitigation: 'Pre-position equipment and establish supply chain',
        },
        {
          category: 'Weather',
          level: 'high',
          description: 'Heavy monsoon season impacts construction timeline',
          mitigation: 'Schedule construction during optimal weather windows',
        },
        {
          category: 'Connectivity',
          level: 'medium',
          description: 'Limited mobile network coverage in valley',
          mitigation: 'Implement satellite communication backup',
        },
      ],
      nextSteps: [
        {
          action: 'Complete forest clearance for UV-002',
          responsible: 'Regulatory Team',
          deadline: new Date('2024-02-15'),
          dependencies: ['State forest department approval'],
        },
        {
          action: 'Deploy field team for detailed assessment',
          responsible: 'Operations Team',
          deadline: new Date('2024-02-01'),
          dependencies: ['Equipment readiness', 'Weather conditions'],
        },
        {
          action: 'Establish base camp facilities',
          responsible: 'Logistics Team',
          deadline: new Date('2024-01-30'),
          dependencies: ['Site access approval'],
        },
      ],
      criticalPath: [
        'Forest clearance approval',
        'Detailed site survey completion',
        'Community consent finalization',
        'Equipment transport coordination',
        'Construction crew mobilization',
        'Weather window alignment',
      ],
    };
  }

  static async generateMobileSyncReport() {
    return {
      connectivityStatus: 'Limited',
      pendingUploads: 23,
      offlineData: 156,
      lastSync: new Date('2024-01-20T10:30:00Z'),
    };
  }

  static async deployFieldTeam(teamId: string, siteId: string) {
    return {
      deploymentId: `DEP-${Date.now()}`,
      teamId,
      siteId,
      deployTime: new Date(),
      estimatedDuration: 72, // hours
      objectives: ['Site assessment', 'Equipment installation', 'Data collection'],
    };
  }

  static async generateQRCode(siteId: string, surveyId: string) {
    return `QR-${siteId}-${surveyId}-${Date.now()}`;
>>>>>>> audit-clean
  }
}

export default UrgamValleyPilotService;
