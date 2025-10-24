'use client';

import { useState } from 'react';

export default function GovernancePage() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <main className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Governance</h1>
        <p className="text-muted-foreground mb-6">DAO governance</p>
        <button
          data-testid="create-proposal"
          onClick={() => setShowForm(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium shadow hover:bg-primary/90 transition mb-6"
        >
          Create Proposal
        </button>
        {showForm && (
          <div className="bg-card p-6 rounded-lg shadow mb-4">
            <input
              data-testid="proposal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Proposal title"
              className="w-full mb-3 px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              data-testid="proposal-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Proposal description"
              className="w-full mb-3 px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              data-testid="submit-proposal"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium shadow hover:bg-primary/90 transition"
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
