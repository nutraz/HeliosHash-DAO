import React from 'react';
import AuditLogWidget from '@/components/AuditLogWidget';
import VCManager from '@/components/VCManager';

export default function DevCanistersPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Canister Dev Playground</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AuditLogWidget />
        <VCManager />
      </div>
    </div>
  );
}
