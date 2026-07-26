import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';

    const nodes = [
      { id: 'app-router', label: 'App Router Layer', type: 'container', category: 'Frontend', status: 'healthy', lines: 1420 },
      { id: 'auth-api', label: 'Auth API (/api/auth)', type: 'endpoint', category: 'API', status: 'healthy', lines: 320 },
      { id: 'review-api', label: 'Review API (/api/review)', type: 'endpoint', category: 'API', status: 'warning', lines: 480 },
      { id: 'tests-api', label: 'Test Suite API (/api/tests)', type: 'endpoint', category: 'API', status: 'healthy', lines: 290 },
      { id: 'docs-api', label: 'Docs API (/api/docs)', type: 'endpoint', category: 'API', status: 'healthy', lines: 310 },
      { id: 'agents-api', label: 'Multi-Agent Engine (/api/agents)', type: 'endpoint', category: 'API', status: 'healthy', lines: 520 },
      { id: 'apikeys-api', label: 'API Keys (/api/apikeys)', type: 'endpoint', category: 'API', status: 'healthy', lines: 210 },
      { id: 'prisma-orm', label: 'Prisma Data Access (lib/db)', type: 'service', category: 'Database', status: 'healthy', lines: 180 },
      { id: 'postgres-db', label: 'PostgreSQL Database', type: 'database', category: 'Database', status: 'healthy', lines: 0 },
      { id: 'ai-engine', label: 'DevPilot Core AI Engine', type: 'service', category: 'AI', status: 'healthy', lines: 890 },
    ];

    const links = [
      { source: 'app-router', target: 'auth-api', label: 'HTTP GET/POST' },
      { source: 'app-router', target: 'review-api', label: 'HTTP GET/POST' },
      { source: 'app-router', target: 'tests-api', label: 'HTTP POST' },
      { source: 'app-router', target: 'docs-api', label: 'HTTP POST' },
      { source: 'app-router', target: 'agents-api', label: 'HTTP POST' },
      { source: 'app-router', target: 'apikeys-api', label: 'HTTP GET/POST/DEL' },
      { source: 'auth-api', target: 'prisma-orm', label: 'Prisma Client' },
      { source: 'review-api', target: 'prisma-orm', label: 'Prisma Client' },
      { source: 'agents-api', target: 'prisma-orm', label: 'Prisma Client' },
      { source: 'apikeys-api', target: 'prisma-orm', label: 'Prisma Client' },
      { source: 'prisma-orm', target: 'postgres-db', label: 'TCP/IP Connection' },
      { source: 'review-api', target: 'ai-engine', label: 'AST Scan' },
      { source: 'tests-api', target: 'ai-engine', label: 'Generate Tests' },
      { source: 'docs-api', target: 'ai-engine', label: 'Generate Markdown' },
      { source: 'agents-api', target: 'ai-engine', label: 'Agent Flow Execution' },
    ];

    let filteredNodes = nodes;
    if (filter !== 'all') {
      filteredNodes = nodes.filter(n => n.category.toLowerCase() === filter.toLowerCase());
    }

    return NextResponse.json({
      repositoryName: 'DevPilot AI Core Platform',
      totalModules: nodes.length,
      totalLinesOfCode: nodes.reduce((acc, curr) => acc + curr.lines, 0),
      healthScore: 94,
      nodes: filteredNodes,
      links,
    });
  } catch (error) {
    console.error('Visualizer error:', error);
    return NextResponse.json({ error: 'Failed to generate codebase graph' }, { status: 500 });
  }
}
