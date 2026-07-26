import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import crypto from 'crypto';

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
    if (!session?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    let keys = await db.apiKey.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
    });

    // Auto-seed an initial API key if user has none
    if (keys.length === 0) {
      const initialKey = await db.apiKey.create({
        data: {
          name: 'Production Server Key',
          key: `dp_live_${crypto.randomBytes(16).toString('hex')}`,
          userId: session.id,
        },
      });
      keys = [initialKey];
    }

    return NextResponse.json({ keys });
  } catch (error) {
    console.error('Fetch API keys error:', error);
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const name = body.name?.trim() || 'New Secret Key';

    const newKeyString = `dp_live_${crypto.randomBytes(18).toString('hex')}`;

    const key = await db.apiKey.create({
      data: {
        name,
        key: newKeyString,
        userId: session.id,
      },
    });

    // Record activity
    await db.activity.create({
      data: {
        type: 'api_key_created',
        title: `Created API key: ${name}`,
        userId: session.id,
      },
    }).catch(() => null);

    return NextResponse.json({ key }, { status: 201 });
  } catch (error) {
    console.error('Create API key error:', error);
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Key ID is required' }, { status: 400 });
    }

    await db.apiKey.deleteMany({
      where: {
        id,
        userId: session.id,
      },
    });

    return NextResponse.json({ success: true, message: 'API Key revoked' });
  } catch (error) {
    console.error('Revoke API key error:', error);
    return NextResponse.json({ error: 'Failed to revoke API key' }, { status: 500 });
  }
}
