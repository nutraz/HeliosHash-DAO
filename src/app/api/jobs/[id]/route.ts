import { NextRequest, NextResponse } from 'next/server';
import { JobPosting } from '@/types/jobs';

// This would be imported from the main jobs route in a real app
// For now, we'll duplicate the mock data
const MOCK_JOBS: JobPosting[] = [
  // ... same mock data as in jobs/route.ts
  // In a real app, this would be fetched from a shared data source
];

/**
 * Fetches a job posting by its route `id` and returns it as JSON.
 *
 * @param params - Route parameters object containing `id`, the job identifier to fetch
 * @returns A NextResponse containing the job object when found; otherwise a JSON error `{ error: string }` with status 404 if the job is not found or 500 on server error
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
 * Apply partial updates to the job posting identified by `params.id`.
 *
 * Merges fields from the request body into the existing job and returns the updated job.
 *
 * @param params - Route parameters containing `id`, the job identifier to update.
 * @returns The updated job object as JSON on success; a JSON error object with status 404 if the job is not found, or status 500 if the update fails.
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
 * Deletes a job posting identified by the route `id` parameter.
 *
 * @param params - Route parameters object containing `id` of the job to delete
 * @returns A JSON response with `{ success: true }` on successful deletion, `{ error: 'Job not found' }` with status 404 if no job matches the id, or `{ error: 'Failed to delete job' }` with status 500 on internal error
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