"use client";

export default function JobBoardSection() {
  return (
    <div data-testid="job-board-wrapper" className="p-4">
      <h1 data-testid="job-stats">Mock Stats: 10 Jobs</h1>
      <ul data-testid="job-list">
        <li data-testid="job-item-1">Mock Job 1</li>
      </ul>
      <button data-testid="job-refresh-button">Refresh</button>
      <select data-testid="job-sort-select"><option>Sort</option></select>
      <input data-testid="job-search-input" placeholder="Search" />
      <button data-testid="clear-filters">Clear</button>
      <div data-testid="job-empty-state" style={{ display: 'none' }}>No jobs found</div>
    </div>
  );
}
