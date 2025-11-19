"use client"
import React from 'react';

const CommunityCard: React.FC<{title: string; description?: string}> = ({title, description}) => {
  return (
    <div className="bg-white rounded-md p-3 shadow-sm">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-slate-600 mt-2">{description}</div>
      <div className="mt-3">
        <button className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-md">Join</button>
      </div>
    </div>
  );
}

export default CommunityCard;
