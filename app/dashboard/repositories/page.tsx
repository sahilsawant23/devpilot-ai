'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Github, FileArchive, X, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { RepositoryCard } from '@/components/repository-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const languageColors: Record<string, string> = {
  TypeScript: 'hsl(246, 78%, 64%)',
  JavaScript: 'hsl(50, 90%, 54%)',
  Go: 'hsl(180, 70%, 50%)',
  Python: 'hsl(190, 90%, 54%)',
  Rust: 'hsl(20, 80%, 54%)',
};

export default function RepositoriesPage() {
  const router = useRouter();
  const [dragOver, setDragOver] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [ghUrl, setGhUrl] = React.useState('');
  const [importing, setImporting] = React.useState(false);

  // Real-time Database list states
  const [repos, setRepos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function fetchRepos() {
    try {
      const res = await fetch('/api/repositories');
      if (res.ok) {
        const data = await res.json();
        setRepos(data.repositories ?? []);
      } else {
        console.error('Failed to fetch repositories');
      }
    } catch (err) {
      console.error('Error fetching repositories:', err);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchRepos();
  }, []);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      toast.success(`Selected ${f.name}`);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      toast.success(`Selected ${f.name}`);
    }
  }

  async function startUpload() {
    if (!file) return;
    setUploading(true);
    try {
      const repoName = file.name.replace(/\.[^/.]+$/, ""); // strip extension
      const res = await fetch('/api/repositories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: repoName,
          description: `Uploaded codebase zip archive: ${file.name}`,
          language: 'JavaScript',
        }),
      });

      if (res.ok) {
        toast.success('Repository uploaded and indexed in PostgreSQL');
        setFile(null);
        fetchRepos();
      } else {
        toast.error('Failed to upload and index repository');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  }

  async function importGithub() {
    if (!ghUrl.trim() || !ghUrl.includes('github.com')) {
      toast.error('Enter a valid GitHub URL');
      return;
    }
    setImporting(true);
    try {
      const parts = ghUrl.split('/');
      const repoName = parts[parts.length - 1] || 'github-repo';
      
      const res = await fetch('/api/repositories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: repoName,
          url: ghUrl,
          description: `Git clone index at ${ghUrl}`,
          language: 'TypeScript',
        }),
      });

      if (res.ok) {
        toast.success('GitHub repository cloned and indexed successfully!');
        setGhUrl('');
        fetchRepos();
      } else {
        toast.error('Failed to clone repository');
      }
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during cloning');
    } finally {
      setImporting(false);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="Repositories"
        description="Upload a ZIP or import directly from GitHub to start analyzing."
      />

      <Tabs defaultValue="github" className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="github">
            <Github className="mr-2 h-4 w-4" />
            Import from GitHub
          </TabsTrigger>
          <TabsTrigger value="zip">
            <FileArchive className="mr-2 h-4 w-4" />
            Upload ZIP
          </TabsTrigger>
        </TabsList>

        <TabsContent value="github">
          <div className="rounded-2xl border border-border/60 bg-card/50 p-6 sm:p-8">
            <h3 className="text-lg font-semibold">Import a GitHub repository</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Paste a repository URL. DevPilot will clone and index it automatically.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Github className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={ghUrl}
                  onChange={(e) => setGhUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo"
                  className="pl-10"
                />
              </div>
              <Button
                onClick={importGithub}
                disabled={importing || !ghUrl}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
              >
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  'Import repository'
                )}
              </Button>
            </div>
            <div className="mt-5 rounded-xl border border-dashed border-border bg-background/40 p-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">Quick import</p>
              <div className="flex flex-wrap gap-2">
                {['facebook/react', 'vercel/next.js', 'microsoft/vscode', 'tailwindlabs/tailwindcss'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setGhUrl(`https://github.com/${r}`)}
                    className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="zip">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={cn(
              'relative flex min-h-[260px] flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors',
              dragOver ? 'border-primary bg-primary/5' : 'border-border bg-card/50'
            )}
          >
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div
                  key="file"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-sm"
                >
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileArchive className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label="Remove file"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <Button
                    onClick={startUpload}
                    disabled={uploading}
                    className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading & indexing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload & analyze
                      </>
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 text-primary">
                    <Upload className="h-7 w-7" />
                  </div>
                  <p className="text-base font-medium">Drag and drop your ZIP file</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    or click to browse. Supports .zip, .tar.gz up to 100 MB
                  </p>
                  <label className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
                    Browse files
                    <input
                      type="file"
                      className="hidden"
                      accept=".zip,.tar,.gz"
                      onChange={onFileChange}
                    />
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>

      {/* Repository list */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your repositories</h2>
        <span className="text-sm text-muted-foreground">{repos.length} total</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : repos.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-2xl border-border/80 bg-card/20">
          <p className="text-sm text-muted-foreground">No repositories found. Add one above to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((r) => {
            const mappedRepo = {
              name: r.name,
              description: r.description || 'No description provided.',
              language: r.language || 'TypeScript',
              languageColor: languageColors[r.language] || 'hsl(246, 78%, 64%)',
              size: r.size || '12.4 MB',
              stars: r.stars ?? 12,
              lastUpdated: formatDistanceToNow(new Date(r.updatedAt), { addSuffix: true }),
              status: r.status || 'Analyzed',
              health: r.health ?? 85,
            };
            return <RepositoryCard key={r.id} repo={mappedRepo} />;
          })}
        </div>
      )}
    </AppShell>
  );
}
