"use client"
import React from 'react';

type Props = {
  id: string;
  authorHandle: string;
  content: string;
  createdAt: string;
}

const PostCard: React.FC<Props> = ({authorHandle, content, createdAt}) => {
  return (
    <article className="p-3 bg-white rounded-md shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-medium">{authorHandle[0]?.toUpperCase()}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-medium">{authorHandle}</div>
            <div className="text-xs text-slate-400">{new Date(createdAt).toLocaleString()}</div>
          </div>
          <div className="mt-2 text-sm text-slate-700">{content}</div>
        </div>
      </div>
    </article>
  );
}

export default PostCard;
