'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Terminal, Send, Play, CheckCircle, ShieldAlert, Key } from 'lucide-react';
import { toast } from 'sonner';

const endpoints = [
  {
    method: 'POST',
    path: '/v1/projects/index',
    description: 'Trigger a remote AST and vector indexing process for a connected Git repository.',
    params: [
      { name: 'repo_url', type: 'string', required: true, desc: 'The HTTPS URL of the Git repository.' },
      { name: 'branch', type: 'string', required: false, desc: 'Branch to index. Defaults to "main".' },
      { name: 'exclude_patterns', type: 'array', required: false, desc: 'Glob patterns to ignore from indexing.' },
    ],
    response: {
      status: 'success',
      project_id: 'proj_8f3c2b9a71e',
      indexing_job_id: 'job_4e09f8a12d3',
      indexed_files_count: 382,
      status_url: 'https://api.devpilot.ai/v1/jobs/job_4e09f8a12d3',
    },
  },
  {
    method: 'POST',
    path: '/v1/chats/completion',
    description: 'Ask context-aware questions against the indexed codebase repository.',
    params: [
      { name: 'project_id', type: 'string', required: true, desc: 'The target project ID.' },
      { name: 'prompt', type: 'string', required: true, desc: 'The prompt query or instruction.' },
      { name: 'stream', type: 'boolean', required: false, desc: 'Whether to stream response tokens.' },
    ],
    response: {
      message: 'Sure, here is how the checkout middleware operates. It validates token signatures and calls the billing endpoint...',
      sources: [
        { file: 'lib/middleware/auth.ts', lines: '24-48' },
        { file: 'app/api/checkout/route.ts', lines: '12-32' },
      ],
      tokens_used: 488,
    },
  },
  {
    method: 'GET',
    path: '/v1/projects/reports',
    description: 'Fetch the latest bug audit scores and quality reports.',
    params: [
      { name: 'project_id', type: 'string', required: true, desc: 'The target project ID.' },
    ],
    response: {
      health_score: 92,
      issues_found: {
        critical: 0,
        warning: 3,
        info: 8,
      },
      scanned_at: '2026-07-24T18:30:12Z',
    },
  },
];

export function APIClient() {
  const [selectedEndpoint, setSelectedEndpoint] = React.useState(endpoints[0]);
  const [running, setRunning] = React.useState(false);
  const [consoleResponse, setConsoleResponse] = React.useState<string | null>(null);

  function runRequest() {
    setRunning(true);
    setConsoleResponse(null);
    setTimeout(() => {
      setRunning(false);
      setConsoleResponse(JSON.stringify(selectedEndpoint.response, null, 2));
      toast.success('Mock API request completed!');
    }, 800);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="py-12 border-b border-border/40 mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">API Reference</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Integrate DevPilot AI into your local pipelines and CLI scripts.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 max-w-6xl mx-auto">
        {/* Endpoint Selector & Specs (Left Column) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Base Url Info */}
          <div className="rounded-xl border border-border bg-card/30 p-6 space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              Authentication
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every request must include your developer workspace key inside the HTTP authorization header. Get your key in the settings dashboard.
            </p>
            <div className="rounded-lg bg-black border border-white/5 p-3.5 font-mono text-[10px] text-muted-foreground overflow-x-auto">
              Authorization: Bearer devpilot_live_sk_...
            </div>
          </div>

          {/* Endpoint Details */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {endpoints.map((ep) => (
                <button
                  key={ep.path}
                  onClick={() => {
                    setSelectedEndpoint(ep);
                    setConsoleResponse(null);
                  }}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-mono font-bold transition-all border ${
                    selectedEndpoint.path === ep.path
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'border-border bg-card/20 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    ep.method === 'POST' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
                  }`}>
                    {ep.method}
                  </span>
                  {ep.path}
                </button>
              ))}
            </div>

            {/* Spec Card */}
            <div className="rounded-2xl border border-border bg-card/45 p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded font-mono font-extrabold ${
                    selectedEndpoint.method === 'POST' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'
                  }`}>
                    {selectedEndpoint.method}
                  </span>
                  {selectedEndpoint.path}
                </h3>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  {selectedEndpoint.description}
                </p>
              </div>

              {/* Params list */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-3">Body Parameters</h4>
                <div className="divide-y divide-border border-t border-b border-border">
                  {selectedEndpoint.params.map((p) => (
                    <div key={p.name} className="py-3 flex flex-col sm:flex-row justify-between gap-1 text-xs">
                      <div>
                        <span className="font-mono font-bold text-foreground">{p.name}</span>
                        <span className="ml-2 font-mono text-[10px] text-muted-foreground">({p.type})</span>
                        {p.required && <span className="ml-2 text-[10px] text-destructive font-bold uppercase">Required</span>}
                        <p className="mt-1 text-muted-foreground">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Response Console (Right Column) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-border bg-black/90 p-4 sticky top-24 font-mono text-xs flex flex-col h-[520px] shadow-2xl">
            {/* Console Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5" />
                API Console
              </span>
              <Button
                onClick={runRequest}
                disabled={running}
                size="sm"
                className="bg-primary text-white hover:bg-primary/90 h-7 text-[10px] rounded-md"
              >
                {running ? 'Sending...' : (
                  <>
                    Send Request
                    <Play className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
            </div>

            {/* Request block */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Request URL</div>
                <div className="bg-white/5 border border-white/10 rounded p-2 text-emerald-400 font-mono text-[10px] break-all">
                  https://api.devpilot.ai{selectedEndpoint.path}
                </div>

                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-4 mb-2">Headers</div>
                <div className="bg-white/5 border border-white/10 rounded p-2 text-muted-foreground font-mono text-[10px] leading-relaxed">
                  Content-Type: application/json<br />
                  Authorization: Bearer devpilot_live_sk_...
                </div>
              </div>

              {/* Response block */}
              <div className="flex-1 flex flex-col mt-4 min-h-0">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Response Payload</div>
                <div className="flex-1 bg-white/5 border border-white/10 rounded p-3 font-mono text-[10px] overflow-auto scrollbar-thin text-emerald-400">
                  {running ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <span className="animate-pulse">Loading response data...</span>
                    </div>
                  ) : consoleResponse ? (
                    <pre className="text-emerald-400 leading-relaxed">{consoleResponse}</pre>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-center">
                      Click &ldquo;Send Request&rdquo; to query the API mock service.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
