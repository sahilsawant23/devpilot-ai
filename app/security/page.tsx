import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import { SecurityClient } from '@/components/security-client';

export const metadata: Metadata = {
  title: 'Security Compliance — DevPilot AI',
  description: 'DevPilot AI codebase security, isolated container runs, network policies, zero data retention compliance logs, and trust reports.',
};

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      <main className="relative overflow-hidden pt-24 pb-16">
        {/* Background Grid */}
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
        <div
          className="absolute right-1/4 top-10 -z-10 h-[380px] w-[500px] rounded-full bg-gradient-to-br from-blue-600/10 to-indigo-600/10 blur-3xl"
          aria-hidden="true"
        />
        <SecurityClient />
      </main>
      <Footer />
    </div>
  );
}
