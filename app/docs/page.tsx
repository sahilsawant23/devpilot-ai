import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import { DocsClient } from '@/components/docs-client';

export const metadata: Metadata = {
  title: 'Documentation — DevPilot AI',
  description: 'Detailed guides, installation guidelines, and setup guides for the DevPilot AI software engineering assistant.',
};

export default function DocsPage() {
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
        <DocsClient />
      </main>
      <Footer />
    </div>
  );
}
