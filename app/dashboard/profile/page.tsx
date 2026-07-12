'use client';

import {
  Star,
  GitBranch,
  MessageSquare,
  FileText,
  Bug,
  Github,
  Mail,
  MapPin,
  Calendar,
  Pencil,
  Crown,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RepositoryCard } from '@/components/repository-card';
import { repositories } from '@/lib/data';

const stats = [
  { label: 'Repositories', value: '24', icon: GitBranch, accent: 'from-blue-500 to-cyan-500' },
  { label: 'AI Chats', value: '1,284', icon: MessageSquare, accent: 'from-indigo-500 to-purple-500' },
  { label: 'Reports', value: '96', icon: FileText, accent: 'from-emerald-500 to-teal-500' },
  { label: 'Bugs Found', value: '342', icon: Bug, accent: 'from-amber-500 to-orange-500' },
];

export default function ProfilePage() {
  return (
    <AppShell>
      <PageHeader title="Profile" description="Your account details and activity overview." />

      {/* Profile header card */}
      <Card className="mb-6 overflow-hidden border-border/60 bg-card/50">
        <div className="h-32 bg-gradient-to-r from-blue-600/30 via-indigo-600/20 to-purple-600/30" />
        <CardContent className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <Avatar className="h-24 w-24 border-4 border-card">
                <AvatarImage src="https://i.pravatar.cc/200?img=8" alt="Alex Morgan" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Alex Morgan</h2>
                  <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Crown className="h-3 w-3" /> Pro
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Senior Software Engineer</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit profile
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" /> alex@devpilot.ai
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Github className="h-4 w-4" /> github.com/alexmorgan
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> San Francisco, CA
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" /> Joined Jan 2024
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity statistics */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="border-border/60 bg-card/50">
            <CardContent className="p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white ${s.accent}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-semibold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subscription */}
      <Card className="mb-6 border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Subscription</CardTitle>
          <CardDescription>Your current plan and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">Pro Plan</p>
                <p className="text-sm text-muted-foreground">$24/month · Renews on Jul 28, 2024</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs text-muted-foreground">AI Chats</p>
                <p className="text-sm font-medium">Unlimited</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Repositories</p>
                <p className="text-sm font-medium">Unlimited</p>
              </div>
              <Button variant="outline" size="sm">Manage plan</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent repositories */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent repositories</h2>
        <span className="text-sm text-muted-foreground">{repositories.length} total</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repositories.slice(0, 3).map((r) => (
          <RepositoryCard key={r.name} repo={r} />
        ))}
      </div>
    </AppShell>
  );
}
