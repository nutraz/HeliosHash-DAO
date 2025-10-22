/**
 * Urgam Valley Pilot Operations Service
 *
 * Manages remote solar deployment operations in Urgam Valley, Uttarakhand.
 * Includes field team coordination, mobile data collection, site assessment,
 * and pilot readiness reporting for the 668km remote valley deployment.
 */

export interface UrgamValleyLocation {
  id: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distanceFromBase: number; // kilometers from base (Mumbai: 668km)
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

export interface FieldTeam {
  teamId: string;
  leadEngineer: string;
  members: string[];
  specialization: string[];
  currentLocation?: UrgamValleyLocation;
  equipment: string[];
  status: 'available' | 'deployed' | 'returning' | 'maintenance';
  deploymentHistory: Array<{
    siteId: string;
    deployDate: Date;
    returnDate?: Date;
    objectives: string[];
    outcomes: string[];
  }>;
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
  estimatedCost: number; // in lakhs (₹)
  criticalPath: string[];
  risks: Array<{
    level: 'low' | 'medium' | 'high' | 'critical';
    category: 'technical' | 'regulatory' | 'financial' | 'environmental' | 'social' | 'logistics' | 'weather' | 'connectivity';
    description: string;
    mitigation: string;
  }>;
  recommendations?: string[];
  nextSteps: Array<{
    action: string;
    responsible: string;
    deadline: Date;
    dependencies: string[];
  }>;
}

export interface MobileSyncReport {
  lastSync: Date;
  pendingUploads: number;
  offlineData: number;
  connectivityStatus: 'online' | 'limited' | 'offline';
}

export interface FieldDeployment {
  success: boolean;
  deploymentId: string;
  estimatedDuration: number; // hours
  teamId?: string;
  siteId?: string;
  deployTime?: Date;
  objectives?: string[];
}

class UrgamValleyPilotService {
  private static readonly BASE_COORDINATES = {
    latitude: 30.7333, // Uttarakhand approximate center
    longitude: 79.0667,
  };

  private static readonly PILOT_SITES: PilotSite[] = [
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
      suitabilityScore: 95,
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
        name: 'Valley Upper Slopes',
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
    },
  ];

  /**
   * Generate comprehensive pilot readiness report for Urgam Valley deployment
   */
  static async generatePilotReadinessReport(): Promise<PilotReadinessReport> {
    const sites = this.PILOT_SITES;
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
      estimatedCost: totalCapacity * 4.5 * 100, // ₹4.5 crore per MW = 450 lakhs per MW
      criticalPath: [
        'Forest clearance for UV-002',
        'Community consent finalization',
        'Detailed site survey completion',
        'Equipment transport coordination',
        'Construction crew mobilization',
        'Weather window alignment',
      ],
      risks: [
        {
          level: 'medium',
          category: 'regulatory',
          description: 'Forest clearance pending for UV-002 site (42.3 acres)',
          mitigation:
            'Parallel processing with forest department, alternative site identification if delayed',
        },
        {
          level: 'high',
          category: 'weather',
          description: 'Heavy monsoon season impacts construction timeline and site accessibility',
          mitigation:
            'Pre-monsoon material positioning, weather contingency planning, backup construction windows',
        },
        {
          level: 'medium',
          category: 'social',
          description: 'Community consent pending for UV-002 (89 potential beneficiaries)',
          mitigation:
            'Enhanced community engagement program, benefit sharing clarity, local employment commitments',
        },
        {
          level: 'medium',
          category: 'logistics',
          description: 'Remote location requires specialized transport coordination (668km from base)',
          mitigation: 'Pre-position equipment and establish local supply chain, arrange helicopter backup',
        },
        {
          level: 'high',
          category: 'connectivity',
          description: 'Limited mobile network coverage in valley affects field operations',
          mitigation: 'Implement satellite communication backup, offline data collection protocols',
        },
      ],
      recommendations: [
        'Expedite forest clearance process for UV-002 through state forest department',
        'Establish local material storage facility in Urgam Village Center',
        'Deploy field team for extended community engagement at upper slopes',
        'Develop micro-grid connection strategy for off-grid sites',
        'Create weather-resilient construction timeline with monsoon buffer',
        'Set up satellite communication infrastructure for field teams',
      ],
      nextSteps: [
        {
          action: 'Complete forest clearance application for UV-002',
          responsible: 'Regulatory Team',
          deadline: new Date('2024-02-15'),
          dependencies: ['Environmental impact assessment', 'State forest department approval'],
        },
        {
          action: 'Deploy field team for detailed assessment and community engagement',
          responsible: 'Operations Team',
          deadline: new Date('2024-02-01'),
          dependencies: ['Equipment readiness', 'Weather conditions', 'Local guide arrangement'],
        },
        {
          action: 'Establish base camp facilities at Urgam Village Center',
          responsible: 'Logistics Team',
          deadline: new Date('2024-01-30'),
          dependencies: ['Site access approval', 'Equipment transport'],
        },
        {
          action: 'Finalize micro-grid connection design for both sites',
          responsible: 'Technical Team',
          deadline: new Date('2024-02-28'),
          dependencies: ['State electricity board approval', 'Load assessment'],
        },
      ],
    };
  }

  /**
   * Deploy field team to specific pilot site
   */
  static async deployFieldTeam(teamId: string, siteId: string): Promise<FieldDeployment> {
    const site = this.PILOT_SITES.find((s) => s.siteId === siteId);
    if (!site) {
      throw new Error(`Site ${siteId} not found in Urgam Valley pilot sites`);
    }

    // Calculate travel time and survey duration
    const travelTime = Math.round(site.location.distanceFromBase / 50); // hours at 50km/h average
    const surveyDuration = site.landArea * 0.5; // 0.5 days per acre
    const totalDuration = travelTime + surveyDuration * 24; // in hours

    return {
      success: true,
      deploymentId: `DEP-UV-${Date.now()}`,
      estimatedDuration: totalDuration,
      teamId,
      siteId,
      deployTime: new Date(),
      objectives: ['Site assessment', 'Equipment installation', 'Community engagement', 'Data collection'],
    };
  }

  /**
   * Generate QR code for field survey data collection
   */
  static async generateQRCode(siteId: string, surveyorId: string): Promise<string> {
    const qrData: Partial<QRCodeData> = {
      siteId,
      surveyorId,
      timestamp: new Date(),
      verified: false,
    };

    // In real implementation, this would generate actual QR code image
    return `QR-UV-${siteId}-${surveyorId}-${Date.now()}`;
  }

  /**
   * Process and validate mobile field data from QR code
   */
  static async processMobileFieldData(
    qrCode: string,
    fieldData: Partial<QRCodeData>
  ): Promise<{ success: boolean; validationErrors: string[] }> {
    const errors: string[] = [];

    // Validate GPS coordinates
    if (!fieldData.gpsCoordinates || fieldData.gpsCoordinates.accuracy > 10) {
      errors.push('GPS accuracy insufficient (>10m). Move to open area for better signal.');
    }

    // Validate measurements
    if (!fieldData.measurements?.area || fieldData.measurements.area <= 0) {
      errors.push('Land area measurement required');
    }

    if (!fieldData.measurements?.solarReadings || fieldData.measurements.solarReadings.length < 5) {
      errors.push('Minimum 5 solar irradiation readings required (at different times/locations)');
    }

    // Validate photos
    if (!fieldData.photos || fieldData.photos.length < 3) {
      errors.push('Minimum 3 site photos required (overview, terrain, access road)');
    }

    return {
      success: errors.length === 0,
      validationErrors: errors,
    };
  }

  /**
   * Bulk assessment of multiple pilot sites
   */
  static async bulkSiteAssessment(siteIds: string[]): Promise<{
    assessed: number;
    ready: number;
    totalCapacity: number;
    criticalIssues: string[];
  }> {
    const sites = this.PILOT_SITES.filter((site) => siteIds.includes(site.siteId));

    const readySites = sites.filter(
      (site) =>
        site.timeline.surveyCompleted &&
        site.regulatory.statePermission === 'approved' &&
        site.communityEngagement.villageConsent
    );

    const criticalIssues = sites.flatMap((site) => {
      const issues: string[] = [];
      if (!site.infrastructure.roadAccess) {
        issues.push(`${site.siteId}: No road access - helicopter transport may be required`);
      }
      if (site.regulatory.forestClearance === 'required') {
        issues.push(`${site.siteId}: Forest clearance pending - approx. 3-6 months timeline`);
      }
      if (!site.communityEngagement.villageConsent) {
        issues.push(`${site.siteId}: Community consent pending - ${site.communityEngagement.beneficiaryCount} beneficiaries`);
      }
      if (!site.infrastructure.powerGrid) {
        issues.push(`${site.siteId}: No grid connection - micro-grid solution required`);
      }
      return issues;
    });

    return {
      assessed: sites.length,
      ready: readySites.length,
      totalCapacity: sites.reduce((sum, site) => sum + site.estimatedCapacity, 0),
      criticalIssues: criticalIssues.slice(0, 5), // Top 5 critical issues
    };
  }

  /**
   * Generate mobile sync report for field app
   */
  static async generateMobileSyncReport(): Promise<MobileSyncReport> {
    // Simulate mobile field app sync status
    return {
      lastSync: new Date(),
      pendingUploads: 3,
      offlineData: 7,
      connectivityStatus: 'limited', // Typical for remote Urgam Valley locations
    };
  }

  /**
   * Calculate distance from base coordinates using Haversine formula
   */
  static getDistanceFromBase(coordinates: { latitude: number; longitude: number }): number {
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
  }

  /**
   * Get all pilot sites
   */
  static getPilotSites(): PilotSite[] {
    return this.PILOT_SITES;
  }

  /**
   * Get specific pilot site by ID
   */
  static getPilotSite(siteId: string): PilotSite | undefined {
    return this.PILOT_SITES.find((site) => site.siteId === siteId);
  }
}

export default UrgamValleyPilotService;
