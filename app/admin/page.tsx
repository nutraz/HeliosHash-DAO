'use client';

import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem('auth_token');
    const isAdmin = token && token.includes('admin');
    setIsAuthorized(!!isAdmin);
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return (
      <div data-testid="access-denied">
        <h1>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin</h1>
      <p>Admin panel</p>
    </div>
  );
}
