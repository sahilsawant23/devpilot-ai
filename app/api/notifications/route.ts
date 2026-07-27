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

    // Seed default notifications if none exist for this user
    if (notifications.length === 0) {
      const defaultNotifications = [
        { title: '[SECURITY] Critical vulnerability fix recommended for billing-api', userId: session.id, read: false },
        { title: '[AGENT] Autonomous refactoring agent completed task #104', userId: session.id, read: false },
        { title: '[DOCS] Updated API documentation generated for web-platform', userId: session.id, read: true },
        { title: '[SYSTEM] System update v1.4 successfully deployed', userId: session.id, read: true },
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
    const body = await req.json();

    if (body.action === 'create' && body.title) {
      const notification = await db.notification.create({
        data: {
          title: body.title,
          userId: session.id,
          read: false,
        },
      });
      return NextResponse.json({ success: true, notification });
    }

    const { id, all } = body;

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

export async function DELETE(req: Request) {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const session = JSON.parse(raw);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const clearAll = searchParams.get('all') === 'true';

    if (clearAll) {
      await db.notification.deleteMany({
        where: { userId: session.id },
      });
    } else if (id) {
      await db.notification.delete({
        where: { id, userId: session.id },
      });
    } else {
      return NextResponse.json({ error: 'Missing id or clearAll parameter' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification delete error:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
