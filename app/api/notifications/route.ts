import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const session = JSON.parse(raw);

    // Fetch user's notifications
    let notifications = await db.notification.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
    });

    // Seed default notifications if none exist for this user in PostgreSQL
    if (notifications.length === 0) {
      const defaultNotifications = [
        { title: 'Repository analysis complete', userId: session.id, read: false },
        { title: '3 new bugs detected in billing-api', userId: session.id, read: false },
        { title: 'Documentation generated for web-platform', userId: session.id, read: true },
      ];

      await db.notification.createMany({
        data: defaultNotifications,
      });

      notifications = await db.notification.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const session = JSON.parse(raw);
    const { id, all } = await req.json();

    if (all) {
      // Mark all read
      await db.notification.updateMany({
        where: { userId: session.id },
        data: { read: true },
      });
    } else if (id) {
      // Mark single read
      await db.notification.update({
        where: { id, userId: session.id },
        data: { read: true },
      });
    } else {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notifications update error:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
