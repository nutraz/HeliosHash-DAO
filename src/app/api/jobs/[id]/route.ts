import { NextRequest, NextResponse } from 'next/server';
import { JobPosting } from '@/types/jobs';

// This would be imported from the main jobs route in a real app
// For now, we'll duplicate the mock data
const MOCK_JOBS: JobPosting[] = [
  // ... same mock data as in jobs/route.ts
  // In a real app, this would be fetched from a shared data source
];

/**
 * Fetches a job by its route `id` and returns it as JSON.
 *
 * @param request - The incoming Next.js request
 * @param params - Route parameters; `params.id` is the job identifier to fetch
 * @returns The job object when found, or an error object `{ error: string }` with HTTP status 404 if not found or 500 on failure
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobId = params.id;

    // In a real app, fetch from database/IC canister
    const job = MOCK_JOBS.find((j) => j.id === jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

/**
 * Updates an existing job posting with the fields provided in the request body.
 *
 * @param request - The incoming request whose JSON body contains the partial job fields to apply
 * @param params - Route parameters; `params.id` is the ID of the job to update
 * @returns The updated job object as JSON on success; `{ error: 'Job not found' }` with status 404 if no job matches `params.id`; `{ error: 'Failed to update job' }` with status 500 on internal error
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobId = params.id;
    const updates = await request.json();

    // In a real app, update in database/IC canister
    const jobIndex = MOCK_JOBS.findIndex((j) => j.id === jobId);

    if (jobIndex === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    MOCK_JOBS[jobIndex] = { ...MOCK_JOBS[jobIndex], ...updates };

    return NextResponse.json(MOCK_JOBS[jobIndex]);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}

/**
 * Deletes the job identified by the route parameter `id` from the mock job list.
 *
 * @param params - Route parameters object containing the `id` of the job to delete
 * @returns `{ success: true }` when deletion succeeds; `{ error: 'Job not found' }` if no job matches the `id`; `{ error: 'Failed to delete job' }` on internal error
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const jobId = params.id;

    // In a real app, delete from database/IC canister
    const jobIndex = MOCK_JOBS.findIndex((j) => j.id === jobId);

    if (jobIndex === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    MOCK_JOBS.splice(jobIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}