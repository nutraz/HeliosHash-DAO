'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [displayedName, setDisplayedName] = useState('');

  const handleSave = () => {
    setDisplayedName(name);
  };

  return (
    <div>
      <h1>Profile</h1>
      <input
        data-testid="name-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <button data-testid="save-profile" onClick={handleSave}>
        Save
      </button>
      <div data-testid="displayed-name">{displayedName}</div>
      <input data-testid="avatar-upload" type="file" />
      <div data-testid="file-error" style={{ display: 'none' }}>Invalid file type</div>
    </div>
  );
}
