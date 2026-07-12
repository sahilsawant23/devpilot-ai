'use client';

import {
  AreaChart,
  Area,
  LineChart,
  Line,
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
import { motion } from 'framer-motion';
import {
  GitBranch,
  MessageSquare,
  Cpu,
  TrendingUp,
  Activity,
  Code,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const tooltipStyle = {
  backgroundColor: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '0.75rem',
  color: 'hsl(var(--popover-foreground))',
  fontSize: '12px',
};

const reposAnalyzed = [
  { name: 'Jan', value: 4 }, { name: 'Feb', value: 7 }, { name: 'Mar', value: 10 },
  { name: 'Apr', value: 14 }, { name: 'May', value: 18 }, { name: 'Jun', value: 24 },
];

const aiRequests = [
  { name: 'Mon', requests: 320, responses: 318 },
  { name: 'Tue', requests: 480, responses: 475 },
  { name: 'Wed', requests: 410, responses: 408 },
  { name: 'Thu', requests: 620, responses: 615 },
  { name: 'Fri', requests: 780, responses: 772 },
  { name: 'Sat', requests: 240, responses: 238 },
  { name: 'Sun', requests: 180, responses: 178 },
];

const languagesUsed = [
  { name: 'TypeScript', value: 38, color: 'hsl(246 78% 64%)' },
  { name: 'JavaScript', value: 24, color: 'hsl(50 90% 54%)' },
  { name: 'Python', value: 18, color: 'hsl(190 90% 54%)' },
  { name: 'Go', value: 12, color: 'hsl(180 70% 50%)' },
  { name: 'Rust', value: 8, color: 'hsl(20 80% 54%)' },
];

const dailyUsage = [
  { hour: '00', usage: 12 }, { hour: '04', usage: 8 },
  { hour: '08', usage: 64 }, { hour: '12', usage: 92 },
  { hour: '16', usage: 78 }, { hour: '20', usage: 34 },
];

const monthlyActivity = [
  { name: 'Week 1', chats: 120, reviews: 45, docs: 32 },
  { name: 'Week 2', chats: 180, reviews: 62, docs: 48 },
  { name: 'Week 3', chats: 210, reviews: 78, docs: 56 },
  { name: 'Week 4', chats: 248, reviews: 84, docs: 72 },
];

const perfTrends = [
  { name: 'Jan', score: 72 }, { name: 'Feb', score: 75 }, { name: 'Mar', score: 78 },
  { name: 'Apr', score: 82 }, { name: 'May', score: 85 }, { name: 'Jun', score: 89 },
];

const summary = [
  { label: 'Repositories Analyzed', value: '24', change: '+33%', icon: GitBranch, accent: 'from-blue-500 to-cyan-500' },
  { label: 'AI Requests', value: '12.4K', change: '+18%', icon: MessageSquare, accent: 'from-indigo-500 to-purple-500' },
  { label: 'Tokens Consumed', value: '4.2M', change: '+22%', icon: Cpu, accent: 'from-emerald-500 to-teal-500' },
  { label: 'Avg Health Score', value: '89', change: '+5%', icon: TrendingUp, accent: 'from-amber-500 to-orange-500' },
];

export default function AnalyticsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Analytics"
        description="Usage insights and performance trends across your workspace."
        actions={
          <Select defaultValue="30d">
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="relative overflow-hidden border-border/60 bg-card/50">
              <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl ${s.accent}`} />
              <CardContent className="relative p-5">
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white ${s.accent}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-emerald-500">{s.change}</span>
                </div>
                <p className="mt-4 text-2xl font-semibold">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Repositories Analyzed</CardTitle>
            <CardDescription>Cumulative growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={reposAnalyzed} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gRepos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(246 78% 64%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(246 78% 64%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="value" stroke="hsl(246 78% 64%)" fill="url(#gRepos)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">AI Requests</CardTitle>
            <CardDescription>Daily requests vs. responses this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={aiRequests} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="requests" stroke="hsl(246 78% 64%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="responses" stroke="hsl(142 71% 45%)" strokeWidth={2} dot={false} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Languages Used</CardTitle>
            <CardDescription>Distribution across all repositories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={languagesUsed} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {languagesUsed.map((e) => (
                    <Cell key={e.name} fill={e.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Daily Usage</CardTitle>
            <CardDescription>Active hours throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={dailyUsage} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit=":00" />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="usage" fill="hsl(280 70% 64%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Monthly Activity</CardTitle>
            <CardDescription>Weekly breakdown by activity type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyActivity} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="chats" stackId="a" fill="hsl(246 78% 64%)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="reviews" stackId="a" fill="hsl(280 70% 64%)" />
                <Bar dataKey="docs" stackId="a" fill="hsl(142 71% 45%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Performance Trends</CardTitle>
            <CardDescription>Average repository health score over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={perfTrends} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="gPerf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142 71% 45%)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[60, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="score" stroke="hsl(142 71% 45%)" fill="url(#gPerf)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
