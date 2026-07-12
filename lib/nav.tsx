import {
  LayoutDashboard,
  GitBranch,
  MessageSquare,
  ShieldCheck,
  FileText,
  TestTube,
  BarChart3,
  Activity,
  Settings,
  User,
} from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

export const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Repositories', href: '/dashboard/repositories', icon: GitBranch },
  { title: 'AI Chat', href: '/dashboard/chat', icon: MessageSquare },
  { title: 'Code Review', href: '/dashboard/review', icon: ShieldCheck },
  { title: 'Documentation', href: '/dashboard/docs', icon: FileText },
  { title: 'Unit Tests', href: '/dashboard/tests', icon: TestTube },
  { title: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
  { title: 'Analytics', href: '/dashboard/analytics', icon: Activity },
];

export const bottomNavItems: NavItem[] = [
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
  { title: 'Profile', href: '/dashboard/profile', icon: User },
];
