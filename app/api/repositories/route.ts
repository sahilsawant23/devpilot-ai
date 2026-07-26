import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const session = JSON.parse(raw);

    // Fetch user's real-time repositories
    let repos = await db.repository.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: 'desc' },
    });

    // Auto-seed default repositories if the new database is empty for this user
    if (repos.length === 0) {
      const defaultRepos = [
        {
          name: 'web-platform',
          description: 'Customer-facing web application built with Next.js',
          language: 'TypeScript',
          url: 'https://github.com/sahilsawant23/web-platform',
          health: 92,
          status: 'Analyzed',
          userId: session.id,
        },
        {
          name: 'billing-api',
          description: 'Stripe-powered billing microservice',
          language: 'Go',
          url: 'https://github.com/sahilsawant23/billing-api',
          health: 76,
          status: 'Needs Review',
          userId: session.id,
        },
        {
          name: 'analytics-engine',
          description: 'Real-time event processing pipeline',
          language: 'Python',
          url: 'https://github.com/sahilsawant23/analytics-engine',
          health: 88,
          status: 'Analyzed',
          userId: session.id,
        },
        {
          name: 'user-service',
          description: 'Authentication and identity service',
          language: 'TypeScript',
          url: 'https://github.com/sahilsawant23/user-service',
          health: 81,
          status: 'Analyzed',
          userId: session.id,
        }
      ];

      // Insert default seed repositories
      await db.repository.createMany({
        data: defaultRepos,
      });

      // Fetch again to return database records
      repos = await db.repository.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ repositories: repos });
  } catch (error) {
    console.error('Repository fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const session = JSON.parse(raw);
    const { name, description, url, language } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Repository name is required' }, { status: 400 });
    }

    const repo = await db.repository.create({
      data: {
        name,
        description: description ?? 'Imported codebase',
        url: url ?? '',
        language: language ?? 'TypeScript',
        health: Math.floor(Math.random() * 20) + 80, // Random health score 80-99
        status: 'Analyzed',
        userId: session.id,
      },
    });

    // Also register an activity for this import
    await db.activity.create({
      data: {
        type: 'Analysis',
        title: `Imported and indexed repository: ${name}`,
        userId: session.id,
        repositoryId: repo.id,
      }
    });

    return NextResponse.json({ repository: repo }, { status: 201 });
  } catch (error) {
    console.error('Repository create error:', error);
    return NextResponse.json({ error: 'Failed to create repository' }, { status: 500 });
  }
}
