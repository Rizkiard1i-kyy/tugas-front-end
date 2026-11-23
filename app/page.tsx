import Link from 'next/link';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { db, ensureDb } from '@/db';
import { posts } from '@/db/schema';
import { desc } from 'drizzle-orm';

async function PostList() {
  await connection();
  await ensureDb();
  const allPosts = await db.select().from(posts).orderBy(desc(posts.id));

  if (allPosts.length === 0) {
    return (
      <div className="alert alert-secondary">
        No posts yet. Click <strong>Create Post</strong> to add your first post.
      </div>
    );
  }

  return (
    <ul className="list-group">
      {allPosts.map((post) => (
        <li
          key={post.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <Link href={`/post/${post.id}`} className="fw-semibold text-decoration-none">
              {post.title}
            </Link>
            <p className="mb-0 text-muted small text-truncate" style={{ maxWidth: '500px' }}>
              {post.content}
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted small me-2">
              {post.createdAt ? new Date(post.createdAt).toLocaleDateString('id-ID') : ''}
            </span>
            <Link href={`/post/${post.id}`} className="btn btn-sm btn-outline-primary">
              View / Edit
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Blog Posts (CRUD)</h1>
        <Link href="/create" className="btn btn-primary">
          + Create Post
        </Link>
      </div>
      <Suspense fallback={<p>Loading...</p>}>
        <PostList />
      </Suspense>
    </main>
  );
}
