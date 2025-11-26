"use client";
import React from 'react';

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-700 rounded ${className}`} />
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <Skeleton className="w-8 h-8" />
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
