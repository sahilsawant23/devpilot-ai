'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  Play, 
  Check, 
  RotateCcw, 
  ShieldAlert, 
  AlertTriangle, 
  Bug, 
  Info, 
  Terminal,
  FileCode,
  GitCommit,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

interface IssueData {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  file: string;
  line: number;
  fixDescription: string;
  category: string;
  originalCode: string[];
  patchedCode: string[];
}

const ISSUES_DETAILS: Record<string, IssueData> = {
  '1': {
    id: '1',
    severity: 'Critical',
    title: 'SQL injection vulnerability in user query',
    description: 'User input is concatenated directly into a SQL query string, allowing an attacker to inject arbitrary SQL commands.',
    file: 'src/lib/db/users.ts',
    line: 42,
    fixDescription: 'Use parameterized queries with prepared statements instead of string concatenation.',
    category: 'Security',
    originalCode: [
      "export async function getUserById(userId: string) {",
      "  const query = `SELECT * FROM users WHERE id = '${userId}' AND active = true`;",
      "  const result = await db.query(query);",
      "  return result.rows[0];",
      "}"
    ],
    patchedCode: [
      "export async function getUserById(userId: string) {",
      "  const query = `SELECT * FROM users WHERE id = $1 AND active = true`;",
      "  const result = await db.query(query, [userId]);",
      "  return result.rows[0];",
      "}"
    ]
  },
  '2': {
    id: '2',
    severity: 'Critical',
    title: 'Hardcoded API secret in source',
    description: 'A third-party API key is committed directly in source code, exposing it to anyone with repository access.',
    file: 'src/services/payments.ts',
    line: 18,
    fixDescription: 'Move the secret to an environment variable and rotate the exposed key immediately.',
    category: 'Security',
    originalCode: [
      "import Stripe from 'stripe';",
      "",
      "const stripeKey = 'sk_live_51N2xA98y20Dsn87A9y';",
      "const stripe = new Stripe(stripeKey);",
      "export default stripe;"
    ],
    patchedCode: [
      "import Stripe from 'stripe';",
      "",
      "const stripeKey = process.env.STRIPE_SECRET_KEY;",
      "if (!stripeKey) throw new Error('STRIPE_SECRET_KEY environment variable is unset');",
      "const stripe = new Stripe(stripeKey);",
      "export default stripe;"
    ]
  },
  '3': {
    id: '3',
    severity: 'High',
    title: 'Unhandled promise rejection in async handler',
    description: 'An async function lacks a try/catch block, causing unhandled rejections that can crash the process.',
    file: 'src/app/api/webhook/route.ts',
    line: 67,
    fixDescription: 'Wrap the async logic in try/catch and return a 400/500 response on error.',
    category: 'Reliability',
    originalCode: [
      "export async function POST(req: Request) {",
      "  const payload = await req.json();",
      "  const sig = req.headers.get('stripe-signature') || '';",
      "  const event = stripe.webhooks.constructEvent(payload, sig);",
      "  await handleWebhookEvent(event);",
      "  return NextResponse.json({ received: true });",
      "}"
    ],
    patchedCode: [
      "export async function POST(req: Request) {",
      "  try {",
      "    const payload = await req.json();",
      "    const sig = req.headers.get('stripe-signature') || '';",
      "    const event = stripe.webhooks.constructEvent(payload, sig);",
      "    await handleWebhookEvent(event);",
      "    return NextResponse.json({ received: true });",
      "  } catch (err: any) {",
      "    console.error('Webhook error:', err);",
      "    return NextResponse.json({ error: err.message }, { status: 400 });",
      "  }",
      "}"
    ]
  },
  '4': {
    id: '4',
    severity: 'High',
    title: 'Potential race condition in cache update',
    description: 'Two concurrent requests may read and write the cache simultaneously, leading to inconsistent state.',
    file: 'src/lib/cache.ts',
    line: 91,
    fixDescription: 'Use a mutex or atomic double-checked lock operations when updating shared cache entries.',
    category: 'Concurrency',
    originalCode: [
      "export async function getCachedValue(key: string) {",
      "  const val = await redis.get(key);",
      "  if (!val) {",
      "    const fresh = await fetchFromDB();",
      "    await redis.set(key, fresh);",
      "    return fresh;",
      "  }",
      "  return val;",
      "}"
    ],
    patchedCode: [
      "export async function getCachedValue(key: string) {",
      "  let val = await redis.get(key);",
      "  if (!val) {",
      "    const lock = await acquireCacheLock(key);",
      "    try {",
      "      val = await redis.get(key); // Double check",
      "      if (!val) {",
      "        val = await fetchFromDB();",
      "        await redis.set(key, val);",
      "      }",
      "    } finally {",
      "      await releaseCacheLock(key);",
      "    }",
      "  }",
      "  return val;",
      "}"
    ]
  },
  '5': {
    id: '5',
    severity: 'Medium',
    title: 'Missing input validation on email field',
    description: 'The email input is not validated before being stored, which may allow malformed data.',
    file: 'src/app/api/signup/route.ts',
    line: 24,
    fixDescription: 'Validate the email with a regex or zod schema before processing.',
    category: 'Validation',
    originalCode: [
      "export async function POST(req: Request) {",
      "  const { email, password } = await req.json();",
      "  await createUser({ email, password });",
      "  return NextResponse.json({ success: true });",
      "}"
    ],
    patchedCode: [
      "export async function POST(req: Request) {",
      "  const { email, password } = await req.json();",
      "  const emailRegex = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;",
      "  if (!email || !emailRegex.test(email)) {",
      "    return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });",
      "  }",
      "  await createUser({ email, password });",
      "  return NextResponse.json({ success: true });",
      "}"
    ]
  },
  '6': {
    id: '6',
    severity: 'Medium',
    title: 'Inefficient N+1 query in list endpoint',
    description: 'The endpoint fetches related records one-by-one inside a loop, causing N+1 database queries.',
    file: 'src/app/api/posts/route.ts',
    line: 53,
    fixDescription: 'Use a single query with a JOIN or include to fetch related data in one round-trip.',
    category: 'Performance',
    originalCode: [
      "export async function GET() {",
      "  const posts = await prisma.post.findMany();",
      "  const enriched = await Promise.all(posts.map(async post => {",
      "    const author = await prisma.user.findUnique({ where: { id: post.authorId } });",
      "    return { ...post, author };",
      "  }));",
      "  return NextResponse.json({ posts: enriched });",
      "}"
    ],
    patchedCode: [
      "export async function GET() {",
      "  const posts = await prisma.post.findMany({",
      "    include: {",
      "      author: true",
      "    }",
      "  });",
      "  return NextResponse.json({ posts });",
      "}"
    ]
  },
  '7': {
    id: '7',
    severity: 'Low',
    title: 'Unused import statement',
    description: 'The import for `useCallback` is declared but never used in this file.',
    file: 'src/components/Form.tsx',
    line: 3,
    fixDescription: 'Remove the unused import to keep the bundle lean.',
    category: 'Code Quality',
    originalCode: [
      "import * as React from 'react';",
      "import { useState, useEffect, useCallback } from 'react';",
      "import { Input } from '@/components/ui/input';"
    ],
    patchedCode: [
      "import * as React from 'react';",
      "import { useState, useEffect } from 'react';",
      "import { Input } from '@/components/ui/input';"
    ]
  },
  '8': {
    id: '8',
    severity: 'Low',
    title: 'Inconsistent code formatting',
    description: 'Indentation uses a mix of tabs and spaces, violating project style rules.',
    file: 'src/lib/format.ts',
    line: 12,
    fixDescription: 'Run the project formatter (Prettier) to normalize whitespace.',
    category: 'Style',
    originalCode: [
      "function formatData(data: any) {",
      "	const str = JSON.stringify(data);",
      "  return str.trim();",
      "}"
    ],
    patchedCode: [
      "function formatData(data: any) {",
      "  const str = JSON.stringify(data);",
      "  return str.trim();",
      "}"
    ]
  }
};

const severityConfig: Record<
  Severity,
  { icon: React.ElementType; badge: string; text: string }
> = {
  Critical: { icon: ShieldAlert, badge: 'bg-red-500/15 text-red-500 border-red-500/30', text: 'text-red-500' },
  High: { icon: AlertTriangle, badge: 'bg-orange-500/15 text-orange-500 border-orange-500/30', text: 'text-orange-500' },
  Medium: { icon: Bug, badge: 'bg-amber-500/15 text-amber-500 border-amber-500/30', text: 'text-amber-500' },
  Low: { icon: Info, badge: 'bg-blue-500/15 text-blue-500 border-blue-500/30', text: 'text-blue-500' },
};

export default function ReviewDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  const issueId = (params?.id as string) || '1';
  const issue = ISSUES_DETAILS[issueId];

  // Streaming refactoring state
  const [fixed, setFixed] = React.useState(false);
  const [refactoring, setRefactoring] = React.useState(false);
  const [streamedLines, setStreamedLines] = React.useState<string[]>([]);
  const [lineIndex, setLineIndex] = React.useState(-1);
  const [characterIndex, setCharacterIndex] = React.useState(0);

  // If issue is missing
  if (!issue) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <p className="text-lg font-semibold">Code Review Issue Not Found</p>
          <Button className="mt-4" onClick={() => router.push('/dashboard/review')}>
            Back to Reviews
          </Button>
        </div>
      </AppShell>
    );
  }

  const severity = severityConfig[issue.severity];
  const SevIcon = severity.icon;

  // Stream simulation effect
  React.useEffect(() => {
    if (refactoring && lineIndex >= 0) {
      const fullLine = issue.patchedCode[lineIndex];
      
      if (characterIndex < fullLine.length) {
        // Stream character by character
        const timer = setTimeout(() => {
          setStreamedLines(prev => {
            const next = [...prev];
            next[lineIndex] = fullLine.substring(0, characterIndex + 1);
            return next;
          });
          setCharacterIndex(prev => prev + 1);
        }, 15); // ms per char
        return () => clearTimeout(timer);
      } else {
        // Line finished. Move to next line.
        if (lineIndex < issue.patchedCode.length - 1) {
          const nextIndex = lineIndex + 1;
          setLineIndex(nextIndex);
          setCharacterIndex(0);
          setStreamedLines(prev => [...prev, '']);
        } else {
          // Finished entire block refactoring
          setRefactoring(false);
          setFixed(true);
          toast.success('AI patch successfully applied and validated!');
        }
      }
    }
  }, [refactoring, lineIndex, characterIndex]);

  const runRefactor = () => {
    if (refactoring) return;
    setFixed(false);
    setRefactoring(true);
    setStreamedLines(['']); // Start with empty line
    setLineIndex(0);
    setCharacterIndex(0);
    toast.info('AI is streaming safe code patches...');
  };

  const resetDiff = () => {
    setFixed(false);
    setRefactoring(false);
    setStreamedLines([]);
    setLineIndex(-1);
    setCharacterIndex(0);
  };

  return (
    <AppShell>
      {/* Dynamic Header */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href="/dashboard/review"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mr-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Code Review
        </Link>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${severity.badge}`}>
          <SevIcon className="h-3.5 w-3.5" />
          {issue.severity}
        </span>
        <Badge variant="outline" className="text-[10px]">{issue.category}</Badge>
      </div>

      <PageHeader
        title={issue.title}
        description={issue.description}
        actions={
          <div className="flex gap-2">
            {fixed ? (
              <Button 
                onClick={resetDiff}
                variant="outline" 
                size="sm"
                className="bg-card hover:bg-accent/40"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset Code
              </Button>
            ) : (
              <Button 
                onClick={runRefactor}
                disabled={refactoring}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
              >
                <Play className="mr-2 h-4 w-4 fill-white" />
                {refactoring ? 'Applying Patch...' : 'Apply AI Patch'}
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        {/* Dynamic Split Diff window */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/45 backdrop-blur-sm flex flex-col h-[calc(100vh-17rem)]">
          {/* Editor Headers */}
          <div className="grid grid-cols-2 border-b border-border bg-background/40">
            <div className="flex items-center gap-2 px-4 py-2.5 border-r border-border text-xs font-semibold text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-rose-500/80" />
              Original Code
            </div>
            <div className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500/80" />
              AI Patched Code
            </div>
          </div>

          {/* Editors columns splits */}
          <div className="flex-1 grid grid-cols-2 overflow-hidden font-mono text-[11px] leading-relaxed select-none">
            {/* Left Col: Original Buggy Code */}
            <div className="overflow-y-auto border-r border-border p-4 bg-rose-950/5 select-text scrollbar-thin">
              {issue.originalCode.map((line, idx) => {
                // Highlight target buggy line
                const isTargetLine = idx + 40 === issue.line || (issue.id === '1' && idx === 1) || (issue.id === '2' && idx === 2) || (issue.id === '3' && (idx >= 1 && idx <= 5)) || (issue.id === '4' && (idx >= 2 && idx <= 5)) || (issue.id === '5' && idx === 2) || (issue.id === '6' && (idx >= 2 && idx <= 5)) || (issue.id === '7' && idx === 1) || (issue.id === '8' && idx === 1);
                
                return (
                  <div 
                    key={idx} 
                    className={`flex gap-3 px-2 py-0.5 rounded ${
                      isTargetLine ? 'bg-red-500/10 text-red-300 border-l-2 border-red-500' : 'text-slate-400'
                    }`}
                  >
                    <span className="w-6 text-right text-[10px] text-slate-600 select-none">{idx + 1}</span>
                    <pre className="whitespace-pre-wrap">{line}</pre>
                  </div>
                );
              })}
            </div>

            {/* Right Col: Patched Fixed Code (Live Streaming Animation) */}
            <div className="overflow-y-auto p-4 bg-emerald-950/5 select-text scrollbar-thin relative">
              {refactoring ? (
                // Streaming render
                streamedLines.map((line, idx) => {
                  const isCurrentWritingLine = idx === lineIndex;
                  return (
                    <div key={idx} className="flex gap-3 px-2 py-0.5 text-emerald-300">
                      <span className="w-6 text-right text-[10px] text-slate-600 select-none">{idx + 1}</span>
                      <pre className="whitespace-pre-wrap flex items-center">
                        {line}
                        {isCurrentWritingLine && (
                          <motion.span 
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="inline-block h-3.5 w-1 bg-emerald-400 ml-0.5" 
                          />
                        )}
                      </pre>
                    </div>
                  );
                })
              ) : fixed ? (
                // Completed Refactored Code
                issue.patchedCode.map((line, idx) => {
                  const isPatchedLine = (issue.id === '1' && idx === 1) || (issue.id === '2' && (idx >= 2 && idx <= 3)) || (issue.id === '3' && (idx === 1 || idx === 8 || idx === 9 || idx === 10 || idx === 11)) || (issue.id === '4' && (idx >= 3 && idx <= 12)) || (issue.id === '5' && (idx >= 2 && idx <= 5)) || (issue.id === '6' && (idx >= 2 && idx <= 6)) || (issue.id === '7' && idx === 1) || (issue.id === '8' && idx === 1);

                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-3 px-2 py-0.5 rounded ${
                        isPatchedLine ? 'bg-emerald-500/10 text-emerald-300 border-l-2 border-emerald-500' : 'text-slate-400'
                      }`}
                    >
                      <span className="w-6 text-right text-[10px] text-slate-600 select-none">{idx + 1}</span>
                      <pre className="whitespace-pre-wrap">{line}</pre>
                    </div>
                  );
                })
              ) : (
                // Default View: Show placeholders/locked code
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 select-none bg-background/80 backdrop-blur-sm">
                  <Bot className="h-10 w-10 text-primary animate-pulse mb-3" />
                  <p className="text-xs font-semibold text-foreground">AI Refactoring Lock</p>
                  <p className="text-[10px] text-muted-foreground max-w-[200px] mt-1">
                    Click "Apply AI Patch" at the top right to start the streaming code replacements.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Info pane */}
        <div className="space-y-4">
          
          {/* File location card */}
          <Card className="border-border/60 bg-card/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground border-b border-border/50 pb-2">
                <FileCode className="h-4 w-4" />
                <span className="font-semibold uppercase text-slate-300">File Footprint</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">FilePath</span>
                  <span className="font-mono text-[11px] text-foreground bg-accent/40 px-1 rounded block truncate mt-1">
                    {issue.file}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Line Reference</span>
                  <span className="font-mono text-foreground font-semibold mt-0.5 block">
                    Line {issue.line}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Auditor instructions card */}
          <Card className="border-border/60 bg-card/50">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs text-emerald-400 border-b border-border/50 pb-2">
                <GitCommit className="h-4 w-4" />
                <span className="font-semibold uppercase">Review Verdict</span>
              </div>
              <div className="text-xs leading-relaxed text-muted-foreground space-y-2">
                <p className="font-semibold text-foreground text-[11px]">Recommended Action:</p>
                <p>{issue.fixDescription}</p>
                <div className="mt-3.5 p-3.5 rounded-xl bg-background/50 border border-border/60 text-[10.5px]">
                  <p className="text-emerald-400 font-semibold mb-1">Status Code Verification</p>
                  {fixed ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-1 mt-1">
                      <Check className="h-4 w-4" /> Compliant (PASS)
                    </span>
                  ) : refactoring ? (
                    <span className="text-primary font-bold flex items-center gap-2 mt-1">
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" /> Compiling...
                    </span>
                  ) : (
                    <span className="text-rose-400 font-bold flex items-center gap-1 mt-1">
                      Non-Compliant (FAIL)
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </AppShell>
  );
}
