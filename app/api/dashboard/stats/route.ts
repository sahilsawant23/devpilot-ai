import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const session = JSON.parse(raw);
    const userId = session.id;

    // 1. Count real user repositories
    const reposCount = await db.repository.count({
      where: { userId },
    });

    // 2. Count real user chat sessions
    const chatsCount = await db.chatSession.count({
      where: { userId },
    });

    // 3. Count real reports
    const reportsCount = await db.report.count({
      where: { userId },
    });

    // 4. Calculate dynamic bugs count based on repositories health scores
    const repos = await db.repository.findMany({
      where: { userId },
      select: { health: true },
    });
    
    // Low health repositories contribute more simulated bugs (e.g. 100 - health)
    let totalBugs = 0;
    repos.forEach(r => {
      const bugFactor = Math.max(0, Math.floor((100 - r.health) / 5));
      totalBugs += bugFactor;
    });

    // 5. Calculate docs count based on repositories (say 2 documentation files per repo)
    const docsCount = reposCount * 2;

    return NextResponse.json({
      stats: {
        repositories: reposCount,
        chats: chatsCount,
        reports: reportsCount,
        bugs: totalBugs,
        docs: docsCount,
      }
    });
  } catch (error) {
    console.error('Dashboard stats fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
