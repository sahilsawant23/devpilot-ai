import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const session = JSON.parse(raw);

    // Fetch user's chat sessions
    let chats = await db.chatSession.findMany({
      where: { userId: session.id },
      orderBy: { updatedAt: 'desc' },
    });

    // Seed default chats if none exist in the database for this user
    if (chats.length === 0) {
      const defaultChats = [
        { title: 'Explain authentication flow', userId: session.id },
        { title: 'Find bugs in payment gateway', userId: session.id },
        { title: 'Generate tests for user-service', userId: session.id },
        { title: 'Create README for analytics', userId: session.id },
      ];

      await db.chatSession.createMany({
        data: defaultChats,
      });

      chats = await db.chatSession.findMany({
        where: { userId: session.id },
        orderBy: { updatedAt: 'desc' },
      });
    }

    return NextResponse.json({ chats });
  } catch (error) {
    console.error('Chat fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const session = JSON.parse(raw);
    const { title } = await req.json();

    const newChat = await db.chatSession.create({
      data: {
        title: title || 'New Conversation',
        userId: session.id,
      },
    });

    // Register a chat activity
    await db.activity.create({
      data: {
        type: 'Chat',
        title: `Started chat: ${newChat.title}`,
        userId: session.id,
      },
    });

    return NextResponse.json({ chat: newChat }, { status: 201 });
  } catch (error) {
    console.error('Chat create error:', error);
    return NextResponse.json({ error: 'Failed to create chat session' }, { status: 500 });
  }
}
