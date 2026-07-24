import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import { CookiesClient } from '@/components/cookies-client';

export const metadata: Metadata = {
  title: 'Cookie Policy — DevPilot AI',
  description: 'DevPilot AI Cookie Policy. Learn about essential, analytical, and marketing cookies we utilize and configure your active preferences.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      <main className="relative overflow-hidden pt-24 pb-16">
        {/* Background Grid */}
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
        <div
          className="absolute left-1/4 bottom-10 -z-10 h-[380px] w-[500px] rounded-full bg-gradient-to-br from-indigo-600/10 to-blue-600/10 blur-3xl"
          aria-hidden="true"
        />
        <CookiesClient />
      </main>
      <Footer />
    </div>
  );
}
