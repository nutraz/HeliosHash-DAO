'use client';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import MultiAuth from './auth/MultiAuth';
import WorkingDashboard from './WorkingDashboard';

export default function Router() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <MultiAuth />;
  }

  return <WorkingDashboard />;
}
