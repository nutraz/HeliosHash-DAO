import React from 'react';
import FeedList from '@/components/social/FeedList';
import PostComposer from '@/components/social/PostComposer';

export const metadata = { title: 'Social Feed - HHDAO' };

export default function SocialFeedPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Social Feed</h1>
        <div className="text-sm text-slate-500">Demo feed powered by in-memory mock</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <main className="col-span-2">
          <PostComposer />
          <FeedList />
        </main>

        <aside className="col-span-1 bg-white rounded-md p-4 shadow-sm">
          <h3 className="font-medium">Who to follow</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Alice — DAO Builder</li>
            <li>Bob — Solar Engineer</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
