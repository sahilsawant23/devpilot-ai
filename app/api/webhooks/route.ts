import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mock in-memory webhooks storage for fallback
let webhooksStore: Array<{
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: string;
}> = [
  {
    id: 'wh_1',
    url: 'https://api.github.com/repos/org/repo/dispatches',
    events: ['vulnerability.detected', 'agent.completed'],
    secret: 'whsec_9a8b7c6d5e4f3a2b1c',
    active: true,
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    return NextResponse.json({ webhooks: webhooksStore });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const body = await req.json();

    if (body.action === 'ping' && body.id) {
      return NextResponse.json({
        success: true,
        message: 'Ping event delivered successfully (200 OK)',
        timestamp: new Date().toISOString(),
      });
    }

    if (!body.url || !body.events || !body.events.length) {
      return NextResponse.json({ error: 'Webhook URL and events are required' }, { status: 400 });
    }

    const newWebhook = {
      id: `wh_${Date.now()}`,
      url: body.url,
      events: body.events,
      secret: `whsec_${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      active: true,
      createdAt: new Date().toISOString(),
    };

    webhooksStore.unshift(newWebhook);

    return NextResponse.json({ success: true, webhook: newWebhook });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create webhook' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing webhook ID' }, { status: 400 });

    webhooksStore = webhooksStore.filter((w) => w.id !== id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete webhook' }, { status: 500 });
  }
}
