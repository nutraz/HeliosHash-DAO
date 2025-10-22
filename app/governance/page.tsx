'use client';

import { useState } from 'react';

export default function GovernancePage() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  return (
    <div>
      <h1>Governance</h1>
      <p>DAO governance</p>
      <button data-testid="create-proposal" onClick={() => setShowForm(true)}>
        Create Proposal
      </button>
      {showForm && (
        <div>
          <input
            data-testid="proposal-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Proposal title"
          />
          <textarea
            data-testid="proposal-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Proposal description"
          />
          <button data-testid="submit-proposal">Submit</button>
        </div>
      )}
    </div>
  );
}
