import { NextRequest, NextResponse } from 'next/server';
import { JobPosting } from '@/types/jobs';

// This would be imported from the main jobs route in a real app
// For now, we'll duplicate the mock data
const MOCK_JOBS: JobPosting[] = [
  // ... same mock data as in jobs/route.ts
  // In a real app, this would be fetched from a shared data source
];

/**
 * Fetches a job posting by its route parameter id and returns it as JSON.
 *
 * @param request - The incoming Next.js request (unused for retrieval)
 * @param params - An object containing route parameters
 * @param params.id - The job identifier to look up
 * @returns The requested job posting as JSON if found; otherwise a JSON object with an `error` message and a 404 status when not found, or a 500 status on failure
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
 * Updates the job identified by `params.id` with fields from the request body and returns the updated job.
 *
 * @param request - Incoming request whose JSON body contains the partial job fields to apply as updates
 * @param params - Route parameters; `params.id` is the ID of the job to update
 * @returns The updated job object as JSON on success; if the job is not found, returns `{ error: 'Job not found' }` with a 404 status; on failure, returns `{ error: 'Failed to update job' }` with a 500 status
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
 * Deletes the job identified by the route `id` from the mock data store and returns a JSON response.
 *
 * @param params - Route parameters containing the `id` of the job to delete (`params.id`).
 * @returns A JSON response: `{ success: true }` when the job is deleted; otherwise a JSON error object (for example `{ error: 'Job not found' }` or `{ error: 'Failed to delete job' }`) with an appropriate HTTP status.
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