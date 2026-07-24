import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import { Shield, Sparkles, Code2, Users, Target, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About Us — DevPilot AI',
  description: 'DevPilot AI is built by developers, for developers. Learn about our mission, values, and the team behind the AI Software Engineering Assistant.',
};

const values = [
  {
    icon: Target,
    title: 'Developer-First',
    description: 'We prioritize developer experience in everything we build. Our tool fits seamlessly into your flow without disruption.',
  },
  {
    icon: Shield,
    title: 'Security by Design',
    description: 'We respect your codebase privacy. Your proprietary code is isolated, secure, and never trained on public models.',
  },
  {
    icon: Sparkles,
    title: 'Uncompromised Quality',
    description: 'We blend advanced static analysis with state-of-the-art AI reasoning to deliver accurate, helpful, and bug-free guidance.',
  },
  {
    icon: Users,
    title: 'Collaborative Innovation',
    description: 'We believe AI is a superpower that collaborates with engineers, amplifying their capability and speed.',
  },
];

const team = [
  {
    name: 'Alex Morgan',
    role: 'Co-founder & CEO',
    bio: 'Former Engineering Director at GitHub. Passionate about developer tooling and developer productivity.',
    avatar: 'https://i.pravatar.cc/100?img=8',
  },
  {
    name: 'Sarah Chen',
    role: 'Co-founder & CTO',
    bio: 'AI researcher and systems architect, formerly at OpenAI and Vercel. Led compiler design projects.',
    avatar: 'https://i.pravatar.cc/100?img=47',
  },
  {
    name: 'Marcus Webb',
    role: 'Head of Product',
    bio: 'Designed development platforms at Stripe and Linear. Loves building interfaces that feel alive.',
    avatar: 'https://i.pravatar.cc/100?img=12',
  },
  {
    name: 'Priya Nair',
    role: 'Lead AI Engineer',
    bio: 'Deep learning scientist focusing on large language models for code representation and generation.',
    avatar: 'https://i.pravatar.cc/100?img=32',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      <main className="relative overflow-hidden pt-24 pb-16">
        {/* Decorative Background */}
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
        <div
          className="absolute left-1/2 top-20 -z-10 h-[380px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="py-12 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur mb-6">
              <Code2 className="h-3 w-3 text-primary" />
              Our Story
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl max-w-3xl mx-auto">
              Empowering engineers to build <span className="gradient-text">the future</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              DevPilot AI was founded in 2025 by a team of developers who were tired of spending hours reading legacy code, writing repetitive tests, and documenting complex APIs. We wanted to build an assistant that feels like a senior engineer pair-programming right beside you.
            </p>
          </div>

          {/* Mission Block */}
          <div className="my-12 md:my-16 rounded-2xl border border-border bg-card/30 backdrop-blur p-8 md:p-12 max-w-4xl mx-auto glow">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed text-base">
              Our mission is to eliminate the friction in software engineering. We believe developers should focus on solving hard problems, designing elegant architectures, and building beautiful features, while DevPilot AI handles the tedious context-gathering, test writing, and bug hunting. We are committed to crafting tools that make developers faster, happier, and more creative.
            </p>
          </div>

          {/* Core Values */}
          <div className="py-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-semibold">Core Values</h2>
              <p className="mt-3 text-muted-foreground">The principles that guide how we build our product and our team.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v) => (
                <div key={v.title} className="rounded-xl border border-border/60 bg-card/40 p-6 transition-all hover:border-primary/40 hover:bg-card/60">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <v.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Section */}
          <div className="py-16 border-t border-border/40">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-semibold">Our Journey</h2>
              <p className="mt-3 text-muted-foreground">A timeline of how we grew from an idea to a workspace assistant.</p>
            </div>
            <div className="max-w-3xl mx-auto relative pl-6 border-l border-border/80 space-y-12">
              {[
                { date: 'January 2025', title: 'The Genesis', desc: 'DevPilot AI is founded in a garage with the goal of creating a semantic index for git codebases.' },
                { date: 'April 2025', title: 'Seed Funding', desc: 'Raised seed round to build a compiler-aware semantic graph engine and hire the founding engineering team.' },
                { date: 'September 2025', title: 'Private Beta Launch', desc: 'Released beta to 2,000 developers, indexing over 10,000 active repositories and refining our code-explanation agent.' },
                { date: 'January 2026', title: 'General Availability', desc: 'Launched DevPilot AI to the public. Introduced automated bug detection and integration with popular CI systems.' },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background" />
                  <div className="text-xs font-semibold text-primary uppercase tracking-wider">{item.date}</div>
                  <h3 className="text-lg font-bold mt-1">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="py-16 border-t border-border/40">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-semibold">Meet the Team</h2>
              <p className="mt-3 text-muted-foreground">The designers, engineers, and product minds behind DevPilot AI.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((t) => (
                <div key={t.name} className="rounded-2xl border border-border/60 bg-card/30 p-6 text-center transition-all hover:bg-card/50">
                  <img src={t.avatar} alt={t.name} className="mx-auto h-20 w-20 rounded-full object-cover border border-border shadow" />
                  <h3 className="mt-4 text-base font-semibold">{t.name}</h3>
                  <div className="text-xs text-primary font-medium">{t.role}</div>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{t.bio}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="mt-16 rounded-2xl border border-border bg-gradient-to-br from-blue-600/10 to-purple-600/10 p-8 text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
            <h3 className="text-2xl font-bold mb-2">Want to join the mission?</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">We are always looking for passionate engineers, product thinkers, and research scientists.</p>
            <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90">
              <Link href="/careers">
                View Open Positions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
