import { db, ensureDb } from '@/db';
import { posts } from '@/db/schema';
import { desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  await ensureDb();
  const allPosts = await db.select().from(posts).orderBy(desc(posts.id));
  return NextResponse.json(allPosts);
}

export async function POST(request: Request) {
  await ensureDb();
  const { title, content } = await request.json();
  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
  }
  const [created] = await db.insert(posts).values({ title, content }).returning();
  return NextResponse.json(created, { status: 201 });
}
