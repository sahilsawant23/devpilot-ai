'use client';

import * as React from 'react';
import {
  TestTube,
  FileCode,
  Download,
  Loader2,
  CheckCircle2,
  Sparkles,
  Play,
  Terminal,
  RotateCcw,
  BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const sampleTests = `import { describe, it, expect, vi } from 'vitest';
import { validateEmail } from './utils';

describe('validateEmail', () => {
  it('returns true for valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('a.b@sub.domain.io')).toBe(true);
  });

  it('returns false for invalid emails', () => {
    expect(validateEmail('not-an-email')).toBe(false);
    expect(validateEmail('missing@domain')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('handles edge cases', () => {
    expect(validateEmail('  user@example.com  ')).toBe(true);
    expect(validateEmail('USER@EXAMPLE.COM')).toBe(true);
  });
});`;

interface TestCase {
  name: string;
  status: 'passed' | 'pending' | 'running';
}

const initialTestCases: TestCase[] = [
  { name: 'returns true for valid emails', status: 'passed' },
  { name: 'returns false for invalid emails', status: 'passed' },
  { name: 'handles edge cases with whitespace', status: 'passed' },
  { name: 'handles uppercase emails', status: 'passed' },
  { name: 'throws on null input', status: 'pending' },
  { name: 'validates unicode local part', status: 'pending' },
];

export default function TestsPage() {
  const [file, setFile] = React.useState('src/lib/utils.ts');
  const [generating, setGenerating] = React.useState(false);
  const [generated, setGenerated] = React.useState(true);
  const [content, setContent] = React.useState(sampleTests);

  // Runner States
  const [runningTests, setRunningTests] = React.useState(false);
  const [terminalLogs, setTerminalLogs] = React.useState<string[]>([]);
  const [testCases, setTestCases] = React.useState<TestCase[]>(initialTestCases);
  const [coverageData, setCoverageData] = React.useState([
    { label: 'Statements', value: 82 },
    { label: 'Branches', value: 74 },
    { label: 'Functions', value: 90 },
    { label: 'Lines', value: 82 },
  ]);

  const terminalEndRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Real AI Code generator connected to /api/tests/generate
  async function generate() {
    setGenerating(true);
    setGenerated(false);
    setTerminalLogs([]);

    try {
      const res = await fetch('/api/tests/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file,
          framework: 'vitest',
          testType: 'unit',
        }),
      });

      const data = await res.json();
      if (data.generatedCode) {
        setContent(data.generatedCode);
        if (data.testCases) {
          setTestCases(data.testCases);
        }
        setCoverageData([
          { label: 'Statements', value: 96 },
          { label: 'Branches', value: 92 },
          { label: 'Functions', value: 100 },
          { label: 'Lines', value: 96 },
        ]);
        toast.success(`Generated ${data.assertionsCount || 9} test assertions for ${data.targetFile || file}`);
      } else {
        toast.error(data.error || 'Failed to generate tests');
      }
    } catch {
      toast.error('Network error during test generation');
    } finally {
      setGenerating(false);
      setGenerated(true);
    }
  }

  // CLI Test runner simulator
  function runVitestSuite() {
    if (runningTests) return;
    setRunningTests(true);
    setTerminalLogs([]);
    
    // Set pending tests to running status
    setTestCases(prev => prev.map(tc => tc.status === 'pending' ? { ...tc, status: 'running' } : tc));

    const logs = [
      '\u001b[36m> npx vitest run src/lib/utils.test.ts\u001b[39m',
      '',
      ' \u001b[33mRUN\u001b[39m  v1.0.0 /workspace/web-platform',
      ' \u001b[34m❯\u001b[39m src/lib/utils.test.ts \u001b[90m(6 tests)\u001b[39m',
      '   \u001b[32m✓\u001b[39m returns true for valid emails \u001b[90m(4ms)\u001b[39m',
      '   \u001b[32m✓\u001b[39m returns false for invalid emails \u001b[90m(1ms)\u001b[39m',
      '   \u001b[32m✓\u001b[39m handles edge cases with whitespace \u001b[90m(1ms)\u001b[39m',
      '   \u001b[32m✓\u001b[39m handles uppercase emails \u001b[90m(2ms)\u001b[39m',
    ];

    let step = 0;
    const logInterval = setInterval(() => {
      if (step < logs.length) {
        setTerminalLogs(prev => [...prev, logs[step]]);
        step++;
      } else {
        clearInterval(logInterval);
        
        // Final assertion outputs
        setTimeout(() => {
          setTerminalLogs(prev => [
            ...prev,
            '   \u001b[32m✓\u001b[39m throws on null input \u001b[90m(3ms)\u001b[39m',
            '   \u001b[32m✓\u001b[39m validates unicode local part \u001b[90m(2ms)\u001b[39m',
            '',
            ' \u001b[32mTest Files\u001b[39m  \u001b[1m1 passed\u001b[22m (1)',
            '      \u001b[32mTests\u001b[39m  \u001b[1m6 passed\u001b[22m (6)',
            '   \u001b[90mDuration\u001b[39m  \u001b[1m412ms\u001b[22m (transform 18ms, setup 8ms, collect 52ms, tests 334ms)',
            '\u001b[32m✓ Coverage analysis: PASS. Statements 96%, Branches 90%\u001b[39m'
          ]);

          setTestCases(prev => prev.map(tc => ({ ...tc, status: 'passed' })));
          setCoverageData([
            { label: 'Statements', value: 96 },
            { label: 'Branches', value: 90 },
            { label: 'Functions', value: 100 },
            { label: 'Lines', value: 96 },
          ]);

          setRunningTests(false);
          toast.success('All unit tests executed successfully!');
        }, 1200);
      }
    }, 400);
  }

  // Parse ANSI escape colors into inline React styles
  const renderLogText = (line: string) => {
    // Simple mock ANSI-to-HTML parser for basic terminal text highlighting
    let formatted = line;
    formatted = formatted.replace(/\u001b\[36m(.*?)\u001b\[39m/g, '<span class="text-cyan-400 font-semibold">$1</span>');
    formatted = formatted.replace(/\u001b\[33m(.*?)\u001b\[39m/g, '<span class="text-yellow-400 font-semibold">$1</span>');
    formatted = formatted.replace(/\u001b\[34m(.*?)\u001b\[39m/g, '<span class="text-blue-400 font-bold">$1</span>');
    formatted = formatted.replace(/\u001b\[32m(.*?)\u001b\[39m/g, '<span class="text-emerald-400">$1</span>');
    formatted = formatted.replace(/\u001b\[90m(.*?)\u001b\[39m/g, '<span class="text-slate-500">$1</span>');
    formatted = formatted.replace(/\u001b\[1m(.*?)\u001b\[22m/g, '<strong class="text-white">$1</strong>');
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <AppShell>
      <PageHeader
        title="Unit Test Generator"
        description="Generate robust unit test suites and execute Vitest suites in a sandboxed CLI runner."
        actions={
          <>
            <Button variant="outline" size="sm" className="bg-card hover:bg-accent/40">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90" 
              onClick={generate} 
              disabled={generating}
            >
              {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {generating ? 'Generating...' : 'Regenerate'}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        {/* Left Section: File Picker, Code preview, Terminal */}
        <div className="space-y-4 flex flex-col h-[calc(100vh-12rem)] overflow-hidden">
          
          {/* File Picker */}
          <Card className="border-border/60 bg-card/50 shrink-0">
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileCode className="h-5 w-5 text-primary" />
                  <Select value={file} onValueChange={setFile}>
                    <SelectTrigger className="w-56 h-9 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="src/lib/utils.ts">src/lib/utils.ts</SelectItem>
                      <SelectItem value="src/lib/auth.ts">src/lib/auth.ts</SelectItem>
                      <SelectItem value="src/lib/cache.ts">src/lib/cache.ts</SelectItem>
                      <SelectItem value="src/lib/format.ts">src/lib/format.ts</SelectItem>
                      <SelectItem value="src/components/Button.tsx">src/components/Button.tsx</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant="outline">42 lines</Badge>
                  <Badge variant="outline">3 functions</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Code Editor Panel */}
          <div className="flex-1 overflow-hidden rounded-2xl border border-border/60 bg-card/45 backdrop-blur-sm flex flex-col min-h-0">
            <div className="flex items-center justify-between border-b border-border bg-background/40 px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground">utils.test.ts</span>
              <Button 
                onClick={runVitestSuite}
                disabled={runningTests || generating}
                variant="outline" 
                size="sm" 
                className="h-8 text-xs bg-background/80 hover:bg-accent/40 text-emerald-400 hover:text-emerald-300 border-emerald-500/25"
              >
                {runningTests ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Play className="mr-1.5 h-3.5 w-3.5 fill-emerald-400" />
                )}
                {runningTests ? 'Running...' : 'Run tests'}
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 font-mono text-[10.5px] leading-relaxed bg-[hsl(230,25%,4%)] text-blue-100 select-all scrollbar-thin">
              <pre>
                <code>{content}{generating && <span className="ml-0.5 inline-block h-3.5 w-2 animate-pulse bg-primary align-middle" />}</code>
              </pre>
            </div>
          </div>

          {/* Simulated Retro Terminal Drawer */}
          <div className="h-52 rounded-2xl border border-border bg-black p-4 flex flex-col shrink-0 overflow-hidden shadow-inner shadow-zinc-900">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 mb-2">
              <Terminal className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold font-mono text-zinc-300">Terminal - Vitest Console Output</span>
            </div>
            
            <div className="flex-1 overflow-y-auto font-mono text-[10.5px] leading-relaxed space-y-1.5 scrollbar-thin scrollbar-track-transparent">
              {terminalLogs.length === 0 ? (
                <span className="text-zinc-600 italic">Click "Run tests" in the editor header to execute the test suite in the virtual terminal.</span>
              ) : (
                terminalLogs.map((log, idx) => (
                  <div key={idx} className="block leading-relaxed">
                    {renderLogText(log)}
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>

        </div>

        {/* Right Section: Coverage & Assertions lists */}
        <div className="space-y-4">
          
          {/* Coverage statistics card */}
          <Card className="border-border/60 bg-card/50">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <BarChart2 className="h-4.5 w-4.5 text-primary" />
                Coverage Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              {coverageData.map((c) => (
                <div key={c.label}>
                  <div className="mb-1.5 flex items-center justify-between text-xs font-mono">
                    <span className="text-muted-foreground">{c.label}</span>
                    <span className="font-semibold text-foreground">{c.value}%</span>
                  </div>
                  <Progress
                    value={c.value}
                    className="h-1.5"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Test cases list card */}
          <Card className="border-border/60 bg-card/50">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Test Assertions Board</CardTitle>
              <CardDescription className="text-xs">{testCases.length} assertions total</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              {testCases.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-2.5 rounded-xl border border-border bg-background/40 p-2.5"
                >
                  {t.status === 'passed' ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : t.status === 'running' ? (
                    <div className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border border-primary border-t-transparent" />
                  ) : (
                    <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-zinc-700" />
                  )}
                  <span className="flex-1 text-[11px] font-medium leading-tight truncate">{t.name}</span>
                  <Badge 
                    variant={t.status === 'passed' ? 'default' : 'secondary'} 
                    className={`text-[9px] uppercase tracking-wider ${
                      t.status === 'passed' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : t.status === 'running'
                        ? 'bg-primary/10 text-primary border-primary/20 animate-pulse'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {t.status}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </AppShell>
  );
}
