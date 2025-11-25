"use client"
import React, {useState} from 'react';

const PostComposer: React.FC = () => {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submitPost(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await fetch('/api/social/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorHandle: 'demo', content })
      });
      setContent('');
      // notify feed components on the page
      window.dispatchEvent(new Event('social-post'));
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitPost} className="bg-white p-3 rounded-md shadow-sm mb-4" data-testid="post-creator">
      <textarea data-testid="post-content" className="w-full border rounded p-2" placeholder="Share an update with the DAO..." value={content} onChange={e=>setContent(e.target.value)} rows={3} />
      <div className="mt-2 flex justify-end">
        <button data-testid="submit-post" type="submit" disabled={submitting} className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm">{submitting? 'Posting...':'Post'}</button>
      </div>
    </form>
  );
}

export default PostComposer;
