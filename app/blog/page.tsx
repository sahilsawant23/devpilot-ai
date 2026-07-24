import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import { BlogClient } from '@/components/blog-client';

export const metadata: Metadata = {
  title: 'Blog — DevPilot AI',
  description: 'Read the latest updates, engineering tutorials, and security insights on AI software assistants from the DevPilot AI team.',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      <main className="relative overflow-hidden pt-24 pb-16">
        {/* Background Gradients */}
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
        <div
          className="absolute right-1/4 top-10 -z-10 h-[380px] w-[500px] rounded-full bg-gradient-to-br from-indigo-600/15 to-purple-600/20 blur-3xl"
          aria-hidden="true"
        />
        <BlogClient />
      </main>
      <Footer />
    </div>
  );
}
