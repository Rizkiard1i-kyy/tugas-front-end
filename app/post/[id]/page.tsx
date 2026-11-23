'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

function PostDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/posts/${id}`).then(async (res) => {
      if (res.status === 404) {
        router.push('/not-found');
      } else {
        const data: Post = await res.json();
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      }
    });
  }, [id, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      const updated: Post = await res.json();
      setPost(updated);
      setIsEditing(false);
      setStatusMessage('Post updated successfully!');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    router.push('/');
    router.refresh();
  };

  if (!post) return <p className="container mt-4">Loading...</p>;

  return (
    <main className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link href="/" className="btn btn-outline-secondary btn-sm">
          &larr; Back to Posts
        </Link>
      </div>

      {statusMessage && (
        <div className="alert alert-success" role="alert">
          {statusMessage}
        </div>
      )}

      {isEditing ? (
        <div className="card card-body">
          <h2 className="mb-3">Update Post</h2>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                className="form-control"
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsEditing(false);
                  setTitle(post.title);
                  setContent(post.content);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="card card-body">
          <h1>{post.title}</h1>
          <p className="text-muted">
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString('id-ID') : ''}
          </p>
          <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
          <div className="d-flex gap-2 mt-3">
            <button
              onClick={() => {
                setStatusMessage(null);
                setIsEditing(true);
              }}
              className="btn btn-warning"
            >
              Edit / Update
            </button>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default function PostDetail() {
  return (
    <Suspense fallback={<p className="container mt-4">Loading...</p>}>
      <PostDetailContent />
    </Suspense>
  );
}
