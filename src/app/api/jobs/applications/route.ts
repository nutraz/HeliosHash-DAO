import { NextRequest, NextResponse } from 'next/server';
import { JobApplication, ApplicationListResponse } from '@/types/jobs';

// Mock database for applications
const MOCK_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-1',
    jobId: '1',
    jobTitle: 'Solar Panel Installation Technician',
    applicantId: 'user-123',
    applicantName: 'Raj Patel',
    applicantEmail: 'raj.patel@example.com',
    coverLetter:
      'I am very interested in this position as I am passionate about renewable energy and want to contribute to my community. I have basic electrical knowledge and am eager to learn more about solar technology.',
    skills: ['Electrical Work', 'Safety Protocols', 'Equipment Maintenance'],
    experience: 2,
    availability: 'Immediate',
    status: 'Submitted',
    submitted: Date.now() - 86400000, // 1 day ago
    rating: 4,
  },
  {
    id: 'app-2',
    jobId: '2',
    jobTitle: 'Blockchain Developer - Smart Contracts',
    applicantId: 'dev-789',
    applicantName: 'Priya Sharma',
    applicantEmail: 'priya.dev@example.com',
    coverLetter:
      "I have extensive experience in blockchain development, particularly with Internet Computer and Motoko. I've worked on several DeFi projects and understand the unique challenges of decentralized systems.",
    skills: ['Motoko', 'Smart Contracts', 'DeFi', 'Internet Computer', 'Rust'],
    experience: 5,
    expectedCompensation: {
      amount: 85000,
      currency: 'USD',
      paymentType: 'Monthly',
    },
    availability: 'TwoWeeks',
    status: 'UnderReview',
    submitted: Date.now() - 172800000, // 2 days ago
    rating: 5,
    portfolio: 'https://github.com/priya-dev',
    documents: [
      {
        name: 'Resume.pdf',
        url: '/documents/priya-resume.pdf',
        type: 'resume',
      },
      {
        name: 'Portfolio.pdf',
        url: '/documents/priya-portfolio.pdf',
        type: 'portfolio',
      },
    ],
  },
  {
    id: 'app-3',
    jobId: '3',
    jobTitle: 'Community Outreach Coordinator',
    applicantId: 'comm-101',
    applicantName: 'Anjali Desai',
    applicantEmail: 'anjali.community@example.com',
    coverLetter:
      'Having worked in community development for over 8 years, I understand the importance of building trust and meaningful relationships with local communities. I am fluent in Gujarati, Hindi, and English, and have experience working in rural areas of Gujarat.',
    skills: [
      'Community Engagement',
      'Stakeholder Relations',
      'Public Speaking',
      'Rural Development',
    ],
    experience: 8,
    availability: 'Immediate',
    status: 'Interviewed',
    submitted: Date.now() - 259200000, // 3 days ago
    rating: 5,
    notes: 'Excellent candidate with strong local connections and relevant experience.',
  },
];

/**
 * Fetches a filtered, sorted, and paginated list of job applications.
 *
 * Reads query parameters from the request URL to filter by `jobId`, `applicantId`, and comma-separated `status` values, sorts results by submission timestamp (newest first), and returns the requested page of results.
 *
 * @param request - Incoming request whose URL search params may include:
 *   - `page` (default: `1`) — page number (1-based)
 *   - `limit` (default: `10`) — number of items per page
 *   - `jobId` — filter applications by job identifier
 *   - `applicantId` — filter applications by applicant identifier
 *   - `status` — comma-separated list of statuses to include
 * @returns The ApplicationListResponse containing:
 *   - `applications` — the paginated applications for the requested page
 *   - `total` — total number of applications matching filters
 *   - `page` — current page number
 *   - `limit` — number of items per page
 *   - `hasMore` — `true` if additional pages are available, `false` otherwise
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const jobId = searchParams.get('jobId');
    const applicantId = searchParams.get('applicantId');
    const status = searchParams.get('status');

    let filteredApplications = [...MOCK_APPLICATIONS];

    // Apply filters
    if (jobId) {
      filteredApplications = filteredApplications.filter((app) => app.jobId === jobId);
    }

    if (applicantId) {
      filteredApplications = filteredApplications.filter((app) => app.applicantId === applicantId);
    }

    if (status) {
      const statuses = status.split(',');
      filteredApplications = filteredApplications.filter((app) => statuses.includes(app.status));
    }

    // Sort by submission date (most recent first)
    filteredApplications.sort((a, b) => b.submitted - a.submitted);

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApplications = filteredApplications.slice(startIndex, endIndex);

    const response: ApplicationListResponse = {
      applications: paginatedApplications,
      total: filteredApplications.length,
      page,
      limit,
      hasMore: endIndex < filteredApplications.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

/**
 * Create a new job application from the request body and add it to the mock database.
 *
 * Expects a JSON body containing at minimum `jobId`, `applicantId`, and `coverLetter`. Validates required fields and rejects duplicate applications for the same job and applicant.
 *
 * @param request - The incoming HTTP request whose JSON body provides the application data (must include `jobId`, `applicantId`, and `coverLetter`)
 * @returns The created `JobApplication` object
 *
 * Error responses:
 * - Returns a 400 response with an error if required fields are missing.
 * - Returns a 409 response with an error if the applicant has already applied to the same job.
 * - Returns a 500 response with an error if application creation fails.
 */
export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json();

    // Validate required fields
    if (!applicationData.jobId || !applicationData.applicantId || !applicationData.coverLetter) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already applied to this job
    const existingApplication = MOCK_APPLICATIONS.find(
      (app) =>
        app.jobId === applicationData.jobId && app.applicantId === applicationData.applicantId
    );

    if (existingApplication) {
      return NextResponse.json({ error: 'Already applied to this job' }, { status: 409 });
    }

    const newApplication: JobApplication = {
      id: `app-${Date.now()}`,
      ...applicationData,
      status: 'Submitted' as const,
      submitted: Date.now(),
    };

    // Add to mock database
    MOCK_APPLICATIONS.push(newApplication);

    // In a real app, also update the job's applicant count
    // updateJobApplicationCount(applicationData.jobId);

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}