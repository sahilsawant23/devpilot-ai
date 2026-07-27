'use client';

import * as React from 'react';
import {
  Palette,
  Bell,
  Globe,
  Github,
  Key,
  Shield,
  Trash2,
  Check,
  Sun,
  Moon,
  Monitor,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Users,
  Webhook,
  ShieldCheck,
  Plus,
  Send,
  Download,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { exportToCSV } from '@/lib/export-utils';

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border/60 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

interface WebhookItem {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  createdAt: string;
}

const mockAuditLogs = [
  { id: '1', event: 'User Login', user: 'sahil@devpilot.ai', ip: '192.168.1.45', location: 'Mumbai, IN', date: '2026-07-27 22:15', status: 'SUCCESS' },
  { id: '2', event: 'API Key Created', user: 'sahil@devpilot.ai', ip: '192.168.1.45', location: 'Mumbai, IN', date: '2026-07-27 21:04', status: 'SUCCESS' },
  { id: '3', event: 'Role Promotion', user: 'admin@devpilot.ai', ip: '10.0.0.12', location: 'San Francisco, US', date: '2026-07-26 18:40', status: 'SUCCESS' },
  { id: '4', event: 'Failed Auth Attempt', user: 'unknown@hacker.io', ip: '185.220.101.5', location: 'Frankfurt, DE', date: '2026-07-25 04:12', status: 'WARN' },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: false,
    weekly: true,
    security: true,
  });

  // Workspace Settings
  const [workspaceName, setWorkspaceName] = React.useState('DevPilot Production');
  const [aiModel, setAiModel] = React.useState('gemini-1.5-pro');
  const [autoScan, setAutoScan] = React.useState(true);

  // Webhooks
  const [webhooksList, setWebhooksList] = React.useState<WebhookItem[]>([]);
  const [webhookDialogOpen, setWebhookDialogOpen] = React.useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = React.useState('');
  const [selectedEvents, setSelectedEvents] = React.useState<string[]>(['vulnerability.detected']);
  const [testingWebhookId, setTestingWebhookId] = React.useState<string | null>(null);

  // API Keys
  const [apiKeysList, setApiKeysList] = React.useState<Array<{ id: string; name: string; key: string; createdAt?: string }>>([]);
  const [visibleKeyIds, setVisibleKeyIds] = React.useState<Record<string, boolean>>({});

  const fetchWebhooks = React.useCallback(async () => {
    try {
      const res = await fetch('/api/webhooks');
      if (res.ok) {
        const data = await res.json();
        setWebhooksList(data.webhooks ?? []);
      }
    } catch {
      // Keep silent
    }
  }, []);

  const fetchApiKeys = React.useCallback(async () => {
    try {
      const res = await fetch('/api/apikeys');
      if (res.ok) {
        const data = await res.json();
        if (data.keys) setApiKeysList(data.keys);
      }
    } catch {
      // Keep silent
    }
  }, []);

  React.useEffect(() => {
    fetchApiKeys();
    fetchWebhooks();
  }, [fetchApiKeys, fetchWebhooks]);

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeyIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const revokeKey = async (id: string) => {
    try {
      const res = await fetch(`/api/apikeys?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('API key revoked');
        fetchApiKeys();
      } else {
        toast.error('Failed to revoke API key');
      }
    } catch {
      toast.error('Network error revoking key');
    }
  };

  const handleCreateWebhook = async () => {
    if (!newWebhookUrl.trim()) {
      toast.error('Please enter a valid HTTP/HTTPS Webhook URL');
      return;
    }
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newWebhookUrl, events: selectedEvents }),
      });
      if (res.ok) {
        toast.success('Webhook registered successfully!');
        setWebhookDialogOpen(false);
        setNewWebhookUrl('');
        fetchWebhooks();
      } else {
        toast.error('Failed to add webhook');
      }
    } catch {
      toast.error('Network error adding webhook');
    }
  };

  const handleTestWebhook = async (id: string) => {
    setTestingWebhookId(id);
    try {
      const res = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ping', id }),
      });
      if (res.ok) {
        toast.success('Webhook ping payload delivered (200 OK)');
      } else {
        toast.error('Webhook ping failed');
      }
    } catch {
      toast.error('Network error testing webhook');
    } finally {
      setTestingWebhookId(null);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      const res = await fetch(`/api/webhooks?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Webhook deleted');
        fetchWebhooks();
      }
    } catch {
      toast.error('Failed to delete webhook');
    }
  };

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <AppShell>
      <PageHeader title="Settings & Workspace Preferences" description="Manage your team workspace, theme, webhooks, API tokens, and security policies." />

      <Tabs defaultValue="workspace" className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <TabsList className="flex h-auto flex-col items-stretch gap-1 bg-transparent p-0">
          <TabsTrigger value="workspace" className="justify-start data-[state=active]:bg-primary/10">
            <Users className="mr-2 h-4 w-4" /> Workspace & AI
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="justify-start data-[state=active]:bg-primary/10">
            <Webhook className="mr-2 h-4 w-4" /> Webhooks
          </TabsTrigger>
          <TabsTrigger value="appearance" className="justify-start data-[state=active]:bg-primary/10">
            <Palette className="mr-2 h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="justify-start data-[state=active]:bg-primary/10">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="justify-start data-[state=active]:bg-primary/10">
            <Key className="mr-2 h-4 w-4" /> API Keys
          </TabsTrigger>
          <TabsTrigger value="security" className="justify-start data-[state=active]:bg-primary/10">
            <ShieldCheck className="mr-2 h-4 w-4" /> Security Audit
          </TabsTrigger>
        </TabsList>

        <div>
          {/* Workspace & AI */}
          <TabsContent value="workspace" className="mt-0 space-y-4">
            <Card className="border-border/60 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">Team Workspace</CardTitle>
                <CardDescription>Configure workspace settings and AI model defaults</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Row title="Workspace Name" description="Identify your organization or team">
                  <Input
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="sm:w-64"
                  />
                </Row>

                <Row title="Default AI Engine" description="Primary LLM used for code review & agents">
                  <Select value={aiModel} onValueChange={setAiModel}>
                    <SelectTrigger className="sm:w-64">
                      <Sparkles className="mr-2 h-4 w-4 text-purple-500" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (Recommended)</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o (High Accuracy)</SelectItem>
                      <SelectItem value="claude-3-5">Claude 3.5 Sonnet</SelectItem>
                      <SelectItem value="local-llm">DevPilot Self-Hosted LLM</SelectItem>
                    </SelectContent>
                  </Select>
                </Row>

                <Row title="Automated PR Security Scanning" description="Scan every pull request automatically before merge">
                  <Switch checked={autoScan} onCheckedChange={setAutoScan} />
                </Row>

                <div className="flex justify-end pt-2">
                  <Button size="sm" onClick={() => toast.success('Workspace preferences saved')}>
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhooks */}
          <TabsContent value="webhooks" className="mt-0 space-y-4">
            <Card className="border-border/60 bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Webhook Endpoints</CardTitle>
                  <CardDescription>Receive real-time HTTP callbacks for security alerts and agent completions.</CardDescription>
                </div>
                <Dialog open={webhookDialogOpen} onOpenChange={setWebhookDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-primary text-primary-foreground">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Webhook
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Register New Webhook</DialogTitle>
                      <DialogDescription>
                        DevPilot will send POST payloads with HMAC signatures for selected events.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Payload URL</label>
                        <Input
                          placeholder="https://api.yourdomain.com/devpilot-webhook"
                          value={newWebhookUrl}
                          onChange={(e) => setNewWebhookUrl(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-muted-foreground uppercase">Event Subscriptions</label>
                        <div className="space-y-2 text-xs">
                          {['vulnerability.detected', 'agent.completed', 'docs.generated', 'report.ready'].map((evt) => (
                            <label key={evt} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedEvents.includes(evt)}
                                onChange={(e) => {
                                  if (e.target.checked) setSelectedEvents([...selectedEvents, evt]);
                                  else setSelectedEvents(selectedEvents.filter((item) => item !== evt));
                                }}
                                className="rounded border-border text-primary"
                              />
                              <code>{evt}</code>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setWebhookDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleCreateWebhook}>Save Webhook</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {webhooksList.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                    No webhooks configured. Click &quot;Add Webhook&quot; above to connect external services like Slack or GitHub.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {webhooksList.map((wh) => (
                      <div key={wh.id} className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            <p className="font-mono text-xs font-semibold truncate">{wh.url}</p>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {wh.events.map((e) => (
                              <span key={e} className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                                {e}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestWebhook(wh.id)}
                            disabled={testingWebhookId === wh.id}
                          >
                            {testingWebhookId === wh.id ? (
                              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Send className="mr-1 h-3.5 w-3.5" />
                            )}
                            Test Ping
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteWebhook(wh.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance" className="mt-0 space-y-4">
            <Card className="border-border/60 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">Theme</CardTitle>
                <CardDescription>Choose how DevPilot looks to you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                        theme === t.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      )}
                    >
                      <t.icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{t.label}</span>
                      {theme === t.id && <Check className="h-3.5 w-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="mt-0">
            <Card className="border-border/60 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription>Choose what updates you want to receive</CardDescription>
              </CardHeader>
              <CardContent>
                <Row title="Email notifications" description="Analysis complete, reports, and summaries">
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(v) => setNotifications((n) => ({ ...n, email: v }))}
                  />
                </Row>
                <Row title="Push notifications" description="Real-time alerts in your browser">
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(v) => setNotifications((n) => ({ ...n, push: v }))}
                  />
                </Row>
                <Row title="Weekly digest" description="A summary of your activity every Monday">
                  <Switch
                    checked={notifications.weekly}
                    onCheckedChange={(v) => setNotifications((n) => ({ ...n, weekly: v }))}
                  />
                </Row>
                <Row title="Security alerts" description="Critical vulnerabilities and access changes">
                  <Switch
                    checked={notifications.security}
                    onCheckedChange={(v) => setNotifications((n) => ({ ...n, security: v }))}
                  />
                </Row>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Keys */}
          <TabsContent value="api" className="mt-0 space-y-4">
            <Card className="border-border/60 bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">API Keys & Tokens</CardTitle>
                  <CardDescription>Use DevPilot API keys to integrate with your CLI, GitHub Actions, and custom pipelines.</CardDescription>
                </div>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/apikeys', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name: `CLI Key ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` }),
                      });
                      const data = await res.json();
                      if (data.key) {
                        toast.success('New API Key generated!');
                        fetchApiKeys();
                      } else {
                        toast.error(data.error || 'Failed to create key');
                      }
                    } catch {
                      toast.error('Network error creating API key');
                    }
                  }}
                >
                  <Key className="mr-2 h-4 w-4" />
                  Generate New Key
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {apiKeysList.length === 0 ? (
                    <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                      No active API keys found. Click &quot;Generate New Key&quot; above to create your first API key.
                    </div>
                  ) : (
                    apiKeysList.map((k) => (
                      <div key={k.id} className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm font-medium">{k.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {visibleKeyIds[k.id] ? k.key : `${k.key.slice(0, 10)}${'•'.repeat(20)}`}
                          </p>
                          {k.createdAt && (
                            <p className="mt-1 text-[10px] text-muted-foreground">Created: {new Date(k.createdAt).toLocaleDateString()}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleKeyVisibility(k.id)}
                            className="rounded-lg border p-2 text-muted-foreground hover:text-foreground"
                            aria-label="Toggle visibility"
                          >
                            {visibleKeyIds[k.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(k.key);
                              toast.success('API key copied to clipboard');
                            }}
                          >
                            <Copy className="mr-2 h-3.5 w-3.5" /> Copy
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => revokeKey(k.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Audit Log */}
          <TabsContent value="security" className="mt-0 space-y-4">
            <Card className="border-border/60 bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Security Audit Log</CardTitle>
                  <CardDescription>View authentication attempts, privilege modifications, and system events.</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    exportToCSV('security_audit_logs', mockAuditLogs);
                    toast.success('Exported security log CSV');
                  }}
                >
                  <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold uppercase">
                        <th className="py-3 px-2">Event</th>
                        <th className="py-3 px-2">User</th>
                        <th className="py-3 px-2">IP Address</th>
                        <th className="py-3 px-2">Location</th>
                        <th className="py-3 px-2">Timestamp</th>
                        <th className="py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {mockAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-accent/40">
                          <td className="py-3 px-2 font-medium">{log.event}</td>
                          <td className="py-3 px-2 text-muted-foreground">{log.user}</td>
                          <td className="py-3 px-2 font-mono">{log.ip}</td>
                          <td className="py-3 px-2 text-muted-foreground">{log.location}</td>
                          <td className="py-3 px-2 text-muted-foreground">{log.date}</td>
                          <td className="py-3 px-2">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                log.status === 'SUCCESS'
                                  ? 'bg-emerald-500/15 text-emerald-500'
                                  : 'bg-amber-500/15 text-amber-500'
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-500/30 bg-red-500/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-red-500">
                  <AlertTriangle className="h-4 w-4" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Irreversible and destructive actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Row title="Delete account" description="Permanently delete your account and all data">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove all repositories, chats, and reports.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => toast.error('Account deletion is disabled in the demo')}
                        >
                          Delete forever
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </Row>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </AppShell>
  );
}
