'use client';

import * as React from 'react';
import {
  Zap,
  Play,
  Copy,
  Check,
  TrendingDown,
  Gauge,
  Cpu,
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  FileCode,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { toast } from 'sonner';

const presets = [
  {
    name: 'Nested Loop Array Search O(N²)',
    language: 'typescript',
    code: `// Quadratic Time Complexity O(N²)
function findDuplicates(items: string[]) {
  const duplicates: string[] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      if (i !== j && items[i] === items[j]) {
        if (!duplicates.includes(items[i])) {
          duplicates.push(items[i]);
        }
      }
    }
  }
  return duplicates;
}`,
  },
  {
    name: 'Recursive Fibonacci O(2ⁿ)',
    language: 'typescript',
    code: `// Exponential Time Complexity O(2ⁿ)
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
  },
  {
    name: 'Un-memoized React Filtering O(N)',
    language: 'typescript',
    code: `// Un-memoized expensive filtering on every render
export function UserList({ users, filterQuery }: { users: any[]; filterQuery: string }) {
  const filtered = users.filter(user => {
    return user.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
           user.email.toLowerCase().includes(filterQuery.toLowerCase());
  });
  return <div>{filtered.length} matching users</div>;
}`,
  },
];

export default function PerformancePage() {
  const [selectedPreset, setSelectedPreset] = React.useState('0');
  const [code, setCode] = React.useState(presets[0].code);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<{
    metrics: {
      timeComplexity: string;
      spaceComplexity: string;
      cyclomaticComplexity: number;
      speedupFactor: string;
      memorySaved: string;
    };
    refactoredCode: string;
    benchmarkCurve: Array<{ elements: number; currentMs: number; optimizedMs: number }>;
  } | null>(null);

  const [copied, setCopied] = React.useState(false);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language: 'typescript' }),
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
        toast.success('Performance benchmark complete!');
      } else {
        toast.error('Failed to run performance analysis');
      }
    } catch {
      toast.error('Network error running analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (idxStr: string) => {
    setSelectedPreset(idxStr);
    const idx = parseInt(idxStr, 10);
    if (presets[idx]) {
      setCode(presets[idx].code);
      setAnalysisResult(null);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Optimized code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell>
      <PageHeader
        title="AI Code Performance & Complexity Analyzer"
        description="Benchmark runtime complexity, memory footprint, and generate 1-click algorithm refactorings."
        actions={
          <Button
            size="sm"
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
          >
            <Play className="mr-2 h-4 w-4 fill-white" />
            {isAnalyzing ? 'Analyzing Benchmark...' : 'Run Benchmark'}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12 mb-6">
        {/* Code Input Card */}
        <Card className="border-border/60 bg-card/50 lg:col-span-6">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-500" /> Current Source Code
              </CardTitle>
              <CardDescription>Select a preset or paste custom function code</CardDescription>
            </div>
            <Select value={selectedPreset} onValueChange={handleSelectPreset}>
              <SelectTrigger className="w-56 text-xs h-8">
                <SelectValue placeholder="Select preset" />
              </SelectTrigger>
              <SelectContent>
                {presets.map((p, idx) => (
                  <SelectItem key={idx} value={String(idx)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-80 w-full rounded-xl border border-border bg-background/80 p-4 font-mono text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="// Paste TypeScript or JavaScript function code here..."
            />
          </CardContent>
        </Card>

        {/* AI Optimized Code Card */}
        <Card className="border-border/60 bg-card/50 lg:col-span-6">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-purple-400">
                <Sparkles className="h-4 w-4 text-purple-500" /> AI Refactored Solution
              </CardTitle>
              <CardDescription>Optimized data structures & asymptotic bound</CardDescription>
            </div>
            {analysisResult && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => handleCopyCode(analysisResult.refactoredCode)}
              >
                {copied ? <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy Code'}
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisResult ? (
              <pre className="h-80 w-full overflow-auto rounded-xl border border-purple-500/20 bg-purple-950/10 p-4 font-mono text-xs text-purple-200">
                {analysisResult.refactoredCode}
              </pre>
            ) : (
              <div className="flex h-80 flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground">
                <Gauge className="h-10 w-10 opacity-30 mb-2" />
                <p className="font-medium text-sm">No benchmark results yet</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                  Click &quot;Run Benchmark&quot; to execute asymptotic analysis and receive AI-optimized refactorings.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Metrics & Benchmark Chart */}
      {analysisResult && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="border-border/60 bg-card/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Time Complexity</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-red-500 line-through">{analysisResult.metrics.timeComplexity}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-lg font-bold text-emerald-500">O(N)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Speedup Factor</p>
                  <p className="text-xl font-bold text-purple-400">{analysisResult.metrics.speedupFactor} Faster</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Space Complexity</p>
                  <p className="text-xl font-bold">{analysisResult.metrics.spaceComplexity}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase">Memory Optimization</p>
                  <p className="text-xl font-bold text-emerald-500">-{analysisResult.metrics.memorySaved}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Execution Time vs Input Size (N Elements)</CardTitle>
              <CardDescription>Comparative scaling benchmark curve (Milliseconds vs N items)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysisResult.benchmarkCurve}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="elements" stroke="#888888" label={{ value: 'N Elements', position: 'insideBottom', offset: -5 }} />
                    <YAxis stroke="#888888" label={{ value: 'Execution Time (ms)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                      formatter={(val: number) => [`${val} ms`, 'Time']}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="currentMs" name="Original Code (ms)" stroke="#ef4444" strokeWidth={2} dot />
                    <Line type="monotone" dataKey="optimizedMs" name="AI Refactored (ms)" stroke="#10b981" strokeWidth={2} dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
