'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  Search,
  Code2,
  Terminal,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const docArticles: Record<string, { title: string; category: string; content: string }> = {
  'quickstart': {
    title: 'Quickstart Guide — Connect Repository in 2 Minutes',
    category: 'Getting Started',
    content: `
      <h2>1. Install DevPilot CLI</h2>
      <p>Install the DevPilot global CLI tool using npm or brew:</p>
      <pre><code>npm install -g devpilot-cli</code></pre>

      <h2>2. Authenticate Your Workspace</h2>
      <p>Link your account using your personal access token:</p>
      <pre><code>devpilot auth login --token dp_live_9a8b7c6d5e4f</code></pre>

      <h2>3. Run Initial Indexing</h2>
      <p>Navigate to your project root and initiate background indexing:</p>
      <pre><code>devpilot index --repo web-platform</code></pre>
    `,
  },
  'api-keys': {
    title: 'API Key Generation & Role Permissions',
    category: 'Authentication',
    content: `
      <h2>Managing API Keys</h2>
      <p>DevPilot AI API keys allow programmatic access to the codebase analysis agent and automated code review endpoints.</p>
      <p>You can create, list, and revoke keys directly inside <strong>Dashboard &gt; Settings &gt; API Keys</strong>.</p>
    `,
  },
};

export default function DocSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || 'quickstart';

  const article = docArticles[slug] || {
    title: `Documentation Topic: ${slug}`,
    category: 'Developer Reference',
    content: `<p>Welcome to the DevPilot AI documentation guide for <strong>${slug}</strong>. This guide details setup procedures, API schemas, and CLI workflows.</p>`,
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/docs" className="hover:text-foreground">Documentation</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{article.category}</span>
          </div>

          <div className="rounded-2xl border border-border bg-card/50 p-6 md:p-10 backdrop-blur-xl">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider mb-4">
              {article.category}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              {article.title}
            </h1>

            <div
              className="prose prose-invert max-w-none text-sm text-muted-foreground leading-relaxed space-y-4 prose-h2:text-lg prose-h2:font-semibold prose-h2:text-foreground prose-pre:bg-black/90 prose-pre:border prose-pre:border-border prose-pre:p-4 prose-pre:rounded-xl"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <div className="mt-10 border-t border-border/60 pt-6 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => router.push('/docs')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Docs Overview
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
