'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/password-input';
import { ShieldCheck, Lock, Cpu, Server, FileText, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

export function SecurityClient() {
  const [email, setEmail] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  function handleRequestReport(e: React.FormEvent) {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Security Packet & SOC2 Draft sent to your email!');
      setEmail('');
    }, 1000);
  }

  const columns = [
    {
      icon: Lock,
      title: 'Data Encryption',
      desc: 'All connections require TLS 1.3. Vector databases and relational index segments are encrypted at rest using AES-256 keys managed via AWS KMS.',
    },
    {
      icon: Cpu,
      title: 'Isolated Indexing sandboxes',
      desc: 'Code compilation checks and indexing steps execute inside gVisor containers, preventing cross-tenant access or persistent shell runs.',
    },
    {
      icon: ShieldCheck,
      title: 'Zero Retention Policy',
      desc: 'Prompts sent to AI inference models are discarded immediately after execution. We never train public language models on your IP.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="py-12 md:py-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur mb-6">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Enterprise Trust
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl max-w-3xl mx-auto">
          Security that keeps your code <span className="gradient-text">safe</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          We protect your intellectual property with enterprise-grade isolation, modern encryption keys, and continuous automated audits.
        </p>
      </div>

      {/* Trust Grid */}
      <div className="grid gap-6 md:grid-cols-3 py-12 max-w-5xl mx-auto">
        {columns.map((c) => (
          <div key={c.title} className="rounded-xl border border-border bg-card/30 p-6 space-y-4">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <c.icon className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold">{c.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Compliance Block */}
      <div className="py-12 border-t border-border/40 max-w-4xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">SOC 2 Type II Audited</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We understand that enterprise software security is non-negotiable. DevPilot AI is built upon security best practices and is continually scanned.
            </p>
            <ul className="space-y-2 text-xs text-muted-foreground">
              {['Continuous threat monitoring & alerting', 'Zero retention contracts with AI inference partners', 'Strict SSO and RBAC workspace permissions'].map((text, i) => (
                <li key={i} className="flex gap-2.5 items-center">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card/45 p-6 space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Request Security Packet
            </h3>
            <p className="text-xs text-muted-foreground">
              Download our latest compliance brief, whitepaper, and SOC2 report drafts.
            </p>
            <form onSubmit={handleRequestReport} className="space-y-3 pt-2" noValidate>
              <FormField id="sec_email" label="Work Email Address">
                <Input
                  id="sec_email"
                  type="email"
                  placeholder="security@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-card"
                />
              </FormField>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 h-10 text-xs"
              >
                {submitting ? 'Requesting Packet...' : (
                  <>
                    Request Packet
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
