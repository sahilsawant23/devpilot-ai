import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const session = JSON.parse(raw);

    const activities = await db.activity.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { repository: { select: { name: true } } },
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Activity fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const session = JSON.parse(raw);
    const { type, title, repositoryId } = await req.json();

    if (!type || !title) {
      return NextResponse.json({ error: 'type and title are required' }, { status: 400 });
    }

    const activity = await db.activity.create({
      data: { type, title, userId: session.id, repositoryId: repositoryId ?? null },
    });

    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error('Activity create error:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}
