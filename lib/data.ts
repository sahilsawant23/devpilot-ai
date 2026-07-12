import {
  GitBranch,
  MessageSquare,
  FileText,
  Bug,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Activity,
  type LucideIcon,
} from 'lucide-react';

export type Stat = {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  accent: string;
};

export const dashboardStats: Stat[] = [
  {
    label: 'Total Repositories',
    value: '24',
    delta: '+3 this week',
    trend: 'up',
    icon: GitBranch,
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    label: 'AI Chats',
    value: '1,284',
    delta: '+18.2%',
    trend: 'up',
    icon: MessageSquare,
    accent: 'from-indigo-500 to-purple-500',
  },
  {
    label: 'Reports Generated',
    value: '96',
    delta: '+12',
    trend: 'up',
    icon: FileText,
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    label: 'Bugs Detected',
    value: '342',
    delta: '-8.4%',
    trend: 'down',
    icon: Bug,
    accent: 'from-amber-500 to-orange-500',
  },
  {
    label: 'Docs Created',
    value: '178',
    delta: '+24',
    trend: 'up',
    icon: BookOpen,
    accent: 'from-pink-500 to-rose-500',
  },
];

export const weeklyActivity = [
  { day: 'Mon', chats: 42, reviews: 18, docs: 12 },
  { day: 'Tue', chats: 56, reviews: 24, docs: 15 },
  { day: 'Wed', chats: 48, reviews: 30, docs: 20 },
  { day: 'Thu', chats: 72, reviews: 28, docs: 18 },
  { day: 'Fri', chats: 84, reviews: 36, docs: 24 },
  { day: 'Sat', chats: 38, reviews: 14, docs: 8 },
  { day: 'Sun', chats: 22, reviews: 10, docs: 5 },
];

export const languageDistribution = [
  { name: 'TypeScript', value: 38, color: 'hsl(246 78% 64%)' },
  { name: 'JavaScript', value: 24, color: 'hsl(50 90% 54%)' },
  { name: 'Python', value: 18, color: 'hsl(190 90% 54%)' },
  { name: 'Go', value: 12, color: 'hsl(180 70% 50%)' },
  { name: 'Rust', value: 8, color: 'hsl(20 80% 54%)' },
];

export const aiUsage = [
  { name: 'Jan', requests: 320, tokens: 1200 },
  { name: 'Feb', requests: 480, tokens: 1800 },
  { name: 'Mar', requests: 640, tokens: 2400 },
  { name: 'Apr', requests: 820, tokens: 3100 },
  { name: 'May', requests: 1100, tokens: 4200 },
  { name: 'Jun', requests: 1380, tokens: 5100 },
];

export const recentActivity = [
  {
    id: '1',
    type: 'Chat',
    title: 'Explained authentication flow in auth-service',
    repo: 'web-platform',
    time: '2 minutes ago',
    icon: MessageSquare,
  },
  {
    id: '2',
    type: 'Review',
    title: 'Detected 3 critical issues in payment gateway',
    repo: 'billing-api',
    time: '18 minutes ago',
    icon: Bug,
  },
  {
    id: '3',
    type: 'Docs',
    title: 'Generated README for analytics-engine',
    repo: 'analytics-engine',
    time: '1 hour ago',
    icon: BookOpen,
  },
  {
    id: '4',
    type: 'Tests',
    title: 'Created 42 unit tests for user-service',
    repo: 'user-service',
    time: '3 hours ago',
    icon: FileText,
  },
  {
    id: '5',
    type: 'Analysis',
    title: 'Repository health score: 92/100',
    repo: 'design-system',
    time: '5 hours ago',
    icon: Activity,
  },
];

export const repositories = [
  {
    name: 'web-platform',
    description: 'Customer-facing web application built with Next.js',
    language: 'TypeScript',
    languageColor: 'hsl(246 78% 64%)',
    size: '24.6 MB',
    stars: 124,
    lastUpdated: '2 hours ago',
    status: 'Analyzed',
    health: 92,
  },
  {
    name: 'billing-api',
    description: 'Stripe-powered billing microservice',
    language: 'Go',
    languageColor: 'hsl(180 70% 50%)',
    size: '8.2 MB',
    stars: 48,
    lastUpdated: '1 day ago',
    status: 'Needs Review',
    health: 76,
  },
  {
    name: 'analytics-engine',
    description: 'Real-time event processing pipeline',
    language: 'Python',
    languageColor: 'hsl(190 90% 54%)',
    size: '18.4 MB',
    stars: 89,
    lastUpdated: '3 days ago',
    status: 'Analyzed',
    health: 88,
  },
  {
    name: 'user-service',
    description: 'Authentication and identity service',
    language: 'TypeScript',
    languageColor: 'hsl(246 78% 64%)',
    size: '12.1 MB',
    stars: 67,
    lastUpdated: '5 days ago',
    status: 'Analyzed',
    health: 81,
  },
  {
    name: 'design-system',
    description: 'Shared component library and design tokens',
    language: 'TypeScript',
    languageColor: 'hsl(246 78% 64%)',
    size: '6.8 MB',
    stars: 156,
    lastUpdated: '1 week ago',
    status: 'Analyzed',
    health: 95,
  },
  {
    name: 'mobile-app',
    description: 'iOS and Android React Native client',
    language: 'JavaScript',
    languageColor: 'hsl(50 90% 54%)',
    size: '32.4 MB',
    stars: 72,
    lastUpdated: '2 weeks ago',
    status: 'Pending',
    health: 64,
  },
];

export const trendUp = TrendingUp;
export const trendDown = TrendingDown;
