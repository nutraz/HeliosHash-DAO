import React from 'react';
import Link from 'next/link';

export default function TestSimple() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Simple Test Page</h1>
      <p>This is a simple test page to verify the build process works correctly.</p>
      
      <div className="mt-4">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
