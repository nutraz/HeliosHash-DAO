import { NextRequest, NextResponse } from 'next/server';

// Land Records & Project Application Types
export interface LandRecord {
  id: string;
  surveyNumber: string;
  village: string;
  district: string;
  state: string;
  area: number; // in acres
  ownerName: string;
  ownershipType: 'Individual' | 'Community' | 'Government' | 'Leased';
  landUse: 'Agricultural' | 'Residential' | 'Commercial' | 'Industrial' | 'Vacant';
  coordinates: {
    latitude: number;
    longitude: number;
  };
  soilType: string;
  waterAccess: boolean;
  roadAccess: boolean;
  gridConnection: boolean;
  registrationDate: number;
  documents: string[]; // Document URLs
  verified: boolean;
}

export interface ProjectApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantType: 'Individual' | 'Community' | 'Organization' | 'Government';
  projectType: 'Solar Farm' | 'Rooftop Solar' | 'Microgrid' | 'Storage System';
  landRecordId: string;
  projectName: string;
  description: string;
  capacity: number; // in kW
  estimatedCost: number; // in INR
  estimatedDuration: number; // in months
  expectedGeneration: number; // kWh per year
  beneficiaries: number; // number of households
  applicationDate: number;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'On Hold';
  currentStage: string;
  documents: {
    landDocuments: string[];
    technicalSpecs: string[];
    financialDocs: string[];
    environmentalClearance?: string[];
  };
  governmentApprovals: GovernmentApproval[];
  timeline: ProjectTimeline[];
  budget: ProjectBudget;
  stakeholders: Stakeholder[];
}

export interface GovernmentApproval {
  id: string;
  department: string;
  approvalType: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Conditional';
  submittedDate: number;
  approvedDate?: number;
  validUntil?: number;
  conditions?: string[];
  documents: string[];
  officerName?: string;
  remarks?: string;
}

export interface ProjectTimeline {
  id: string;
  stage: string;
  description: string;
  startDate?: number;
  endDate?: number;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  dependencies: string[];
  responsible: string;
}

export interface ProjectBudget {
  totalCost: number;
  breakdown: {
    equipment: number;
    installation: number;
    landPreparation: number;
    permits: number;
    miscellaneous: number;
  };
  fundingSources: {
    daoFunding: number;
    governmentGrants: number;
    privateFunding: number;
    communityContribution: number;
  };
  disbursement: {
    stage: string;
    amount: number;
    status: 'Pending' | 'Released' | 'Completed';
  }[];
}

export interface Stakeholder {
  id: string;
  name: string;
  role: 'Investor' | 'Technical Partner' | 'Community Representative' | 'Government Official';
  contribution: string;
  contactInfo: {
    email?: string;
    phone?: string;
  };
  joinedDate: number;
}

// Mock data
const mockApplications: ProjectApplication[] = [
  {
    id: 'APP001',
    applicantId: 'user_123',
    applicantName: 'Rajesh Kumar',
    applicantType: 'Individual',
    projectType: 'Rooftop Solar',
    landRecordId: 'LAND001',
    projectName: 'Residential Solar Installation - Ward 3',
    description:
      '5kW rooftop solar installation for residential cluster covering 15 households in Ward 3, Urgam Valley',
    capacity: 5,
    estimatedCost: 350000,
    estimatedDuration: 2,
    expectedGeneration: 7500,
    beneficiaries: 15,
    applicationDate: Date.now() - 86400000 * 15,
    status: 'Under Review',
    currentStage: 'Technical Evaluation',
    documents: {
      landDocuments: ['ownership_cert.pdf', 'survey_map.pdf'],
      technicalSpecs: ['solar_design.pdf', 'load_calculation.pdf'],
      financialDocs: ['cost_estimate.pdf', 'funding_plan.pdf'],
    },
    governmentApprovals: [
      {
        id: 'GOV001',
        department: 'Rural Development',
        approvalType: 'Installation Permit',
        status: 'Approved',
        submittedDate: Date.now() - 86400000 * 10,
        approvedDate: Date.now() - 86400000 * 5,
        validUntil: Date.now() + 86400000 * 365,
        documents: ['permit_letter.pdf'],
        officerName: 'Suresh Patel',
        remarks: 'Approved with standard safety conditions',
      },
    ],
    timeline: [
      {
        id: 'T1',
        stage: 'Application Submission',
        description: 'Submit complete application with documents',
        startDate: Date.now() - 86400000 * 15,
        endDate: Date.now() - 86400000 * 15,
        status: 'Completed',
        dependencies: [],
        responsible: 'Applicant',
      },
      {
        id: 'T2',
        stage: 'Technical Review',
        description: 'Technical evaluation by DAO engineering team',
        startDate: Date.now() - 86400000 * 12,
        status: 'In Progress',
        dependencies: ['T1'],
        responsible: 'DAO Technical Committee',
      },
    ],
    budget: {
      totalCost: 350000,
      breakdown: {
        equipment: 250000,
        installation: 50000,
        landPreparation: 20000,
        permits: 15000,
        miscellaneous: 15000,
      },
      fundingSources: {
        daoFunding: 200000,
        governmentGrants: 100000,
        privateFunding: 0,
        communityContribution: 50000,
      },
      disbursement: [
        {
          stage: 'Equipment Purchase',
          amount: 250000,
          status: 'Pending',
        },
        {
          stage: 'Installation',
          amount: 100000,
          status: 'Pending',
        },
      ],
    },
    stakeholders: [
      {
        id: 'STK001',
        name: 'HeliosHash DAO',
        role: 'Investor',
        contribution: 'Primary funding and technical support',
        contactInfo: { email: 'support@helioshash.dao' },
        joinedDate: Date.now() - 86400000 * 15,
      },
    ],
  },
];

const mockLandRecords: LandRecord[] = [
  {
    id: 'LAND001',
    surveyNumber: '123/4A',
    village: 'Urgam',
    district: 'Kachchh',
    state: 'Gujarat',
    area: 2.5,
    ownerName: 'Rajesh Kumar',
    ownershipType: 'Individual',
    landUse: 'Residential',
    coordinates: {
      latitude: 23.2599,
      longitude: 69.6667,
    },
    soilType: 'Sandy',
    waterAccess: true,
    roadAccess: true,
    gridConnection: true,
    registrationDate: Date.now() - 86400000 * 365,
    documents: ['title_deed.pdf', 'survey_map.pdf', 'mutation_cert.pdf'],
    verified: true,
  },
];

// GET - Fetch applications based on user role and access level
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userRole = searchParams.get('userRole'); // 'applicant', 'government', 'investor', 'admin'
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const projectType = searchParams.get('projectType');

    let filteredApplications = mockApplications;

    // Role-based filtering
    if (userRole === 'applicant' && userId) {
      filteredApplications = filteredApplications.filter((app) => app.applicantId === userId);
    } else if (userRole === 'government') {
      // Government sees all applications requiring approvals
      filteredApplications = filteredApplications.filter(
        (app) => app.status === 'Submitted' || app.status === 'Under Review'
      );
    } else if (userRole === 'investor') {
      // Investors see approved projects and those seeking funding
      filteredApplications = filteredApplications.filter(
        (app) => app.status === 'Approved' || app.currentStage === 'Funding'
      );
    }

    // Additional filters
    if (status) {
      filteredApplications = filteredApplications.filter((app) => app.status === status);
    }

    if (projectType) {
      filteredApplications = filteredApplications.filter((app) => app.projectType === projectType);
    }

    // Calculate statistics
    const stats = {
      totalApplications: filteredApplications.length,
      byStatus: {
        draft: filteredApplications.filter((app) => app.status === 'Draft').length,
        submitted: filteredApplications.filter((app) => app.status === 'Submitted').length,
        underReview: filteredApplications.filter((app) => app.status === 'Under Review').length,
        approved: filteredApplications.filter((app) => app.status === 'Approved').length,
        rejected: filteredApplications.filter((app) => app.status === 'Rejected').length,
      },
      byProjectType: {
        solarFarm: filteredApplications.filter((app) => app.projectType === 'Solar Farm').length,
        rooftopSolar: filteredApplications.filter((app) => app.projectType === 'Rooftop Solar')
          .length,
        microgrid: filteredApplications.filter((app) => app.projectType === 'Microgrid').length,
        storageSystem: filteredApplications.filter((app) => app.projectType === 'Storage System')
          .length,
      },
      totalCapacity: filteredApplications.reduce((sum, app) => sum + app.capacity, 0),
      totalInvestment: filteredApplications.reduce((sum, app) => sum + app.estimatedCost, 0),
    };

    return NextResponse.json({
      success: true,
      data: {
        applications: filteredApplications,
        landRecords: userRole === 'applicant' ? mockLandRecords : [],
        stats,
      },
    });
  } catch (error) {
    console.error('Project applications fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch project applications',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST - Create new application or update existing one
export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();

    if (
      !applicationData.projectName ||
      !applicationData.projectType ||
      !applicationData.landRecordId
    ) {
      return NextResponse.json(
        { success: false, error: 'Project name, type, and land record ID are required' },
        { status: 400 }
      );
    }

    // Create new application
    const newApplication: ProjectApplication = {
      id: `APP${String(Date.now()).slice(-6)}`,
      ...applicationData,
      applicationDate: Date.now(),
      status: 'Draft',
      currentStage: 'Application Preparation',
      governmentApprovals: [],
      timeline: [
        {
          id: 'T1',
          stage: 'Application Preparation',
          description: 'Prepare and submit complete application',
          startDate: Date.now(),
          status: 'In Progress',
          dependencies: [],
          responsible: 'Applicant',
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: newApplication,
      message: 'Project application created successfully',
    });
  } catch (error) {
    console.error('Project application creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create project application',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
