import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const session = JSON.parse(raw);

    // Fetch user's first repository to link initial issues
    let repo = await db.repository.findFirst({
      where: { userId: session.id },
    });

    if (!repo) {
      repo = await db.repository.create({
        data: {
          name: 'web-platform',
          description: 'Primary customer-facing application',
          language: 'TypeScript',
          health: 85,
          userId: session.id,
        },
      });
    }

    let issues = await db.issue.findMany({
      where: { repository: { userId: session.id } },
      orderBy: { createdAt: 'desc' },
    });

    // Auto-seed initial review issues if PostgreSQL database has none for this user
    if (issues.length === 0) {
      const initialIssues = [
        {
          id: '1',
          severity: 'Critical',
          title: 'SQL injection vulnerability in user query',
          description: 'User input is concatenated directly into a SQL query string, allowing an attacker to inject arbitrary SQL commands.',
          file: 'src/lib/db/users.ts',
          line: 42,
          fixCode: 'Use parameterized queries with prepared statements instead of string concatenation.',
          category: 'Security',
          repositoryId: repo.id,
        },
        {
          id: '2',
          severity: 'Critical',
          title: 'Hardcoded API secret in source',
          description: 'A third-party API key is committed directly in source code, exposing it to anyone with repository access.',
          file: 'src/services/payments.ts',
          line: 18,
          fixCode: 'Move the secret to an environment variable and rotate the exposed key immediately.',
          category: 'Security',
          repositoryId: repo.id,
        },
        {
          id: '3',
          severity: 'High',
          title: 'Unhandled promise rejection in async handler',
          description: 'An async function lacks a try/catch block, causing unhandled rejections that can crash the process.',
          file: 'src/app/api/webhook/route.ts',
          line: 67,
          fixCode: 'Wrap the async logic in try/catch and return a 500 response on error.',
          category: 'Reliability',
          repositoryId: repo.id,
        },
        {
          id: '4',
          severity: 'High',
          title: 'Potential race condition in cache update',
          description: 'Two concurrent requests may read and write the cache simultaneously, leading to inconsistent state.',
          file: 'src/lib/cache.ts',
          line: 91,
          fixCode: 'Use a mutex or atomic compare-and-swap operation when updating shared cache entries.',
          category: 'Concurrency',
          repositoryId: repo.id,
        },
        {
          id: '5',
          severity: 'Medium',
          title: 'Missing input validation on email field',
          description: 'The email input is not validated before being stored, which may allow malformed data.',
          file: 'src/app/api/signup/route.ts',
          line: 24,
          fixCode: 'Validate the email with a regex or zod schema before processing.',
          category: 'Validation',
          repositoryId: repo.id,
        },
        {
          id: '6',
          severity: 'Medium',
          title: 'Inefficient N+1 query in list endpoint',
          description: 'The endpoint fetches related records one-by-one inside a loop, causing N+1 database queries.',
          file: 'src/app/api/posts/route.ts',
          line: 53,
          fixCode: 'Use a single query with a JOIN or include to fetch related data in one round-trip.',
          category: 'Performance',
          repositoryId: repo.id,
        },
        {
          id: '7',
          severity: 'Low',
          title: 'Unused import statement',
          description: 'The import for `useCallback` is declared but never used in this file.',
          file: 'src/components/Form.tsx',
          line: 3,
          fixCode: 'Remove the unused import to keep the bundle lean.',
          category: 'Code Quality',
          repositoryId: repo.id,
        },
        {
          id: '8',
          severity: 'Low',
          title: 'Inconsistent code formatting',
          description: 'Indentation uses a mix of tabs and spaces, violating project style rules.',
          file: 'src/lib/format.ts',
          line: 12,
          fixCode: 'Run the project formatter (Prettier) to normalize whitespace.',
          category: 'Style',
          repositoryId: repo.id,
        },
      ];

      await db.issue.createMany({
        data: initialIssues,
      });

      issues = await db.issue.findMany({
        where: { repository: { userId: session.id } },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({ issues });
  } catch (error) {
    console.error('Review issues fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch review issues' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { issueId, resolved } = await req.json();

    if (!issueId) {
      return NextResponse.json({ error: 'issueId is required' }, { status: 400 });
    }

    const updated = await db.issue.update({
      where: { id: issueId },
      data: { resolved: Boolean(resolved) },
    });

    return NextResponse.json({ issue: updated });
  } catch (error) {
    console.error('Review issue update error:', error);
    return NextResponse.json({ error: 'Failed to update issue status' }, { status: 500 });
  }
}
