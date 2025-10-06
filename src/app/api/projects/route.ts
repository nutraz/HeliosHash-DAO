import { NextResponse } from 'next/server';

interface SolarProject {
  id: string;
  name: string;
  description: string;
  location: {
    state: string;
    city: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  capacity: number; // in MW
  status: 'proposed' | 'approved' | 'under_construction' | 'operational' | 'completed';
  startDate?: string;
  expectedCompletion?: string;
  actualCompletion?: string;
  budget: {
    total: number; // in INR
    spent: number;
    remaining: number;
  };
  energyGenerated?: number; // in MWh
  co2Reduced?: number; // in tons
  stakeholders: {
    applicants: string[];
    governmentAgencies: string[];
    investors: string[];
  };
  approvals: {
    geda: boolean;
    collector: boolean;
    gpcb: boolean;
    other: string[];
  };
  images: string[];
  documents: {
    landRecords: string[];
    environmentalClearance: string[];
    permits: string[];
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Retrieve a list of simulated solar projects.
 *
 * @returns A JSON HTTP response with `{ success: true, data: SolarProject[], count: number, message: string }` on success; on failure returns `{ success: false, error: string, message: string }` with HTTP status 500.
 */
export async function GET() {
  try {
    // Simulate solar projects data
    const projects: SolarProject[] = [
      {
        id: '1',
        name: 'Gujarat Solar Farm Phase 1',
        description: 'Large-scale solar power plant in Gujarat with advanced tracking systems',
        location: {
          state: 'Gujarat',
          city: 'Ahmedabad',
          coordinates: { lat: 23.0225, lng: 72.5714 },
        },
        capacity: 50,
        status: 'operational',
        startDate: '2023-01-15',
        expectedCompletion: '2023-12-31',
        actualCompletion: '2023-11-30',
        budget: {
          total: 250000000,
          spent: 235000000,
          remaining: 15000000,
        },
        energyGenerated: 125000,
        co2Reduced: 87500,
        stakeholders: {
          applicants: ['SolarTech India Pvt Ltd'],
          governmentAgencies: ['GEDA', 'Collector Office'],
          investors: ['Green Energy Fund', 'ICICI Bank'],
        },
        approvals: {
          geda: true,
          collector: true,
          gpcb: true,
          other: ['Forest Department'],
        },
        images: ['/project1-1.jpg', '/project1-2.jpg'],
        documents: {
          landRecords: ['/land-record-1.pdf'],
          environmentalClearance: ['/env-clearance-1.pdf'],
          permits: ['/permit-1.pdf', '/permit-2.pdf'],
        },
        createdAt: '2022-11-01T00:00:00Z',
        updatedAt: '2023-11-30T00:00:00Z',
      },
      {
        id: '2',
        name: 'Rajasthan Desert Solar Project',
        description: 'Utility-scale solar installation in the Thar desert region',
        location: {
          state: 'Rajasthan',
          city: 'Jodhpur',
          coordinates: { lat: 26.2389, lng: 73.0243 },
        },
        capacity: 100,
        status: 'under_construction',
        startDate: '2023-06-01',
        expectedCompletion: '2024-12-31',
        budget: {
          total: 500000000,
          spent: 180000000,
          remaining: 320000000,
        },
        stakeholders: {
          applicants: ['Desert Solar Solutions'],
          governmentAgencies: ['RRECL', 'District Collector'],
          investors: ['World Bank', 'ADIA'],
        },
        approvals: {
          geda: true,
          collector: true,
          gpcb: false,
          other: ['Desert Development Authority'],
        },
        images: ['/project2-1.jpg'],
        documents: {
          landRecords: ['/land-record-2.pdf'],
          environmentalClearance: ['/env-clearance-2.pdf'],
          permits: ['/permit-3.pdf'],
        },
        createdAt: '2023-03-15T00:00:00Z',
        updatedAt: '2023-11-15T00:00:00Z',
      },
      {
        id: '3',
        name: 'Tamil Nadu Coastal Solar Park',
        description: 'Coastal solar power project with wind-solar hybrid capabilities',
        location: {
          state: 'Tamil Nadu',
          city: 'Chennai',
          coordinates: { lat: 13.0827, lng: 80.2707 },
        },
        capacity: 75,
        status: 'approved',
        startDate: '2024-01-01',
        expectedCompletion: '2025-06-30',
        budget: {
          total: 375000000,
          spent: 25000000,
          remaining: 350000000,
        },
        stakeholders: {
          applicants: ['Coastal Energy Corp'],
          governmentAgencies: ['TEDA', 'Port Authority'],
          investors: ['Norfund', 'SBI'],
        },
        approvals: {
          geda: true,
          collector: false,
          gpcb: true,
          other: ['Coastal Regulatory Authority'],
        },
        images: ['/project3-1.jpg', '/project3-2.jpg'],
        documents: {
          landRecords: ['/land-record-3.pdf'],
          environmentalClearance: ['/env-clearance-3.pdf'],
          permits: ['/permit-4.pdf'],
        },
        createdAt: '2023-08-01T00:00:00Z',
        updatedAt: '2023-11-01T00:00:00Z',
      },
    ];

    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length,
      message: 'Solar projects retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle POST requests to create a new solar project proposal.
 *
 * Validates required fields from the request body, simulates creating a project record,
 * and returns a JSON response describing the result.
 *
 * @returns A JSON response object with the shape { success, data?, error?, message }.
 * - On success: `success` is `true` and `data` contains the created project object.
 * - On validation failure: `success` is `false`, `error` and `message` describe missing fields, and the response status is 400.
 * - On internal error: `success` is `false`, `error` and `message` describe the failure, and the response status is 500.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, location, capacity, budget, applicantId, documents } = body;

    // Validate required fields
    if (!name || !description || !location || !capacity || !budget || !applicantId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Please provide all required project information',
        },
        { status: 400 }
      );
    }

    // Simulate project creation
    const newProject: Partial<SolarProject> = {
      id: `project_${Date.now()}`,
      name,
      description,
      location,
      capacity,
      status: 'proposed',
      budget,
      stakeholders: {
        applicants: [applicantId],
        governmentAgencies: [],
        investors: [],
      },
      approvals: {
        geda: false,
        collector: false,
        gpcb: false,
        other: [],
      },
      documents: documents || {
        landRecords: [],
        environmentalClearance: [],
        permits: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newProject,
      message: 'Project proposal submitted successfully',
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create project',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}