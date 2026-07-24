'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Search, Calendar, User, Clock, ArrowRight, BookOpen, X } from 'lucide-react';

const categories = ['All', 'AI & ML', 'Engineering', 'Security', 'Company'];

const posts = [
  {
    id: 1,
    title: 'How DevPilot AI Indexes a 1M+ Line Codebase in Under 60 Seconds',
    excerpt: 'Deep dive into our hierarchical representation indexer, compiler-aware parsing engines, and vector-graph hybrid database architecture.',
    category: 'Engineering',
    author: 'Sarah Chen (CTO)',
    date: 'July 18, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=500&auto=format&fit=crop&q=60',
    content: `
      <h2>The Challenge of Scale</h2>
      <p>When engineering teams adopt AI coding tools, the most common frustration is context limits. Standard LLMs can only read a few files at once, meaning the AI is blind to references, dependencies, and imports outside the immediate view. To fix this, most solutions run simplistic keyword or vector searches.</p>
      <p>However, pure vector similarity fails for code. A function calling another function on the other side of the repository doesn't look similar in plain text, but it is structurally critical.</p>

      <h2>Our Solution: The Vector-Graph Hybrid</h2>
      <p>DevPilot AI solves this by building a hybrid vector-graph representation of your codebase:</p>
      <ul>
        <li><strong>Compiler-Aware AST Parsing:</strong> We construct an Abstract Syntax Tree (AST) for every file to trace definitions, exports, imports, and cross-references.</li>
        <li><strong>Hierarchical Summarization:</strong> We recursively summarize code blocks, files, directories, and modules.</li>
        <li><strong>Incremental Updates:</strong> Only modified files are parsed during git commits, which updates the graph in real-time.</li>
      </ul>

      <h2>Real-world Performance</h2>
      <p>In our latest benchmark, indexing a repository with 1.2 million lines of TypeScript and Go code took exactly 48.2 seconds on our distributed indexing agents, consuming negligible local CPU. The result is instant, context-aware answers that actually compile.</p>
    `,
  },
  {
    id: 2,
    title: 'Detecting Subtle Race Conditions Using LLM-Guided Reasoning',
    excerpt: 'Static analysis tools miss them, code reviews bypass them. Learn how we combine AST analysis with AI solvers to find multi-threaded bugs.',
    category: 'AI & ML',
    author: 'Priya Nair (Lead AI)',
    date: 'July 12, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=500&auto=format&fit=crop&q=60',
    content: `
      <h2>The Invisibility of Race Conditions</h2>
      <p>Race conditions are the ghosts of software engineering. They occur when two execution flows depend on shared state, producing non-deterministic errors that are incredibly difficult to reproduce locally.</p>
      <p>Traditional static analysis checks for locked resources, but cannot evaluate complex business logic flows. Here's how DevPilot's AI code review finds them.</p>

      <h2>AI-Guided Symbolic Execution</h2>
      <p>DevPilot combines traditional abstract interpretation with generative reasoning:</p>
      <ol>
        <li><strong>Path Extraction:</strong> We extract all concurrent or asynchronous paths that write to shared global or DB resources.</li>
        <li><strong>Conflict Formulation:</strong> We formulate safety constraints and ask the AI solver to find inputs or schedules that violate these constraints.</li>
        <li><strong>Review Report:</strong> If a violation is found, we present a step-by-step trace showing exactly how the race condition manifests and recommend a lock or atomic transaction.</li>
      </ol>
    `,
  },
  {
    id: 3,
    title: 'Securing Your Code: Our Isolation and Zero-Retention Policy',
    excerpt: 'Security is paramount when working with proprietary codebases. An overview of how we isolate container runtimes and protect your IP.',
    category: 'Security',
    author: 'Alex Morgan (CEO)',
    date: 'July 05, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=60',
    content: `
      <h2>Your Code is Your Core IP</h2>
      <p>At DevPilot AI, we operate under a simple philosophy: <strong>Your code belongs to you.</strong> We do not train our models on customer code, nor do we store persistent code snippets on our shared servers.</p>

      <h2>The DevPilot Security Architecture</h2>
      <p>We built our security framework around three key pillars:</p>
      <ul>
        <li><strong>Isolated Container Sandboxes:</strong> Every workspace indexing process runs in a sandboxed gVisor container.</li>
        <li><strong>In-Memory Processing:</strong> Repository vectors are stored securely, while source text is only retrieved in-memory on-demand during chat queries, never written to disk.</li>
        <li><strong>End-to-End Encryption:</strong> All data in transit is protected using TLS 1.3, and vector embeddings are encrypted at rest with AES-256 keys managed via KMS.</li>
      </ul>
    `,
  },
  {
    id: 4,
    title: 'Announcing DevPilot AI Seed Round and Product Vision',
    excerpt: 'We have raised $6.2M in seed funding to build the next generation of compiler-aware software engineering agents.',
    category: 'Company',
    author: 'Alex Morgan (CEO)',
    date: 'June 28, 2026',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60',
    content: `
      <h2>A New Chapter for Developer Tools</h2>
      <p>Today we are thrilled to announce that DevPilot AI has raised $6.2 million in seed funding led by Benchmark Capital, with participation from developer-founders across the ecosystem.</p>
      <p>This capital will accelerate our core indexing technology and support our efforts to launch our IDE plugins and CI/CD automated review bots.</p>

      <h2>Our Core Vision</h2>
      <p>We believe AI shouldn't just autocomplete characters. It should comprehend structure. Our goal is to build an agent that runs tests, fixes failing runs, and submits clean, documented pull requests automatically.</p>
    `,
  },
];

export function BlogClient() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [query, setQuery] = React.useState('');
  const [activePost, setActivePost] = React.useState<typeof posts[0] | null>(null);

  const filteredPosts = React.useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase()) ||
                            p.excerpt.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, query]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="py-12 md:py-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur mb-6">
          <BookOpen className="h-3 w-3 text-primary" />
          DevPilot Blog
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl max-w-3xl mx-auto">
          Insights on AI, engineering, and <span className="gradient-text">security</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Technical articles, engineering deep dives, product releases, and company updates from the DevPilot team.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 border-b border-border/60 pb-8 sm:flex-row">
        {/* Category Toggles */}
        <div className="flex flex-wrap gap-1.5 order-2 sm:order-1">
          {categories.map((c) => (
            <Button
              key={c}
              variant={selectedCategory === c ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSelectedCategory(c)}
              className={selectedCategory === c ? 'bg-primary text-white hover:bg-primary/90' : 'text-muted-foreground'}
            >
              {c}
            </Button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full max-w-xs order-1 sm:order-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 pl-9 bg-card"
          />
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {filteredPosts.map((p) => (
          <Card
            key={p.id}
            className="group overflow-hidden border-border/60 bg-card/30 transition-all duration-300 hover:border-primary/40 hover:bg-card/50 cursor-pointer"
            onClick={() => setActivePost(p)}
          >
            <div className="aspect-[16/9] w-full overflow-hidden bg-muted relative">
              <img
                src={p.image}
                alt={p.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[10px] font-semibold tracking-wider text-white uppercase">
                {p.category}
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {p.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {p.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {p.readTime}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
                {p.title}
              </h3>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                {p.excerpt}
              </p>
              <div className="mt-6 flex items-center text-sm font-medium text-primary group-hover:underline">
                Read Article
                <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="py-24 text-center text-muted-foreground">
          No articles found matching &ldquo;{query}&rdquo;
        </div>
      )}

      {/* Article Detail Dialog */}
      <Dialog open={!!activePost} onOpenChange={(open) => !open && setActivePost(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto border-border bg-card p-0 scrollbar-thin">
          {activePost && (
            <div>
              <div className="aspect-[21/9] w-full overflow-hidden relative">
                <img
                  src={activePost.image}
                  alt={activePost.title}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => setActivePost(null)}
                  className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary uppercase tracking-wider text-[10px]">
                    {activePost.category}
                  </span>
                  <span>•</span>
                  <span>{activePost.author}</span>
                  <span>•</span>
                  <span>{activePost.date}</span>
                </div>
                <DialogTitle className="text-2xl md:text-3xl font-bold leading-tight">
                  {activePost.title}
                </DialogTitle>
                <div
                  className="mt-6 prose prose-invert max-w-none text-sm text-muted-foreground leading-relaxed space-y-4 prose-headings:text-foreground prose-headings:font-bold prose-h2:text-lg prose-h2:mt-6 prose-ul:list-disc prose-ul:pl-6"
                  dangerouslySetInnerHTML={{ __html: activePost.content }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
