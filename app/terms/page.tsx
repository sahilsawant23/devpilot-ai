import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import { Scale, FileText, CheckCircle, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — DevPilot AI',
  description: 'DevPilot AI Terms of Service. Review rules for account creation, workspace usage, API limits, and billing terms.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      <main className="relative overflow-hidden pt-24 pb-16">
        {/* Background Grid */}
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-12 border-b border-border/40 mb-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur mb-4">
              <Scale className="h-3.5 w-3.5 text-primary" />
              Legal Agreements
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Last updated: July 24, 2026</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 max-w-6xl mx-auto">
            {/* Sticky Table of Contents (Left) */}
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-24 space-y-4 border-l border-border pl-4 py-1">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">On this page</div>
                <a href="#acceptance" className="block text-xs font-medium text-muted-foreground hover:text-primary transition-colors">1. Acceptance of Terms</a>
                <a href="#accounts" className="block text-xs font-medium text-muted-foreground hover:text-primary transition-colors">2. Account Registration</a>
                <a href="#license" className="block text-xs font-medium text-muted-foreground hover:text-primary transition-colors">3. License & Code Use</a>
                <a href="#billing" className="block text-xs font-medium text-muted-foreground hover:text-primary transition-colors">4. Billing & Subscriptions</a>
                <a href="#limits" className="block text-xs font-medium text-muted-foreground hover:text-primary transition-colors">5. API Usage Limits</a>
                <a href="#disclaimer" className="block text-xs font-medium text-muted-foreground hover:text-primary transition-colors">6. Liability Disclaimer</a>
              </div>
            </aside>

            {/* Document Content (Right) */}
            <div className="lg:col-span-9 rounded-2xl border border-border bg-card/25 p-6 md:p-10 backdrop-blur space-y-8 text-sm text-muted-foreground leading-relaxed">
              
              <section id="acceptance" className="space-y-3 scroll-mt-24">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  1. Acceptance of Terms
                </h2>
                <p>
                  By creating an account or accessing the DevPilot AI indexing service, you agree to comply with and be bound by these Terms of Service. If you are entering into this agreement on behalf of a company, you represent that you have authority to bind that entity.
                </p>
              </section>

              <section id="accounts" className="space-y-3 scroll-mt-24">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  2. Account Registration
                </h2>
                <p>
                  You must provide accurate, current profile information. You are solely responsible for all API requests triggered by your credentials or workspace tokens. Notify support immediately of any security breaches.
                </p>
              </section>

              <section id="license" className="space-y-3 scroll-mt-24">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" />
                  3. License & Code Use
                </h2>
                <p>
                  DevPilot AI grants you a limited, non-exclusive license to use the CLI and browser interface. You retain all copyrights and IP ownership of the source code repositories you connect. DevPilot only reads files to perform indexing operations.
                </p>
              </section>

              <section id="billing" className="space-y-3 scroll-mt-24">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  4. Billing & Subscriptions
                </h2>
                <p>
                  Starter plans are free. Paid plans (Pro, Team) are billed on a recurring monthly or annual basis. You can cancel at any time, but no refunds will be provided for partial months of service.
                </p>
              </section>

              <section id="limits" className="space-y-3 scroll-mt-24">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  5. API Usage Limits
                </h2>
                <p>
                  To prevent abuse, we apply rate limits to indexing queues and chat requests. If you exceed limits, requests will return a HTTP 429 status code. Custom quotas are available for Enterprise workspaces.
                </p>
              </section>

              <section id="disclaimer" className="space-y-3 scroll-mt-24">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" />
                  6. Liability Disclaimer
                </h2>
                <p>
                  DevPilot AI is provided &ldquo;as is&rdquo;. We do not guarantee that the code explanations, bug reports, or generated unit tests are error-free or suitable for a specific runtime environment. Always verify code outputs before pushing to production.
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
