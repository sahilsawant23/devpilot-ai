'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen,
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  ChevronRight,
} from 'lucide-react';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function BlogSlugPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || '1';

  const post = {
    title: 'How DevPilot AI Indexes a 1M+ Line Codebase in Under 60 Seconds',
    category: 'Engineering',
    author: 'Sarah Chen (CTO)',
    date: 'July 18, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800&auto=format&fit=crop&q=60',
    content: `
      <h2>The Challenge of Scale</h2>
      <p>When engineering teams adopt AI coding tools, the most common frustration is context limits. Standard LLMs can only read a few files at once, meaning the AI is blind to references, dependencies, and imports outside the immediate view.</p>

      <h2>Our Solution: The Vector-Graph Hybrid</h2>
      <p>DevPilot AI solves this by building a hybrid vector-graph representation of your codebase:</p>
      <ul>
        <li><strong>Compiler-Aware AST Parsing:</strong> We construct an Abstract Syntax Tree (AST) for every file to trace definitions, exports, imports, and cross-references.</li>
        <li><strong>Hierarchical Summarization:</strong> We recursively summarize code blocks, files, directories, and modules.</li>
      </ul>
    `,
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <MarketingNavbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/blog" className="hover:text-foreground">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{post.category}</span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-xl">
            <div className="aspect-[21/9] w-full overflow-hidden relative">
              <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
            </div>

            <div className="p-6 md:p-10">
              <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-semibold text-primary uppercase text-[10px]">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3" /> {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {post.date}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Article link copied to clipboard');
                  }}
                >
                  <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share
                </Button>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                {post.title}
              </h1>

              <div
                className="prose prose-invert max-w-none text-sm text-muted-foreground leading-relaxed space-y-4 prose-h2:text-xl prose-h2:font-bold prose-h2:text-foreground prose-ul:list-disc prose-ul:pl-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-10 border-t border-border/60 pt-6">
                <Button variant="outline" size="sm" onClick={() => router.push('/blog')}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog Articles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
