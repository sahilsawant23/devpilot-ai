'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  GitBranch,
  Folder,
  FileCode,
  ShieldCheck,
  Activity,
  ArrowLeft,
  Search,
  Code2,
  AlertTriangle,
  FileText,
  Sparkles,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { repositories } from '@/lib/data';
import { toast } from 'sonner';

const mockFileTree = [
  { path: 'src/index.ts', type: 'file', size: '1.2 KB', language: 'TypeScript' },
  { path: 'src/server.ts', type: 'file', size: '4.8 KB', language: 'TypeScript' },
  { path: 'src/auth/jwt.ts', type: 'file', size: '2.4 KB', language: 'TypeScript' },
  { path: 'src/db/prisma.ts', type: 'file', size: '1.1 KB', language: 'TypeScript' },
  { path: 'package.json', type: 'file', size: '850 B', language: 'JSON' },
  { path: 'Dockerfile', type: 'file', size: '420 B', language: 'Docker' },
];

export default function RepositoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const repoId = (params?.id as string) || 'web-platform';

  const repo = React.useMemo(() => {
    const found = repositories.find((r) => r.name.toLowerCase() === repoId.toLowerCase());
    return (
      found || {
        name: repoId,
        description: 'Core microservice repository managed by DevPilot AI platform.',
        language: 'TypeScript',
        languageColor: 'hsl(246 78% 64%)',
        size: '12.4 MB',
        stars: 142,
        lastUpdated: '2 hours ago',
        status: 'Analyzed',
        health: 92,
      }
    );
  }, [repoId]);

  const [selectedFile, setSelectedFile] = React.useState(mockFileTree[0]);

  return (
    <AppShell>
      <PageHeader
        title={repo.name}
        description={repo.description || 'Repository detail view and automated intelligence audit.'}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard/repositories')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Repositories
            </Button>
            <Button
              size="sm"
              onClick={() => {
                toast.success(`Triggered AI Re-analysis for ${repo.name}`);
                router.push('/dashboard/repositories/analysis');
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Run Full Audit
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Health Score</p>
            <div className="text-2xl font-bold text-emerald-500 mt-1">{repo.health}%</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Top 5% quality index</p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Primary Language</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: repo.languageColor }} />
              <span className="text-xl font-bold">{repo.language}</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Status</p>
            <div className="text-xl font-bold text-blue-400 mt-1">{repo.status}</div>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card/50">
          <CardContent className="p-4">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Last Updated</p>
            <div className="text-lg font-semibold mt-1">{repo.lastUpdated}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="code" className="space-y-4">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="code">
            <FileCode className="mr-2 h-4 w-4" /> Source Explorer
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldCheck className="mr-2 h-4 w-4" /> Security & Vulnerabilities
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="mr-2 h-4 w-4" /> Commit Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code">
          <div className="grid gap-6 lg:grid-cols-12">
            {/* File Tree Sidebar */}
            <Card className="border-border/60 bg-card/50 lg:col-span-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Folder className="h-4 w-4 text-blue-500" /> Repository Files
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2 space-y-1">
                {mockFileTree.map((f) => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFile(f)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                      selectedFile.path === f.path
                        ? 'bg-primary/10 font-semibold text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileCode className="h-3.5 w-3.5" />
                      <span>{f.path}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{f.size}</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Code Viewer Panel */}
            <Card className="border-border/60 bg-card/50 lg:col-span-8">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-sm font-mono">{selectedFile.path}</CardTitle>
                  <CardDescription>Language: {selectedFile.language}</CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/dashboard/review`)}
                >
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-emerald-500" /> Audit File
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="h-80 w-full overflow-auto rounded-xl border border-border bg-background/80 p-4 font-mono text-xs text-muted-foreground">
                  {`// ${selectedFile.path}
import { db } from '@/lib/db';

export async function handleRepositoryRequest(req: Request) {
  const repository = "${repo.name}";
  console.log("Analyzing repository stream:", repository);
  return { status: "${repo.status}", health: ${repo.health} };
}`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Vulnerability Log</CardTitle>
              <CardDescription>Automated static analysis findings for {repo.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground">Hardcoded JWT Secret Fallback</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Found in <code>src/auth/jwt.ts:24</code> — Replace default fallback with strict env validation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Recent Commits & Agent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div>
                    <p className="font-semibold text-foreground">feat(auth): add role-based session cookie authentication</p>
                    <p className="text-muted-foreground mt-0.5">sahilsawant23 &bull; committed 2 hours ago</p>
                  </div>
                  <Badge variant="secondary">b41b23e</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
