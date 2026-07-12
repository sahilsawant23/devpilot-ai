'use client';

import * as React from 'react';
import {
  FileText,
  BookOpen,
  Boxes,
  Download,
  Copy,
  Check,
  FileCode,
  Loader2,
  Sparkles,
  FileDown,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const docTypes = [
  { id: 'readme', label: 'README', icon: BookOpen, description: 'Project overview and quickstart' },
  { id: 'api', label: 'API Documentation', icon: FileCode, description: 'Endpoint reference and schemas' },
  { id: 'install', label: 'Installation Guide', icon: FileText, description: 'Setup and configuration steps' },
  { id: 'architecture', label: 'Architecture Overview', icon: Boxes, description: 'System design and data flow' },
];

const sampleDocs: Record<string, string> = {
  readme: `# Web Platform

A customer-facing web application built with Next.js 13, featuring server-side rendering, type-safe APIs, and a modern component system.

## Features

- App Router with server components
- Type-safe data layer with Prisma
- Authentication with JWT + refresh tokens
- Tailwind CSS design system
- Comprehensive test coverage

## Quickstart

\`\`\`bash
git clone https://github.com/your-org/web-platform
cd web-platform
npm install
cp .env.example .env.local
npm run dev
\`\`\`

## Scripts

| Command | Description |
|---------|-------------|
| \`npm run dev\` | Start dev server |
| \`npm run build\` | Production build |
| \`npm test\` | Run test suite |

## License

MIT © Your Org`,
  api: `# API Reference

Base URL: \`/api/v1\`

## Authentication

All protected endpoints require a Bearer token:

\`\`\`
Authorization: Bearer <jwt>
\`\`\`

## Endpoints

### POST /auth/login
Authenticate and receive a JWT.

| Param | Type | Required |
|-------|------|----------|
| email | string | yes |
| password | string | yes |

### GET /users/:id
Fetch a user profile. Requires authentication.

### POST /posts
Create a new post. Requires authentication.`,
  install: `# Installation Guide

## Prerequisites

- Node.js 18+
- npm 9+ (or pnpm)
- PostgreSQL 14+
- Redis 7+

## Steps

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Copy env file: \`cp .env.example .env.local\`
4. Configure database URL in \`.env.local\`
5. Run migrations: \`npx prisma migrate dev\`
6. Seed data: \`npm run seed\`
7. Start dev server: \`npm run dev\`

## Environment Variables

- \`DATABASE_URL\` — Postgres connection string
- \`JWT_SECRET\` — Token signing secret
- \`REDIS_URL\` — Cache connection`,
  architecture: `# Architecture Overview

## Layers

\`\`\`
Client → Next.js App Router → API Routes → Service Layer → Data Layer (Prisma) → PostgreSQL
                                                              ↘ Redis (cache)
\`\`\`

## Key Modules

- **App Router** — Server components render UI, client components hydrate interactivity.
- **Service Layer** — Business logic, isolated from transport.
- **Data Layer** — Prisma ORM with typed models.
- **Cache** — Redis for session and query caching.

## Data Flow

1. Request hits an API route
2. Route handler calls the relevant service
3. Service interacts with Prisma and Redis
4. Response is serialized and returned`,
};

export default function DocsPage() {
  const [active, setActive] = React.useState('readme');
  const [generating, setGenerating] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [content, setContent] = React.useState(sampleDocs.readme);

  function generate(type: string) {
    setActive(type);
    setGenerating(true);
    setContent('');
    let i = 0;
    const full = sampleDocs[type];
    const interval = setInterval(() => {
      i += 24;
      setContent(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(interval);
        setGenerating(false);
      }
    }, 18);
  }

  React.useEffect(() => {
    generate('readme');
  }, []);

  function copy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <AppShell>
      <PageHeader
        title="Documentation Generator"
        description="Generate and export documentation for web-platform."
        actions={
          <>
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Markdown
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        {/* Doc type selector */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Document types
          </p>
          {docTypes.map((d) => (
            <button
              key={d.id}
              onClick={() => generate(d.id)}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all',
                active === d.id
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-border/60 bg-card/50 hover:border-primary/30'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                  active === d.id ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                )}
              >
                <d.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{d.label}</p>
                <p className="text-xs text-muted-foreground">{d.description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Preview */}
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                {docTypes.find((d) => d.id === active)?.label} Preview
              </CardTitle>
              <CardDescription className="mt-1">
                {generating ? 'Generating...' : 'Auto-generated from your codebase'}
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={copy} disabled={generating}>
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="relative min-h-[420px] overflow-hidden rounded-xl border border-border bg-[hsl(230_25%_5%)] p-5">
              {generating && (
                <div className="absolute right-4 top-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Writing...
                </div>
              )}
              <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground/90 scrollbar-thin">
                {content}
                {generating && <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-primary align-middle" />}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
