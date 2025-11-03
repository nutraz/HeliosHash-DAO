'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">500 - Server Error</h2>
            <button
              onClick={reset}
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
