import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import { ContactClient } from '@/components/contact-client';

export const metadata: Metadata = {
  title: 'Contact Us — DevPilot AI',
  description: 'Get in touch with the DevPilot AI team. Contact us for sales inquiries, custom integrations, enterprise deployments, or technical support.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      <main className="relative overflow-hidden pt-24 pb-16">
        {/* Background Gradients */}
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
        <div
          className="absolute right-1/4 top-10 -z-10 h-[380px] w-[500px] rounded-full bg-gradient-to-br from-blue-600/15 to-purple-600/15 blur-3xl"
          aria-hidden="true"
        />
        <ContactClient />
      </main>
      <Footer />
    </div>
  );
}
