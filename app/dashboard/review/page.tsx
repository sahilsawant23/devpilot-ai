'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Bug,
  ShieldAlert,
  AlertTriangle,
  Info,
  FileCode,
  ArrowRight,
  CheckCircle2,
  Filter,
  Search,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

type Issue = {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  file: string;
  line: number;
  fix: string;
  category: string;
};

const issues: Issue[] = [
  {
    id: '1',
    severity: 'Critical',
    title: 'SQL injection vulnerability in user query',
    description:
      'User input is concatenated directly into a SQL query string, allowing an attacker to inject arbitrary SQL commands.',
    file: 'src/lib/db/users.ts',
    line: 42,
    fix: 'Use parameterized queries with prepared statements instead of string concatenation.',
    category: 'Security',
  },
  {
    id: '2',
    severity: 'Critical',
    title: 'Hardcoded API secret in source',
    description:
      'A third-party API key is committed directly in source code, exposing it to anyone with repository access.',
    file: 'src/services/payments.ts',
    line: 18,
    fix: 'Move the secret to an environment variable and rotate the exposed key immediately.',
    category: 'Security',
  },
  {
    id: '3',
    severity: 'High',
    title: 'Unhandled promise rejection in async handler',
    description:
      'An async function lacks a try/catch block, causing unhandled rejections that can crash the process.',
    file: 'src/app/api/webhook/route.ts',
    line: 67,
    fix: 'Wrap the async logic in try/catch and return a 500 response on error.',
    category: 'Reliability',
  },
  {
    id: '4',
    severity: 'High',
    title: 'Potential race condition in cache update',
    description:
      'Two concurrent requests may read and write the cache simultaneously, leading to inconsistent state.',
    file: 'src/lib/cache.ts',
    line: 91,
    fix: 'Use a mutex or atomic compare-and-swap operation when updating shared cache entries.',
    category: 'Concurrency',
  },
  {
    id: '5',
    severity: 'Medium',
    title: 'Missing input validation on email field',
    description:
      'The email input is not validated before being stored, which may allow malformed data.',
    file: 'src/app/api/signup/route.ts',
    line: 24,
    fix: 'Validate the email with a regex or zod schema before processing.',
    category: 'Validation',
  },
  {
    id: '6',
    severity: 'Medium',
    title: 'Inefficient N+1 query in list endpoint',
    description:
      'The endpoint fetches related records one-by-one inside a loop, causing N+1 database queries.',
    file: 'src/app/api/posts/route.ts',
    line: 53,
    fix: 'Use a single query with a JOIN or include to fetch related data in one round-trip.',
    category: 'Performance',
  },
  {
    id: '7',
    severity: 'Low',
    title: 'Unused import statement',
    description: 'The import for `useCallback` is declared but never used in this file.',
    file: 'src/components/Form.tsx',
    line: 3,
    fix: 'Remove the unused import to keep the bundle lean.',
    category: 'Code Quality',
  },
  {
    id: '8',
    severity: 'Low',
    title: 'Inconsistent code formatting',
    description: 'Indentation uses a mix of tabs and spaces, violating project style rules.',
    file: 'src/lib/format.ts',
    line: 12,
    fix: 'Run the project formatter (Prettier) to normalize whitespace.',
    category: 'Style',
  },
];

const severityConfig: Record<
  Severity,
  { icon: React.ElementType; border: string; bg: string; text: string; badge: string }
> = {
  Critical: {
    icon: ShieldAlert,
    border: 'border-red-500/30',
    bg: 'bg-red-500/10',
    text: 'text-red-500',
    badge: 'bg-red-500/15 text-red-500 border-red-500/30',
  },
  High: {
    icon: AlertTriangle,
    border: 'border-orange-500/30',
    bg: 'bg-orange-500/10',
    text: 'text-orange-500',
    badge: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
  },
  Medium: {
    icon: Bug,
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    badge: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  },
  Low: {
    icon: Info,
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    badge: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
  },
};

const filters: (Severity | 'All')[] = ['All', 'Critical', 'High', 'Medium', 'Low'];

export default function CodeReviewPage() {
  const [filter, setFilter] = React.useState<Severity | 'All'>('All');
  const [query, setQuery] = React.useState('');
  const [resolved, setResolved] = React.useState<Set<string>>(new Set());

  const filtered = issues.filter(
    (i) =>
      (filter === 'All' || i.severity === filter) &&
      (i.title.toLowerCase().includes(query.toLowerCase()) ||
        i.file.toLowerCase().includes(query.toLowerCase()))
  );

  const counts = {
    Critical: issues.filter((i) => i.severity === 'Critical').length,
    High: issues.filter((i) => i.severity === 'High').length,
    Medium: issues.filter((i) => i.severity === 'Medium').length,
    Low: issues.filter((i) => i.severity === 'Low').length,
  };

  function toggleResolved(id: string) {
    setResolved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <AppShell>
      <PageHeader
        title="Code Review"
        description="AI-detected issues across web-platform with suggested fixes."
        actions={
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90">
            Re-run analysis
          </Button>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {(['Critical', 'High', 'Medium', 'Low'] as Severity[]).map((sev) => {
          const cfg = severityConfig[sev];
          return (
            <Card key={sev} className={cn('border bg-card/50', cfg.border)}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', cfg.bg, cfg.text)}>
                  <cfg.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{counts[sev]}</p>
                  <p className="text-xs text-muted-foreground">{sev}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border bg-card/50 text-muted-foreground hover:text-foreground'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search issues..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 bg-card pl-9"
          />
        </div>
      </div>

      {/* Issue cards */}
      <div className="mt-4 space-y-3">
        {filtered.length === 0 && (
          <Card className="border-border/60 bg-card/50">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <CheckCircle2 className="mb-3 h-10 w-10 text-emerald-500" />
              <p className="font-medium">No issues found</p>
              <p className="text-sm text-muted-foreground">Your code looks clean for this filter.</p>
            </CardContent>
          </Card>
        )}
        {filtered.map((issue, i) => {
          const cfg = severityConfig[issue.severity];
          const isResolved = resolved.has(issue.id);
          return (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className={cn('border bg-card/50 transition-opacity', cfg.border, isResolved && 'opacity-50')}>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold', cfg.badge)}>
                          <cfg.icon className="h-3 w-3" />
                          {issue.severity}
                        </span>
                        <Badge variant="outline" className="text-[10px]">{issue.category}</Badge>
                        {isResolved && (
                          <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-500">
                            <CheckCircle2 className="mr-1 h-3 w-3" /> Resolved
                          </Badge>
                        )}
                      </div>
                      <h3 className="mt-2 font-semibold">{issue.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{issue.description}</p>

                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <FileCode className="h-3.5 w-3.5" />
                        <code className="rounded bg-muted px-1.5 py-0.5">{issue.file}:{issue.line}</code>
                      </div>

                      <div className="mt-3 rounded-lg border border-border/60 bg-background/40 p-3">
                        <p className="text-xs font-semibold text-emerald-500">Suggested fix</p>
                        <p className="mt-1 text-sm text-muted-foreground">{issue.fix}</p>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Button variant="outline" size="sm">
                        View code
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant={isResolved ? 'secondary' : 'default'}
                        size="sm"
                        onClick={() => toggleResolved(issue.id)}
                      >
                        {isResolved ? 'Undo' : 'Resolve'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </AppShell>
  );
}
