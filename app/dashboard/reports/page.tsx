'use client';

import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const reports = [
  { id: '1', title: 'web-platform — Full Analysis', type: 'Analysis', repo: 'web-platform', date: '2024-06-12', status: 'Ready', size: '2.4 MB' },
  { id: '2', title: 'billing-api — Security Audit', type: 'Security', repo: 'billing-api', date: '2024-06-11', status: 'Ready', size: '1.1 MB' },
  { id: '3', title: 'analytics-engine — Performance Report', type: 'Performance', repo: 'analytics-engine', date: '2024-06-09', status: 'Ready', size: '3.2 MB' },
  { id: '4', title: 'user-service — Test Coverage', type: 'Testing', repo: 'user-service', date: '2024-06-08', status: 'Ready', size: '0.8 MB' },
  { id: '5', title: 'design-system — Architecture Review', type: 'Architecture', repo: 'design-system', date: '2024-06-05', status: 'Processing', size: '—' },
  { id: '6', title: 'mobile-app — Bug Report', type: 'Bugs', repo: 'mobile-app', date: '2024-06-02', status: 'Ready', size: '1.6 MB' },
];

const typeColor: Record<string, string> = {
  Analysis: 'bg-blue-500/15 text-blue-500',
  Security: 'bg-red-500/15 text-red-500',
  Performance: 'bg-cyan-500/15 text-cyan-500',
  Testing: 'bg-emerald-500/15 text-emerald-500',
  Architecture: 'bg-purple-500/15 text-purple-500',
  Bugs: 'bg-amber-500/15 text-amber-500',
};

export default function ReportsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Reports"
        description="All generated reports across your repositories."
        actions={
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90">
            <FileText className="mr-2 h-4 w-4" />
            New report
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search reports..." className="h-9 bg-card pl-9" />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardContent className="px-0">
          <div className="divide-y divide-border/60">
            {reports.map((r) => (
              <div key={r.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{r.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {r.date}
                      </span>
                      <span>{r.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeColor[r.type]}`}>
                    {r.type}
                  </span>
                  {r.status === 'Ready' ? (
                    <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-500">Ready</Badge>
                  ) : (
                    <Badge variant="secondary">Processing</Badge>
                  )}
                  {r.status === 'Ready' && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="View report">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Download report">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
