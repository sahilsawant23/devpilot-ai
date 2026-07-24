import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import { CareersClient } from '@/components/careers-client';

export const metadata: Metadata = {
  title: 'Careers — DevPilot AI',
  description: 'Join the team building the future of software engineering. Explore open positions in AI engineering, frontend systems, DevRel, and product development.',
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      <main className="relative overflow-hidden pt-24 pb-16">
        {/* Background Gradients */}
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
        <div
          className="absolute left-1/4 bottom-20 -z-10 h-[380px] w-[500px] rounded-full bg-gradient-to-br from-blue-600/15 to-purple-600/15 blur-3xl"
          aria-hidden="true"
        />
        <CareersClient />
      </main>
      <Footer />
    </div>
  );
}
