"use client"
import React, {useEffect, useState} from 'react';
import PostCard from './PostCard';

type Post = { id: string; authorHandle: string; content: string; createdAt: string };

const FeedList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch('/api/social/posts');
    const json = await res.json();
    setPosts(json.data ?? []);
    setLoading(false);
  }

  useEffect(()=>{
    load();
    const onPosted = () => { load(); };
    window.addEventListener('social-post', onPosted);
    return () => window.removeEventListener('social-post', onPosted);
  }, []);

  return (
    <div className="space-y-3">
      {loading && <div className="text-sm text-slate-500">Loading feed…</div>}
      {!loading && posts.length===0 && <div className="text-sm text-slate-500">No posts yet.</div>}
      {posts.map(p => <PostCard key={p.id} id={p.id} authorHandle={p.authorHandle} content={p.content} createdAt={p.createdAt} />)}
    </div>
  );
}

export default FeedList;
