import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const raw = cookieStore.get('devpilot_user')?.value;
    if (!raw) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const session = JSON.parse(raw);
    const { repositoryId, reportType, format } = await req.json();

    // Fetch repository issues / metrics
    const issues = await db.issue.findMany({
      where: repositoryId ? { repositoryId } : undefined,
      take: 20,
    });

    const reportData = {
      generatedAt: new Date().toISOString(),
      generatedBy: session.email,
      reportType: reportType || 'Full System Audit',
      repositoryId: repositoryId || 'All Repositories',
      totalIssues: issues.length,
      criticalCount: issues.filter((i) => i.severity === 'Critical').length,
      highCount: issues.filter((i) => i.severity === 'High').length,
      mediumCount: issues.filter((i) => i.severity === 'Medium').length,
      issues: issues.map((i) => ({
        title: i.title,
        severity: i.severity,
        category: i.category,
        file: i.file,
        line: i.line,
        resolved: i.resolved,
      })),
    };

    if (format === 'csv') {
      const csvHeader = 'Title,Severity,Category,File,Line,Resolved\n';
      const csvRows = issues
        .map(
          (i) =>
            `"${i.title.replace(/"/g, '""')}",${i.severity},${i.category},${i.file},${i.line},${i.resolved}`
        )
        .join('\n');

      return new NextResponse(csvHeader + csvRows, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="devpilot-report-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ success: true, report: reportData });
  } catch (error) {
    console.error('Report export error:', error);
    return NextResponse.json({ error: 'Failed to generate export report' }, { status: 500 });
  }
}
