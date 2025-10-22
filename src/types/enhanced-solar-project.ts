// === Enhanced Solar Project Management System ===
// Comprehensive project data with location, energy, community, and lifecycle management

export interface ProjectLocation {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  state: string;
  country: string;
  pincode: string;
  landmark?: string;
}

export interface LandOwner {
  id: string;
  name: string;
  contact: string;
  email?: string;
  ownership_type: 'individual' | 'community' | 'government' | 'private_company';
  land_area_acres: number;
  lease_terms?: string;
  revenue_sharing_percent?: number;
}

export interface ProjectProgress {
  stage:
    | 'planning'
    | 'approval_pending'
    | 'construction'
    | 'installation'
    | 'testing'
    | 'operational'
    | 'maintenance';
  progress_percent: number;
  start_date: Date;
  expected_completion?: Date;
  actual_completion?: Date;
  milestones: {
    name: string;
    status: 'completed' | 'in_progress' | 'pending' | 'blocked';
    date?: Date;
    description: string;
  }[];
}

export interface EnergyData {
  current_production_kw: number;
  daily_production_kwh: number;
  monthly_production_kwh: number;
  total_production_mwh: number;
  current_consumption_kw: number;
  grid_connection_status: 'connected' | 'disconnected' | 'maintenance' | 'emergency_stop';
  efficiency_percent: number;
  weather_conditions: {
    temperature_c: number;
    sunlight_intensity_percent: number;
    wind_speed_kmh: number;
    weather_description: string;
  };
  last_updated: Date;
}

export interface ProjectVacancy {
  id: string;
  title: string;
  category:
    | 'technical'
    | 'maintenance'
    | 'management'
    | 'community_liaison'
    | 'security'
    | 'training';
  description: string;
  requirements: string[];
  compensation_owp: number;
  compensation_inr?: number;
  duration_months?: number;
  positions_available: number;
  applications_count: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  posted_date: Date;
}

export interface ProjectContributor {
  user_id: string;
  name: string;
  role:
    | 'project_manager'
    | 'technical_lead'
    | 'installer'
    | 'maintainer'
    | 'community_rep'
    | 'volunteer';
  contributions: {
    type: 'funding' | 'labor' | 'materials' | 'land' | 'expertise' | 'community_support';
    description: string;
    value_owp?: number;
    hours_contributed?: number;
    date: Date;
  }[];
  reputation_score: number;
  verification_status: 'verified' | 'pending' | 'unverified';
}

export interface CommunityConnection {
  households_served: number;
  businesses_connected: number;
  community_centers: number;
  schools_powered: number;
  health_facilities: number;
  total_beneficiaries: number;
  community_feedback_score: number; // 1-5 rating
  local_employment_created: number;
  community_ownership_percent: number;
  monthly_community_meetings: boolean;
  community_representatives: string[];
}

export interface ProjectSpecials {
  innovation_features: string[];
  sustainability_certifications: string[];
  awards_received: string[];
  pilot_technologies: string[];
  research_partnerships: string[];
  educational_programs: boolean;
  tourism_integration: boolean;
  disaster_resilience_features: string[];
}

export interface SolarProject {
  // Basic Info
  id: string;
  name: string;
  description: string;
  project_type: 'residential' | 'commercial' | 'utility' | 'community' | 'micro_grid' | 'hybrid';

  // Location & Land
  location: ProjectLocation;
  land_owner: LandOwner;

  // Technical Specifications
  capacity_kw: number;
  panel_count: number;
  panel_type: string;
  inverter_type: string;
  battery_storage_kwh?: number;
  grid_tie: boolean;

  // Project Lifecycle
  progress: ProjectProgress;

  // Live Data
  energy_data: EnergyData;

  // Community & Stakeholders
  contributors: ProjectContributor[];
  community: CommunityConnection;

  // Opportunities
  vacancies: ProjectVacancy[];
  funding_needed_owp?: number;
  volunteer_opportunities: string[];

  // Special Features
  specials: ProjectSpecials;

  // Financial
  total_investment_inr: number;
  roi_percent_annual: number;
  payback_period_years: number;

  // Metadata
  created_date: Date;
  last_updated: Date;
  visibility: 'public' | 'community' | 'contributors';
  verification_status: 'verified' | 'pending' | 'unverified';
}

export interface ProjectApplication {
  id: string;
  project_id: string;
  applicant_user_id: string;
  vacancy_id?: string;
  application_type: 'job' | 'volunteer' | 'investment' | 'partnership' | 'community_membership';

  // Application Details
  cover_letter: string;
  skills: string[];
  experience_years: number;
  availability: string;
  expected_contribution: {
    type: 'time' | 'money' | 'materials' | 'expertise';
    amount?: number;
    description: string;
  };

  // Status Tracking
  status:
    | 'submitted'
    | 'under_review'
    | 'interview_scheduled'
    | 'approved'
    | 'rejected'
    | 'on_hold';
  submitted_date: Date;
  reviewed_date?: Date;
  reviewer_id?: string;
  feedback?: string;
  next_steps?: string;

  // Real-time Updates
  status_updates: {
    status: string;
    message: string;
    timestamp: Date;
    updated_by: string;
  }[];
}

// Mock data for demonstration
export const MOCK_SOLAR_PROJECTS: SolarProject[] = [
  {
    id: 'urgamu_001',
    name: 'UrgamU Valley Pioneer Solar Hub',
    description:
      'First community solar installation in UrgamU valley, powering 150 households and creating local employment',
    project_type: 'community',

    location: {
      id: 'loc_urgamu_001',
      latitude: 30.0668,
      longitude: 79.0193,
      address: 'UrgamU Valley, Near Village Center',
      district: 'Chamoli',
      state: 'Uttarakhand',
      country: 'India',
      pincode: '246401',
      landmark: 'Near Ancient Temple Complex',
    },

    land_owner: {
      id: 'owner_001',
      name: 'UrgamU Community Collective',
      contact: '+91-9876543210',
      email: 'collective@urgamu.org',
      ownership_type: 'community',
      land_area_acres: 12.5,
      revenue_sharing_percent: 70,
    },

    capacity_kw: 500,
    panel_count: 2000,
    panel_type: 'Monocrystalline Silicon 250W',
    inverter_type: 'String Inverters - 50kW x10',
    battery_storage_kwh: 2000,
    grid_tie: true,

    progress: {
      stage: 'operational',
      progress_percent: 100,
      start_date: new Date('2024-01-15'),
      actual_completion: new Date('2024-12-20'),
      milestones: [
        {
          name: 'Land Acquisition',
          status: 'completed',
          date: new Date('2024-02-01'),
          description: 'Community agreement signed',
        },
        {
          name: 'Environmental Clearance',
          status: 'completed',
          date: new Date('2024-03-15'),
          description: 'All permits approved',
        },
        {
          name: 'Installation Complete',
          status: 'completed',
          date: new Date('2024-11-30'),
          description: 'All panels and systems installed',
        },
        {
          name: 'Grid Connection',
          status: 'completed',
          date: new Date('2024-12-20'),
          description: 'Successfully connected to state grid',
        },
      ],
    },

    energy_data: {
      current_production_kw: 285.6,
      daily_production_kwh: 2100,
      monthly_production_kwh: 63000,
      total_production_mwh: 245.8,
      current_consumption_kw: 180.2,
      grid_connection_status: 'connected',
      efficiency_percent: 87.3,
      weather_conditions: {
        temperature_c: 22,
        sunlight_intensity_percent: 76,
        wind_speed_kmh: 12,
        weather_description: 'Partly cloudy with good solar exposure',
      },
      last_updated: new Date(),
    },

    contributors: [
      {
        user_id: 'user_001',
        name: 'Rajesh Sharma',
        role: 'project_manager',
        contributions: [
          {
            type: 'expertise',
            description: 'Project management and coordination',
            hours_contributed: 1200,
            date: new Date('2024-06-01'),
          },
          {
            type: 'funding',
            description: 'Initial seed investment',
            value_owp: 50000,
            date: new Date('2024-01-20'),
          },
        ],
        reputation_score: 4.8,
        verification_status: 'verified',
      },
      {
        user_id: 'user_002',
        name: 'Priya Negi',
        role: 'community_rep',
        contributions: [
          {
            type: 'community_support',
            description: 'Local liaison and community engagement',
            hours_contributed: 800,
            date: new Date('2024-03-01'),
          },
        ],
        reputation_score: 4.9,
        verification_status: 'verified',
      },
    ],

    community: {
      households_served: 150,
      businesses_connected: 25,
      community_centers: 3,
      schools_powered: 2,
      health_facilities: 1,
      total_beneficiaries: 580,
      community_feedback_score: 4.7,
      local_employment_created: 28,
      community_ownership_percent: 60,
      monthly_community_meetings: true,
      community_representatives: ['Priya Negi', 'Harish Rawat', 'Sunita Devi'],
    },

    vacancies: [
      {
        id: 'vac_001',
        title: 'Solar Panel Maintenance Technician',
        category: 'maintenance',
        description: 'Regular maintenance and cleaning of solar panels, basic troubleshooting',
        requirements: [
          'Basic electrical knowledge',
          'Physical fitness',
          'Local residence preferred',
        ],
        compensation_owp: 2000,
        compensation_inr: 15000,
        duration_months: 12,
        positions_available: 2,
        applications_count: 8,
        urgency: 'medium',
        posted_date: new Date('2025-09-15'),
      },
    ],

    funding_needed_owp: 0,
    volunteer_opportunities: [
      'Community education sessions',
      'Data collection assistance',
      'Tourism guide for project visits',
    ],

    specials: {
      innovation_features: [
        'AI-powered energy optimization',
        'Blockchain energy trading',
        'Mobile app for community monitoring',
      ],
      sustainability_certifications: ['LEED Gold Certified', 'Carbon Neutral Verified'],
      awards_received: ['Best Community Solar Project 2024', 'Uttarakhand Innovation Award'],
      pilot_technologies: ['Bifacial solar panels', 'Smart grid integration'],
      research_partnerships: ['IIT Roorkee', 'TERI (The Energy and Resources Institute)'],
      educational_programs: true,
      tourism_integration: true,
      disaster_resilience_features: ['Earthquake-resistant mounting', 'Flood protection systems'],
    },

    total_investment_inr: 35000000,
    roi_percent_annual: 12.5,
    payback_period_years: 6.8,

    created_date: new Date('2024-01-01'),
    last_updated: new Date(),
    visibility: 'public',
    verification_status: 'verified',
  },

  // Additional project for demonstration
  {
    id: 'delhi_002',
    name: 'Delhi Metro Solar Expansion',
    description: 'Large-scale rooftop solar installation across 50 Delhi Metro stations',
    project_type: 'utility',

    location: {
      id: 'loc_delhi_002',
      latitude: 28.6139,
      longitude: 77.209,
      address: 'Multiple Metro Stations',
      district: 'New Delhi',
      state: 'Delhi',
      country: 'India',
      pincode: '110001',
      landmark: 'Delhi Metro Network',
    },

    land_owner: {
      id: 'owner_002',
      name: 'Delhi Metro Rail Corporation',
      contact: '+91-11-23417910',
      email: 'solar@delhimetrorail.com',
      ownership_type: 'government',
      land_area_acres: 45.0,
      revenue_sharing_percent: 25,
    },

    capacity_kw: 2500,
    panel_count: 10000,
    panel_type: 'Polycrystalline Silicon 250W',
    inverter_type: 'Central Inverters - 500kW x5',
    battery_storage_kwh: 5000,
    grid_tie: true,

    progress: {
      stage: 'construction',
      progress_percent: 65,
      start_date: new Date('2024-08-01'),
      expected_completion: new Date('2025-12-31'),
      milestones: [
        {
          name: 'Tender Award',
          status: 'completed',
          date: new Date('2024-07-15'),
          description: 'Contract signed with implementation partner',
        },
        {
          name: 'Phase 1 Installation',
          status: 'completed',
          date: new Date('2024-11-30'),
          description: '20 stations completed',
        },
        {
          name: 'Phase 2 Installation',
          status: 'in_progress',
          description: 'Currently installing on 15 more stations',
        },
        {
          name: 'Grid Integration',
          status: 'pending',
          description: 'Final grid connection and testing',
        },
      ],
    },

    energy_data: {
      current_production_kw: 1250.5,
      daily_production_kwh: 8500,
      monthly_production_kwh: 255000,
      total_production_mwh: 512.7,
      current_consumption_kw: 950.8,
      grid_connection_status: 'connected',
      efficiency_percent: 82.1,
      weather_conditions: {
        temperature_c: 28,
        sunlight_intensity_percent: 68,
        wind_speed_kmh: 8,
        weather_description: 'Hazy due to urban pollution, moderate solar conditions',
      },
      last_updated: new Date(),
    },

    contributors: [
      {
        user_id: 'user_003',
        name: 'Ankit Gupta',
        role: 'technical_lead',
        contributions: [
          {
            type: 'expertise',
            description: 'Technical design and system integration',
            hours_contributed: 2000,
            date: new Date('2024-08-01'),
          },
        ],
        reputation_score: 4.6,
        verification_status: 'verified',
      },
    ],

    community: {
      households_served: 0,
      businesses_connected: 500,
      community_centers: 0,
      schools_powered: 0,
      health_facilities: 0,
      total_beneficiaries: 2500000, // Daily metro users
      community_feedback_score: 4.2,
      local_employment_created: 150,
      community_ownership_percent: 0,
      monthly_community_meetings: false,
      community_representatives: [],
    },

    vacancies: [
      {
        id: 'vac_002',
        title: 'Electrical Systems Engineer',
        category: 'technical',
        description: 'Design and maintain electrical systems for metro solar integration',
        requirements: [
          'Electrical Engineering degree',
          '5+ years experience',
          'Metro systems knowledge',
        ],
        compensation_owp: 8000,
        compensation_inr: 80000,
        duration_months: 18,
        positions_available: 3,
        applications_count: 45,
        urgency: 'high',
        posted_date: new Date('2025-09-10'),
      },
    ],

    funding_needed_owp: 125000,
    volunteer_opportunities: ['Public awareness campaigns', 'Student education programs'],

    specials: {
      innovation_features: [
        'Metro integration systems',
        'Real-time passenger information displays powered by solar',
      ],
      sustainability_certifications: ['Green Building Council certified'],
      awards_received: [],
      pilot_technologies: ['Transparent solar panels for station canopies'],
      research_partnerships: ['NTPC', 'IIT Delhi'],
      educational_programs: true,
      tourism_integration: false,
      disaster_resilience_features: ['Emergency power backup for safety systems'],
    },

    total_investment_inr: 180000000,
    roi_percent_annual: 8.5,
    payback_period_years: 9.2,

    created_date: new Date('2024-06-01'),
    last_updated: new Date(),
    visibility: 'public',
    verification_status: 'verified',
  },
];

export default MOCK_SOLAR_PROJECTS;
