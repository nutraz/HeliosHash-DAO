"use client";

import React from 'react';
import Link from 'next/link';

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      <section className="w-full max-w-md mx-auto p-8 text-center">
        <div className="mx-auto w-40 h-40 relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 opacity-20 animate-ping-slow" aria-hidden="true" />
          <img src="/hhdaologo.svg" alt="HeliosHash logo" className="relative w-40 h-40 rounded-full shadow-2xl mx-auto" />
        </div>

        <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold">HeliosHash DAO</h1>

        <div className="mt-6 flex flex-col gap-3 items-center">
          <Link href="/auth/signin" aria-label="Sign in" title="Sign in" className="w-full text-center inline-block px-8 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">Sign In</Link>

          <Link href="/auth/signup" aria-label="Sign up" title="Sign up" className="w-full text-center inline-block px-8 py-3 rounded-md border border-indigo-500 text-indigo-200 hover:bg-indigo-800/40 focus:outline-none focus:ring-2 focus:ring-indigo-300">Sign Up</Link>
        </div>
      </section>
    </main>
  );
}
