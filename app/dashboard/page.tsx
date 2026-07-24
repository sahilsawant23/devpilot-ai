'use client';

import * as React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { StatCard } from '@/components/stat-card';
import { AppShell } from '@/components/app-shell';
import { dashboardStats, weeklyActivity, languageDistribution, aiUsage, recentActivity } from '@/lib/data';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.75rem',
  color: 'hsl(var(--popover-foreground))',
  fontSize: '12px',
};

function ChartCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={`border-border/60 bg-card/50 ${className ?? ''}`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription className="mt-1">{description}</CardDescription>}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [userName, setUserName] = React.useState('Alex');

  React.useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user && data.user.name) {
            setUserName(data.user.name);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    }
    fetchUser();
  }, []);

  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${userName}. Here's what's happening across your workspace.`}
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/chat">
                <Sparkles className="mr-2 h-4 w-4" />
                New chat
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90">
              <Link href="/dashboard/repositories">Add repository</Link>
            </Button>
          </>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {dashboardStats.map((s, i) => (
          <StatCard key={s.label} stat={s} index={i} />
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="Weekly Activity"
          description="Chats, reviews, and docs over the last 7 days"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={weeklyActivity} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="gChats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(246 78% 64%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(246 78% 64%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gReviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(280 70% 64%)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(280 70% 64%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gDocs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="chats" stroke="hsl(246 78% 64%)" fill="url(#gChats)" strokeWidth={2} />
              <Area type="monotone" dataKey="reviews" stroke="hsl(280 70% 64%)" fill="url(#gReviews)" strokeWidth={2} />
              <Area type="monotone" dataKey="docs" stroke="hsl(142 71% 45%)" fill="url(#gDocs)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Language Distribution" description="Across all repositories">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={languageDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                {languageDistribution.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: 12 }}
                layout="vertical"
                align="right"
                verticalAlign="middle"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ChartCard
          title="AI Usage"
          description="Monthly AI requests and tokens consumed"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={aiUsage} margin={{ left: -20, right: 8, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="requests" fill="hsl(246 78% 64%)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="tokens" fill="hsl(190 90% 54%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Quick Actions" description="Jump back in">
          <div className="space-y-2">
            {[
              { label: 'Chat with a repository', href: '/dashboard/chat', icon: '💬' },
              { label: 'Review code for bugs', href: '/dashboard/review', icon: '🐞' },
              { label: 'Generate documentation', href: '/dashboard/docs', icon: '📄' },
              { label: 'Create unit tests', href: '/dashboard/tests', icon: '🧪' },
              { label: 'View analytics', href: '/dashboard/analytics', icon: '📊' },
            ].map((a) => (
              <Link
                key={a.label}
                href={a.href}
                className="group flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3 transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <span className="text-base">{a.icon}</span>
                  {a.label}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent activity */}
      <Card className="mt-4 border-border/60 bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription className="mt-1">Latest actions across your repositories</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/reports">View all</Link>
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          <div className="divide-y divide-border/60">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-center gap-4 px-6 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.repo}</p>
                </div>
                <Badge variant="secondary" className="hidden sm:inline-flex">{a.type}</Badge>
                <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
