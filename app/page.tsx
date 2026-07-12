import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import {
  LandingHero,
  LandingFeatures,
  LandingHowItWorks,
  LandingTestimonials,
  LandingPricing,
  LandingFAQ,
  LandingCTA,
} from '@/components/landing-sections';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingTestimonials />
        <LandingPricing />
        <LandingFAQ />
        <LandingCTA />
      </main>
      <Footer />
    </div>
  );
}
