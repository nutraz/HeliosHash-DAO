'use client';

import { useState } from 'react';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');

  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Projects</h1>
        <p className="text-muted-foreground mb-6">Solar projects and initiatives</p>
        <input
          data-testid="project-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects"
          className="w-full max-w-md px-4 py-2 rounded-md border border-border bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-6"
        />
        <div data-testid="error-message" className="hidden text-destructive bg-destructive/10 p-2 rounded mb-4">Error occurred</div>
        <div data-testid="search-results" className="mb-6">
          <div data-testid="project-item" className="bg-card text-card-foreground p-4 rounded-lg shadow mb-2">
            <h2 data-testid="project-name" className="text-lg font-semibold">Mock Project</h2>
          </div>
        </div>
        <div data-testid="applications-list" className="space-y-2">
          <div className="bg-muted text-muted-foreground p-3 rounded">Mock Solar Project - Active</div>
          <div className="bg-muted text-muted-foreground p-3 rounded">Another Solar Project - Pending</div>
        </div>
      </div>
    </main>
  );
}
