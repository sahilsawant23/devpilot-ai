'use client';

import * as React from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  GitBranch,
  Star,
  FileCode,
  Shield,
  Zap,
  BookOpen,
  Wrench,
  Folder,
  FolderOpen,
  File,
  ChevronRight,
  ChevronDown,
  Download,
  MessageSquare,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn, downloadFile } from '@/lib/utils';
import { toast } from 'sonner';

const scores = [
  { label: 'Project Health', value: 92, color: 'hsl(142 71% 45%)', icon: GitBranch },
  { label: 'Security', value: 86, color: 'hsl(246 78% 64%)', icon: Shield },
  { label: 'Performance', value: 78, color: 'hsl(190 90% 54%)', icon: Zap },
  { label: 'Documentation', value: 64, color: 'hsl(38 92% 54%)', icon: BookOpen },
  { label: 'Maintainability', value: 88, color: 'hsl(280 70% 64%)', icon: Wrench },
];

const techStack = [
  { name: 'Next.js', version: '13.5', category: 'Framework', color: 'hsl(0 0% 100%)' },
  { name: 'React', version: '18.2', category: 'Library', color: 'hsl(190 90% 54%)' },
  { name: 'TypeScript', version: '5.2', category: 'Language', color: 'hsl(246 78% 64%)' },
  { name: 'Tailwind CSS', version: '3.3', category: 'Styling', color: 'hsl(180 70% 50%)' },
  { name: 'Prisma', version: '5.4', category: 'ORM', color: 'hsl(270 70% 60%)' },
  { name: 'Vitest', version: '0.34', category: 'Testing', color: 'hsl(140 70% 50%)' },
  { name: 'ESLint', version: '8.49', category: 'Tooling', color: 'hsl(260 70% 60%)' },
  { name: 'Docker', version: '24.0', category: 'DevOps', color: 'hsl(200 70% 55%)' },
];

type FileNode = {
  name: string;
  type: 'folder' | 'file';
  children?: FileNode[];
  size?: string;
};

const fileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'Button.tsx', type: 'file', size: '2.4 KB' },
          { name: 'Card.tsx', type: 'file', size: '1.8 KB' },
          { name: 'Sidebar.tsx', type: 'file', size: '4.2 KB' },
        ],
      },
      {
        name: 'lib',
        type: 'folder',
        children: [
          { name: 'utils.ts', type: 'file', size: '0.8 KB' },
          { name: 'auth.ts', type: 'file', size: '3.1 KB' },
        ],
      },
      {
        name: 'app',
        type: 'folder',
        children: [
          { name: 'layout.tsx', type: 'file', size: '1.2 KB' },
          { name: 'page.tsx', type: 'file', size: '5.6 KB' },
        ],
      },
      { name: 'index.ts', type: 'file', size: '0.4 KB' },
    ],
  },
  {
    name: 'public',
    type: 'folder',
    children: [
      { name: 'favicon.ico', type: 'file', size: '12 KB' },
      { name: 'logo.svg', type: 'file', size: '3.4 KB' },
    ],
  },
  { name: 'package.json', type: 'file', size: '1.6 KB' },
  { name: 'tsconfig.json', type: 'file', size: '0.6 KB' },
  { name: 'README.md', type: 'file', size: '4.2 KB' },
];

function FileTreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [open, setOpen] = React.useState(depth < 1);
  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-sm hover:bg-accent/50"
          style={{ paddingLeft: depth * 16 + 8 }}
        >
          {open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
          {open ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-muted-foreground" />}
          <span>{node.name}</span>
        </button>
        {open && node.children && (
          <div>
            {node.children.map((c) => (
              <FileTreeNode key={c.name} node={c} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div
      className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent/50"
      style={{ paddingLeft: depth * 16 + 24 }}
    >
      <File className="h-3.5 w-3.5" />
      <span className="flex-1">{node.name}</span>
      <span className="text-xs text-muted-foreground/70">{node.size}</span>
    </div>
  );
}

function ScoreRadial({ value, color, label, icon: Icon }: { value: number; color: string; label: string; icon: React.ElementType }) {
  return (
    <Card className="border-border/60 bg-card/50">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="relative h-20 w-20 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value }]} startAngle={90} endAngle={-270}>
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar background={{ fill: 'hsl(var(--muted))' }} dataKey="value" cornerRadius={10} fill={color} />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
            {value}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Icon className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
          </div>
          <p className="mt-1 text-sm font-medium">
            {value >= 85 ? 'Excellent' : value >= 70 ? 'Good' : 'Needs attention'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalysisPage() {
  return (
    <AppShell>
      <PageHeader
        title="Repository Analysis"
        description="web-platform · Analyzed 2 hours ago"
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat about this
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const report = `DevPilot AI - Repository Analysis Report
============================================
Repository: web-platform
Generated: ${new Date().toISOString()}

Scores:
${scores.map((s) => `- ${s.label}: ${s.value}/100`).join('\n')}

Technology Stack:
${techStack.map((t) => `- ${t.name} v${t.version} (${t.category})`).join('\n')}
`;
                downloadFile('web-platform-analysis.txt', report);
                toast.success('Report exported');
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Export report
            </Button>
          </>
        }
      />

      {/* Repo summary bar */}
      <Card className="mb-6 border-border/60 bg-card/50">
        <CardContent className="flex flex-wrap items-center gap-6 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              <GitBranch className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">web-platform</h2>
              <p className="text-xs text-muted-foreground">Customer-facing web application</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <FileCode className="h-4 w-4" /> 248 files
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Star className="h-4 w-4" /> 124 stars
            </span>
            <span className="text-muted-foreground">24.6 MB</span>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge>Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Score cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {scores.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <ScoreRadial {...s} />
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* File tree */}
        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">File Structure</CardTitle>
            <CardDescription>Directory and file organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border/60 bg-background/40 p-2 scrollbar-thin">
              {fileTree.map((n) => (
                <FileTreeNode key={n.name} node={n} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tech stack */}
        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Technology Stack</CardTitle>
            <CardDescription>Detected dependencies and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {techStack.map((t) => (
                <div
                  key={t.name}
                  className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3 transition-colors hover:border-primary/40"
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold"
                    style={{ backgroundColor: `${t.color}20`, color: t.color }}
                  >
                    {t.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">v{t.version}</p>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{t.category}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed score breakdown */}
      <Card className="mt-4 border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Score Breakdown</CardTitle>
          <CardDescription>Detailed metrics with recommendations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {scores.map((s) => (
            <div key={s.label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium">
                  <s.icon className="h-4 w-4 text-muted-foreground" />
                  {s.label}
                </span>
                <span className="text-muted-foreground">{s.value}/100</span>
              </div>
              <Progress
                value={s.value}
                className={cn('h-2')}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
