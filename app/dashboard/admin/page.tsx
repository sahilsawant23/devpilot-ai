'use client';

import * as React from 'react';
import {
  Shield,
  Crown,
  UserCheck,
  Eye,
  Code2,
  Lock,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Users,
  Key,
  Activity,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'DEVELOPER' | 'VIEWER';
  createdAt?: string;
  _count?: {
    repositories: number;
    apiKeys: number;
  };
}

export default function AdminConsolePage() {
  const [users, setUsers] = React.useState<UserData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        if (data.users) {
          setUsers(data.users);
        }
      }
    } catch {
      toast.error('Network error fetching users');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        toast.success(`Updated role for ${data.user.name} to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u))
        );
      } else {
        toast.error(data.error || 'Failed to update user role');
      }
    } catch {
      toast.error('Network error updating role');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    total: users.length,
    admins: users.filter((u) => u.role === 'ADMIN').length,
    devs: users.filter((u) => u.role === 'DEVELOPER').length,
    viewers: users.filter((u) => u.role === 'VIEWER').length,
  };

  return (
    <AppShell>
      <PageHeader
        title="Admin Control Console"
        description="Manage workspace users, assign Role-Based Access Control (RBAC), and review security audit logs."
        actions={
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </Button>
        }
      />

      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/60 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{counts.total}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Active workspace members</p>
            </CardContent>
          </Card>

          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-amber-500">
                Administrators
              </CardTitle>
              <Crown className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{counts.admins}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Full system authority</p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-blue-500">
                Developers
              </CardTitle>
              <Code2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{counts.devs}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Code, agent & test access</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
                Viewers
              </CardTitle>
              <Eye className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">{counts.viewers}</div>
              <p className="text-[11px] text-muted-foreground mt-1">Read-only repository access</p>
            </CardContent>
          </Card>
        </div>

        {/* User Management Section */}
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-primary" />
                Workspace User & Role Directory
              </CardTitle>
              <CardDescription>Assign or elevate user roles dynamically across the organization.</CardDescription>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search user, email or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-y border-border/60 bg-muted/30 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Current Role</th>
                    <th className="px-6 py-3">Repositories</th>
                    <th className="px-6 py-3 text-right">Role Assignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-muted-foreground">
                        {loading ? 'Loading users...' : 'No users found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-accent/20 transition-colors">
                        <td className="px-6 py-4 font-medium">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs uppercase">
                              {u.name.slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{u.name}</p>
                              <p className="text-[10px] text-muted-foreground font-mono">ID: {u.id.slice(0, 8)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{u.email}</td>
                        <td className="px-6 py-4">
                          <Badge
                            className={cn(
                              'text-xs font-semibold uppercase tracking-wider',
                              u.role === 'ADMIN' && 'bg-amber-500/15 text-amber-400 border-amber-500/30',
                              u.role === 'DEVELOPER' && 'bg-blue-500/15 text-blue-400 border-blue-500/30',
                              u.role === 'VIEWER' && 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            )}
                          >
                            {u.role === 'ADMIN' && <Crown className="mr-1 h-3 w-3" />}
                            {u.role === 'DEVELOPER' && <Code2 className="mr-1 h-3 w-3" />}
                            {u.role === 'VIEWER' && <Eye className="mr-1 h-3 w-3" />}
                            {u.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono">
                          {u._count?.repositories ?? 1} repos | {u._count?.apiKeys ?? 1} API keys
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Select
                            value={u.role}
                            onValueChange={(val) => updateRole(u.id, val)}
                            disabled={updatingId === u.id}
                          >
                            <SelectTrigger className="w-36 h-8 text-xs font-medium ml-auto">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ADMIN">👑 Admin</SelectItem>
                              <SelectItem value="DEVELOPER">💻 Developer</SelectItem>
                              <SelectItem value="VIEWER">👁️ Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Role Matrix Card */}
        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4.5 w-4.5 text-primary" />
              Role Permission Matrix
            </CardTitle>
            <CardDescription>Feature capabilities defined per access level.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-amber-400 flex items-center gap-1.5 text-sm">
                    <Crown className="h-4 w-4" /> Admin Role
                  </h4>
                  <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-400">Full Access</Badge>
                </div>
                <ul className="text-xs space-y-1.5 text-muted-foreground list-disc list-inside">
                  <li>Promote / demote user roles</li>
                  <li>Revoke workspace API keys</li>
                  <li>Full code & agent execution</li>
                  <li>System audit log inspection</li>
                </ul>
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-blue-400 flex items-center gap-1.5 text-sm">
                    <Code2 className="h-4 w-4" /> Developer Role
                  </h4>
                  <Badge variant="outline" className="text-[10px] border-blue-500/40 text-blue-400">Standard</Badge>
                </div>
                <ul className="text-xs space-y-1.5 text-muted-foreground list-disc list-inside">
                  <li>Repository analysis & AI review</li>
                  <li>Generate Unit test suites</li>
                  <li>Deploy AI agents</li>
                  <li>Create personal API keys</li>
                </ul>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-emerald-400 flex items-center gap-1.5 text-sm">
                    <Eye className="h-4 w-4" /> Viewer Role
                  </h4>
                  <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400">Read Only</Badge>
                </div>
                <ul className="text-xs space-y-1.5 text-muted-foreground list-disc list-inside">
                  <li>View repository health dashboard</li>
                  <li>Explore Code Visualizer graph</li>
                  <li>Read generated documentation</li>
                  <li>View security reports</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
