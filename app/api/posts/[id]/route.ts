import { db, ensureDb } from '@/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDb();
  const { id } = await params;

  const post = await db.select().from(posts).where(eq(posts.id, Number(id))).get();
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDb();
  const { id } = await params;
  const { title, content } = await request.json();

  if (!title || !content) {
    return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
  }

  const [updated] = await db
    .update(posts)
    .set({ title, content })
    .where(eq(posts.id, Number(id)))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureDb();
  const { id } = await params;

  await db.delete(posts).where(eq(posts.id, Number(id)));

  return new NextResponse(null, { status: 204 });
}
