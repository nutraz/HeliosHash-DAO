import { NextRequest, NextResponse } from 'next/server';
import { JobPosting } from '@/types/jobs';

// This would be imported from the main jobs route in a real app
// For now, we'll duplicate the mock data
const MOCK_JOBS: JobPosting[] = [
  // ... same mock data as in jobs/route.ts
  // In a real app, this would be fetched from a shared data source
];

/**
 * Retrieve a job by id from the mock data store.
 *
 * @param params - Route parameters object containing the `id` of the job to fetch.
 * @returns `NextResponse` containing the job object if found; otherwise a 404 JSON error object, or a 500 JSON error object on failure.
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
 * Update an existing job by merging provided fields into the stored job and return the updated record.
 *
 * @param request - Incoming request whose JSON body contains partial job fields to apply as updates
 * @param params - Route parameters object containing `id`, the identifier of the job to update
 * @returns The updated job object as JSON on success; an error object with status 404 if the job is not found, or status 500 if the update fails
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
 * Delete the job resource identified by the route `id` parameter.
 *
 * Attempts to remove the job with the given `id` from the in-memory job list and returns a JSON response indicating the outcome.
 *
 * @param params - Route parameters object containing the job identifier
 * @param params.id - The job `id` extracted from the route
 * @returns A JSON response: `{ success: true }` on successful deletion; `{ error: 'Job not found' }` with status `404` if no job matches the `id`; `{ error: 'Failed to delete job' }` with status `500` on internal error
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