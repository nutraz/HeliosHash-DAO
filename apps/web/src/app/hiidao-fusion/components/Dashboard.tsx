import { useRef, useEffect } from 'react';

"use client";

"use client";

export default function Dashboard() {
  return (
    <section className="dashboard" aria-labelledby="dashboard-title">
      <h2 id="dashboard-title">Community Dashboard</h2>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Active Proposals</h3>
          <p>12</p>
        </div>
        <div className="dashboard-card">
          <h3>Community Members</h3>
          <p>245</p>
        </div>
        <div className="dashboard-card">
          <h3>Total Funds</h3>
          <p>$45,670</p>
        </div>
      </div>
    </section>
  );
}
