import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import { Shield, Lock, Eye, ScrollText, Users, Activity, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — DevPilot AI',
  description: 'DevPilot AI Privacy Policy. Learn how we collect, process, isolate, and secure your codebases and account details.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      <main className="relative overflow-hidden pt-24 pb-16">
        {/* Background Grid */}
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 border-b border-border/40 mb-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur mb-4">
              <Shield className="h-3.5 w-3.5 text-primary" />
              Legal & Compliance
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Last updated: July 24, 2026</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 max-w-6xl mx-auto">
            {/* Sticky Table of Contents (Left) */}
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-24 space-y-4 border-l border-border pl-4 py-1">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">On this page</div>
                <a href="#collect" className="block text-xs font-medium text-muted-foreground hover:text-primary transition-colors">1. Information We Collect</a>
                <a href="#how-use" className="block text-xs font-medium text-muted-foreground hover:text-primary transition-colors">2. How We Use Data</a>
                <a href="#security" className="block text-xs font-medium text-muted-foreground hover:text-primary transition-colors">3. Code Isolation & Security</a>
                <a href="#sharing" className="block text-xs font-medium text-muted-foreground hover:text-primary transition-colors">4. Sharing & Disclosure</a>
                <a href="#retention" className="block text-xs font-medium text-muted-foreground hover:text-primary transition-colors">5. Data Retention</a>
                <a href="#rights" className="block text-xs font-medium text-muted-foreground hover:text-primary transition-colors">6. Your Rights</a>
              </div>
            </aside>

            {/* Document Content (Right) */}
            <div className="lg:col-span-9 rounded-2xl border border-border bg-card/25 p-6 md:p-10 backdrop-blur space-y-8 text-sm text-muted-foreground leading-relaxed">
              
              <section id="collect" className="space-y-3 scroll-mt-24">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <ScrollText className="h-4 w-4 text-primary" />
                  1. Information We Collect
                </h2>
                <p>
                  To provide our code indexing and chat services, we collect account details (name, email) and authorization metadata from GitHub if connected.
                </p>
                <p>
                  For repositories indexed locally via CLI, the CLI performs structural syntax parsing on your local machine and only uploads abstract representations of function exports and imports, not full file raw text (unless you request active chat context inclusion).
                </p>
              </section>

              <section id="how-use" className="space-y-3 scroll-mt-24">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  2. How We Use Data
                </h2>
                <p>
                  We use your profile data to configure billing scopes, track API limits, and manage team workspaces. We utilize AST indexes and files vectors solely to ground AI model responses in your codebase context during chat or review operations.
                </p>
              </section>

              <section id="security" className="space-y-3 scroll-mt-24">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  3. Code Isolation & Security
                </h2>
                <p>
                  We respect the proprietary nature of customer code. Your code is processed in ephemeral sandbox isolates and is encrypted during vector construction.
                </p>
                <p className="font-semibold text-foreground">
                  Our Zero-Retention Policy ensures your repository code files are never trained on by our core LLM models.
                </p>
              </section>

              <section id="sharing" className="space-y-3 scroll-mt-24">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  4. Sharing & Disclosure
                </h2>
                <p>
                  We do not sell, rent, or trade customer code or data to third-party brokers. We only route code prompts to isolated AI API inference endpoints under strict zero-retention service level agreements (SLAs).
                </p>
              </section>

              <section id="retention" className="space-y-3 scroll-mt-24">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  5. Data Retention
                </h2>
                <p>
                  We store vector embeddings for your files until you request repository removal or delete your DevPilot account, at which point all linked database segments are deleted within 24 hours.
                </p>
              </section>

              <section id="rights" className="space-y-3 scroll-mt-24">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  6. Your Rights
                </h2>
                <p>
                  You have the right to inspect, edit, or delete any personal information we hold. You can revoke GitHub OAuth access at any time through your GitHub account settings.
                </p>
              </section>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
