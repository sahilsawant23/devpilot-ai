'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Bot,
  Terminal,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Play,
  RotateCcw,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AgentExecutionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = (params?.id as string) || 'task_101';

  const [logs, setLogs] = React.useState<string[]>([
    '[SYSTEM] Agent runner initialized with container runtime gVisor-v2.4',
    '[INFO] Workspace repository cloned: billing-api (branch: main)',
    '[ANALYSIS] Running static AST parser across 142 source files...',
    '[CHECK] Vulnerability scan: 0 critical, 2 medium issues flagged',
    '[AI] Synthesizing refactored solution for SQL injection vector in auth.go:88',
    '[SUCCESS] PR #42 created with automated test coverage (+94%)',
  ]);

  const [isRunning, setIsRunning] = React.useState(false);

  const handleRerun = () => {
    setIsRunning(true);
    toast.info(`Re-triggering Agent task execution #${taskId}`);
    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        `[RE-RUN ${new Date().toLocaleTimeString()}] Task restarted by developer`,
        '[INFO] Running regression suite against latest main HEAD...',
        '[SUCCESS] All 84 unit tests passed cleanly!',
      ]);
      setIsRunning(false);
      toast.success('Agent task execution completed successfully!');
    }, 1500);
  };

  return (
    <AppShell>
      <PageHeader
        title={`Agent Task Run #${taskId}`}
        description="Live terminal log output, diff artifacts, and execution trajectory."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/agents')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> All Agents
            </Button>
            <Button
              size="sm"
              onClick={handleRerun}
              disabled={isRunning}
              className="bg-primary text-primary-foreground"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Re-run Task
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-lg font-bold text-emerald-500">COMPLETED</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Duration</p>
            <div className="text-xl font-bold mt-1">42.8 seconds</div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Target Repo</p>
            <div className="text-lg font-semibold mt-1">billing-api</div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Files Changed</p>
            <div className="text-xl font-bold text-purple-400 mt-1">3 Files (+48, -12)</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Terminal Output */}
        <Card className="border-border/60 bg-card/50 lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-500" /> Live Terminal Logs
            </CardTitle>
            <Badge variant="outline" className="font-mono text-[10px]">
              stdout / stderr
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-96 w-full overflow-y-auto rounded-xl border border-border bg-black/90 p-4 font-mono text-xs text-emerald-400 leading-relaxed scrollbar-thin">
              {logs.map((log, idx) => (
                <div key={idx} className="py-0.5">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Artifact Output */}
        <Card className="border-border/60 bg-card/50 lg:col-span-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileCode className="h-4 w-4 text-purple-500" /> Generated Patch Diff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="h-96 overflow-auto rounded-xl border border-purple-500/20 bg-purple-950/10 p-3 font-mono text-[11px] text-purple-200">
{`diff --git a/auth/login.go b/auth/login.go
index 8a3f12..4c910a 100644
--- a/auth/login.go
+++ b/auth/login.go
@@ -88,4 +88,4 @@
- query := fmt.Sprintf("SELECT * FROM users WHERE email='%s'", email)
+ stmt, err := db.Prepare("SELECT * FROM users WHERE email=?")
+ rows, err := stmt.Query(email)`}
            </pre>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
