'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Terminal, Code2, ShieldCheck, GitBranch, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const sections = [
  {
    id: 'intro',
    title: 'Introduction',
    icon: BookOpen,
    content: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">What is DevPilot AI?</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          DevPilot AI is a context-aware developer assistant that operates directly on your entire repository. Unlike typical AI editors or general chat models that only read active open files, DevPilot AI maps your codebase dependencies, indexes export trees, and provides comprehensive answers anchored in compiler-level architecture.
        </p>

        <div className="rounded-xl border border-border/80 bg-accent/30 p-4 flex gap-3 text-xs leading-relaxed">
          <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-foreground">Important Note:</span> DevPilot AI does not train models on your proprietary code. All indexing occurs on secure container isolates, and vectors are encrypted using KMS keys.
          </div>
        </div>

        <h3 className="text-lg font-semibold pt-4">Key Capabilities</h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            'Deep Semantic Search across files',
            'Full dependency tracking & visual mappings',
            'One-click automated unit test generation',
            'Interactive, grounded AST code review',
          ].map((item, idx) => (
            <li key={idx} className="flex gap-2 text-xs text-muted-foreground">
              <Check className="h-4 w-4 text-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'installation',
    title: 'Installation & Setup',
    icon: Terminal,
    content: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation & Setup</h2>
        <p className="text-sm text-muted-foreground">
          Get started with DevPilot AI in minutes using our VS Code extension or our global Command Line Interface.
        </p>

        <h3 className="text-base font-semibold pt-2">1. CLI Installation</h3>
        <p className="text-xs text-muted-foreground">
          Install the CLI using npm or brew. This is used for background indexing and local git hooks.
        </p>
        <div className="relative rounded-lg bg-black border border-white/10 p-4 font-mono text-[11px] text-emerald-400">
          <span className="text-muted-foreground select-none">$ </span>npm install -g @devpilot/cli
        </div>

        <h3 className="text-base font-semibold pt-2">2. VS Code Extension</h3>
        <p className="text-xs text-muted-foreground">
          Search for <span className="font-medium text-foreground">DevPilot AI</span> in the VS Code marketplace, or install it directly via shell command:
        </p>
        <div className="relative rounded-lg bg-black border border-white/10 p-4 font-mono text-[11px] text-emerald-400">
          <span className="text-muted-foreground select-none">$ </span>code --install-extension devpilot.devpilot-vscode
        </div>

        <h3 className="text-base font-semibold pt-2">3. Authentication</h3>
        <p className="text-xs text-muted-foreground">
          Authenticate your CLI with your dashboard account:
        </p>
        <div className="relative rounded-lg bg-black border border-white/10 p-4 font-mono text-[11px] text-emerald-400">
          <span className="text-muted-foreground select-none">$ </span>devpilot login
        </div>
      </div>
    ),
  },
  {
    id: 'repos',
    title: 'Connecting Repositories',
    icon: GitBranch,
    content: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Connecting Repositories</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You can connect active projects in two ways: via GitHub OAuth integration or by running the local CLI indexer inside any subdirectory.
        </p>

        <h3 className="text-base font-semibold pt-2">GitHub OAuth Integration</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Navigate to your dashboard, click <span className="font-bold">Add Repository</span>, authorize GitHub, and select the repositories you want DevPilot to watch. We will index files and register a webhook to trigger updates automatically on push.
        </p>

        <h3 className="text-base font-semibold pt-2">CLI Local Indexing</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          For private repositories that cannot be linked via OAuth, navigate to the local folder and run:
        </p>
        <div className="relative rounded-lg bg-black border border-white/10 p-4 font-mono text-[11px] text-emerald-400">
          <span className="text-muted-foreground select-none">$ </span>devpilot index --project ./my-cool-app
        </div>
      </div>
    ),
  },
  {
    id: 'ai-chat',
    title: 'AI Chat Guide',
    icon: Code2,
    content: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">AI Chat Guide</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Learn how to query your index graph. The chat interface is grounded in your workspace graph. You can request explanations, refactor methods, and find duplicate abstractions.
        </p>

        <h3 className="text-base font-semibold pt-2">Syntax and Modifiers</h3>
        <p className="text-xs text-muted-foreground">
          Use search annotations to focus the attention scope of the compiler:
        </p>
        <div className="space-y-2.5">
          {[
            { tag: '@filename', desc: 'Focuses analysis specifically on that file (e.g. @auth-service.ts)' },
            { tag: '#symbol', desc: 'Queries a specific class, interface, or struct (e.g. #UserProfile)' },
            { tag: '/command', desc: 'Preconfigured action flags (e.g. /explain, /refactor, /test)' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4 p-3 rounded-lg border border-border bg-background/50 text-xs">
              <span className="font-mono text-primary font-bold shrink-0">{item.tag}</span>
              <span className="text-muted-foreground">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'reviews',
    title: 'Code Reviews & Security',
    icon: ShieldCheck,
    content: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Code Reviews & Security</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Automate bug sweeps and compliance checks. We scan pull requests for logic errors, deadlocks, performance drops, and security secrets leaks.
        </p>

        <h3 className="text-base font-semibold pt-2">GitHub Actions Integration</h3>
        <p className="text-xs text-muted-foreground">
          Create a `.github/workflows/devpilot.yml` file to review PRs automatically:
        </p>
        <pre className="relative rounded-lg bg-black border border-white/10 p-4 font-mono text-[10px] text-emerald-400 overflow-x-auto leading-relaxed">
{`name: DevPilot Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: devpilot-ai/review-action@v1
        with:
          api-token: \${{ secrets.DEVPILOT_API_TOKEN }}`}
        </pre>
      </div>
    ),
  },
];

export function DocsClient() {
  const [activeTab, setActiveTab] = React.useState('intro');
  const [query, setQuery] = React.useState('');

  const filteredSections = React.useMemo(() => {
    return sections.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  const activeSection = sections.find((s) => s.id === activeTab) || sections[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="py-12 border-b border-border/40 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Documentation</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Learn how to setup, configure, and customize DevPilot AI.</p>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search docs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 pl-9 bg-card"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 max-w-6xl mx-auto">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3 space-y-1">
          {filteredSections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors text-left ${
                activeTab === s.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
            >
              <s.icon className="h-4 w-4" />
              {s.title}
            </button>
          ))}
          {filteredSections.length === 0 && (
            <p className="text-xs text-muted-foreground p-3">No matching topics.</p>
          )}
        </aside>

        {/* Content Panel */}
        <div className="lg:col-span-9 rounded-2xl border border-border bg-card/20 p-6 md:p-10 backdrop-blur min-h-[500px]">
          {activeSection.content}
        </div>
      </div>
    </div>
  );
}
