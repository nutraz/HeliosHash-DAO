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
 * Retrieve a filtered, sorted, and paginated list of job applications from the mock store.
 *
 * @param request - Incoming request whose URL search parameters may include:
 *   - `page`: page number (defaults to 1)
 *   - `limit`: number of items per page (defaults to 10)
 *   - `jobId`: filter by job identifier
 *   - `applicantId`: filter by applicant identifier
 *   - `status`: comma-separated list of application statuses to include
 * @returns An `ApplicationListResponse` object containing:
 *   - `applications`: the page of applications after filtering and sorting
 *   - `total`: total number of applications matching filters
 *   - `page`: the current page number
 *   - `limit`: the page size
 *   - `hasMore`: `true` if more results exist after the current page, `false` otherwise
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
 * Create a new job application from the request body and store it in the mock database.
 *
 * @param request - NextRequest whose JSON body must include `jobId`, `applicantId`, and `coverLetter`; other application fields may be provided and will be included in the created application.
 * @returns On success, the created JobApplication object (HTTP 201). On validation failure or conflict, a JSON error object with status 400 (missing fields) or 409 (already applied). On unexpected failure, a JSON error object with status 500.
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