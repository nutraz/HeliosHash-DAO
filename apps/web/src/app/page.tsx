import { redirect } from 'next/navigation'

export default function Page() {
  // Redirect root to the server-rendered test page so GET / doesn't return a
  // Next.js App Router NotFound (this keeps the heavy client-only home as a
  // client-side route while providing a usable server entrypoint).
  redirect('/test-home')
}

