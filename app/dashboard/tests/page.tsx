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
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

const testCases = [
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

  function generate() {
    setGenerating(true);
    setGenerated(false);
    setContent('');
    let i = 0;
    const interval = setInterval(() => {
      i += 30;
      setContent(sampleTests.slice(0, i));
      if (i >= sampleTests.length) {
        clearInterval(interval);
        setGenerating(false);
        setGenerated(true);
      }
    }, 16);
  }

  return (
    <AppShell>
      <PageHeader
        title="Unit Test Generator"
        description="Generate comprehensive test suites for any file in your repository."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90" onClick={generate} disabled={generating}>
              {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {generating ? 'Generating...' : 'Regenerate'}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        {/* Main: file + tests */}
        <div className="space-y-4">
          {/* File selector */}
          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Selected file</CardTitle>
              <CardDescription>Choose a source file to generate tests for</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select value={file} onValueChange={setFile}>
                  <SelectTrigger className="sm:w-80">
                    <FileCode className="mr-2 h-4 w-4 text-muted-foreground" />
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
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">42 lines</Badge>
                  <Badge variant="outline">3 functions</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated tests */}
          <Card className="border-border/60 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <TestTube className="h-4 w-4 text-primary" />
                  Generated test cases
                </CardTitle>
                <CardDescription className="mt-1">utils.test.ts · Vitest</CardDescription>
              </div>
              {generated && (
                <Badge className="bg-emerald-500/15 text-emerald-500">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Ready
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="relative overflow-hidden rounded-xl border border-border bg-[hsl(230_25%_5%)]">
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                  <span className="text-xs text-muted-foreground">utils.test.ts</span>
                  <Button variant="ghost" size="sm" className="h-7 text-xs">
                    <Play className="mr-1 h-3 w-3" />
                    Run tests
                  </Button>
                </div>
                <pre className="max-h-[420px] overflow-auto p-4 text-xs leading-relaxed text-foreground/90 scrollbar-thin">
                  <code>{content}{generating && <span className="ml-0.5 inline-block h-3.5 w-2 animate-pulse bg-primary align-middle" />}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: coverage + cases */}
        <div className="space-y-4">
          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Coverage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'Statements', value: 88 },
                { label: 'Branches', value: 76 },
                { label: 'Functions', value: 92 },
                { label: 'Lines', value: 88 },
              ].map((c) => (
                <div key={c.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{c.label}</span>
                    <span className="font-medium">{c.value}%</span>
                  </div>
                  <Progress
                    value={c.value}
                    className={c.value >= 85 ? '[&>*]:bg-emerald-500' : c.value >= 70 ? '[&>*]:bg-amber-500' : '[&>*]:bg-red-500'}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle className="text-base">Test cases</CardTitle>
              <CardDescription>{testCases.length} generated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {testCases.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 p-3"
                >
                  {t.status === 'passed' ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : (
                    <div className="h-4 w-4 shrink-0 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className="flex-1 text-xs">{t.name}</span>
                  <Badge variant={t.status === 'passed' ? 'default' : 'secondary'} className="text-[10px]">
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
