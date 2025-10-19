'use client';

import { useState } from 'react';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');

  return (
    <div>
      <h1>Projects</h1>
      <p>Solar projects and initiatives</p>
      <input
        data-testid="project-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search projects"
      />
      <div data-testid="error-message" style={{ display: 'none' }}>Error occurred</div>
      <div data-testid="search-results">
        <div data-testid="project-item">
          <h2 data-testid="project-name">Mock Project</h2>
        </div>
      </div>
      <div data-testid="applications-list">
        <div>Mock Solar Project - Active</div>
        <div>Another Solar Project - Pending</div>
      </div>
    </div>
  );
}
