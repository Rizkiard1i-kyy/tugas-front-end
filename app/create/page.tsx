'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    router.push('/');
    router.refresh();
  };

  return (
    <main className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Create Post</h1>
        <Link href="/" className="btn btn-outline-secondary">
          Back to List
        </Link>
      </div>
      <form onSubmit={handleSubmit} className="card card-body">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            placeholder="Enter post title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            className="form-control"
            rows={5}
            placeholder="Write post content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-success" disabled={saving}>
            {saving ? 'Saving...' : 'Save Post'}
          </button>
          <Link href="/" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
