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
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = React.useState({
    email: true,
    push: false,
    weekly: true,
    security: true,
  });
  const [connecting, setConnecting] = React.useState(false);
  const [apiKeysList, setApiKeysList] = React.useState<Array<{ id: string; name: string; key: string; createdAt?: string }>>([]);
  const [visibleKeyIds, setVisibleKeyIds] = React.useState<Record<string, boolean>>({});

  const fetchApiKeys = React.useCallback(async () => {
    try {
      const res = await fetch('/api/apikeys');
      if (res.ok) {
        const data = await res.json();
        if (data.keys) {
          setApiKeysList(data.keys);
        }
      }
    } catch {
      // Keep silent or default
    }
  }, []);

  React.useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

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

  const themes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <AppShell>
      <PageHeader title="Settings" description="Manage your account, preferences, and integrations." />

      <Tabs defaultValue="appearance" className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <TabsList className="flex h-auto flex-col items-stretch gap-1 bg-transparent p-0">
          <TabsTrigger value="appearance" className="justify-start data-[state=active]:bg-primary/10">
            <Palette className="mr-2 h-4 w-4" /> Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="justify-start data-[state=active]:bg-primary/10">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="justify-start data-[state=active]:bg-primary/10">
            <Github className="mr-2 h-4 w-4" /> Integrations
          </TabsTrigger>
          <TabsTrigger value="api" className="justify-start data-[state=active]:bg-primary/10">
            <Key className="mr-2 h-4 w-4" /> API
          </TabsTrigger>
          <TabsTrigger value="security" className="justify-start data-[state=active]:bg-primary/10">
            <Shield className="mr-2 h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        <div>
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

            <Card className="border-border/60 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">Language</CardTitle>
                <CardDescription>Interface language preference</CardDescription>
              </CardHeader>
              <CardContent>
                <Row title="Display language" description="Used for the UI text and notifications">
                  <Select defaultValue="en">
                    <SelectTrigger className="w-40">
                      <Globe className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectContent>
                  </Select>
                </Row>
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

          {/* Integrations */}
          <TabsContent value="integrations" className="mt-0">
            <Card className="border-border/60 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">Connected accounts</CardTitle>
                <CardDescription>Manage your third-party integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/10">
                      <Github className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">GitHub</p>
                      <p className="text-xs text-emerald-500">Connected as alexmorgan</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Manage</Button>
                    <Button variant="ghost" size="sm" className="text-destructive">Disconnect</Button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/10">
                      <Github className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">GitLab</p>
                      <p className="text-xs text-muted-foreground">Not connected</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setConnecting(true);
                      setTimeout(() => {
                        setConnecting(false);
                        toast.success('GitLab connected');
                      }, 1200);
                    }}
                    disabled={connecting}
                  >
                    {connecting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API */}
          <TabsContent value="api" className="mt-0">
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
                    } catch (e) {
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
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => revokeKey(k.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <Row title="Rate limit" description="Requests per minute on your plan">
                  <span className="text-sm font-medium">600 / min</span>
                </Row>
                <Row title="Webhook URL" description="Receive event callbacks for build & review triggers">
                  <Input placeholder="https://your-app.com/webhook" className="sm:w-72" />
                </Row>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security + Danger */}
          <TabsContent value="security" className="mt-0 space-y-4">
            <Card className="border-border/60 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">Security</CardTitle>
                <CardDescription>Keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Row title="Change password" description="Update your account password">
                  <Button variant="outline" size="sm">Change</Button>
                </Row>
                <Row title="Two-factor authentication" description="Add an extra layer of security">
                  <Button variant="outline" size="sm">Enable 2FA</Button>
                </Row>
                <Row title="Active sessions" description="2 active devices">
                  <Button variant="outline" size="sm">View sessions</Button>
                </Row>
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
