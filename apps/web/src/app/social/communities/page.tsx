import React from 'react';

export default function CommunitiesPage(){
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Communities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-md p-4 shadow-sm">Community: Agrivoltaic Farmers (stub)</div>
        <div className="bg-white rounded-md p-4 shadow-sm">Community: Solar Engineers (stub)</div>
      </div>
    </div>
  );
}
