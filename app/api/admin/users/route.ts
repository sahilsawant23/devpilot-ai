import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

async function getSessionUser() {
  const cookieStore = cookies();
  const raw = cookieStore.get('devpilot_user')?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const session = await getSessionUser();
    // Allow viewing list if authenticated
    let users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { repositories: true, apiKeys: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Auto-seed initial users if DB has only 1 or 0 users
    if (users.length <= 1) {
      const demoUsers = [
        { name: 'Sahil Sawant (Admin)', email: 'sahil@devpilot.ai', role: 'ADMIN' },
        { name: 'Alex Morgan', email: 'alex.m@devpilot.ai', role: 'DEVELOPER' },
        { name: 'Sarah Connor', email: 'sarah.c@devpilot.ai', role: 'DEVELOPER' },
        { name: 'David Lee (Audit)', email: 'david.l@devpilot.ai', role: 'VIEWER' },
      ];

      for (const u of demoUsers) {
        if (!users.some(existing => existing.email === u.email)) {
          await db.user.create({
            data: {
              name: u.name,
              email: u.email,
              password: '$2a$10$demoHashedPasswordPlaceholder',
              role: u.role,
            },
          }).catch(() => null);
        }
      }

      users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: {
            select: { repositories: true, apiKeys: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSessionUser();
    
    const { userId, role } = await req.json().catch(() => ({}));

    if (!userId || !role) {
      return NextResponse.json({ error: 'userId and role are required' }, { status: 400 });
    }

    if (!['ADMIN', 'DEVELOPER', 'VIEWER'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });

    // Record activity
    if (session?.id) {
      await db.activity.create({
        data: {
          type: 'role_updated',
          title: `Updated user role for ${updatedUser.name} to ${role}`,
          userId: session.id,
        },
      }).catch(() => null);
    }

    return NextResponse.json({ user: updatedUser, message: `Role updated to ${role}` });
  } catch (error) {
    console.error('Update user role error:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
