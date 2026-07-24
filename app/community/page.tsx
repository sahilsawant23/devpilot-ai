import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import { MessageSquare, Slack, Github, Users, Calendar, Award, ExternalLink, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Community — DevPilot AI',
  description: 'Connect with thousands of developers building codebases with DevPilot AI. Join our Discord, Slack, and open source discussions.',
};

const channels = [
  {
    icon: MessageSquare,
    name: 'Discord Server',
    desc: 'Join 5,000+ developers chatting about coding tips, feature requests, and showcasing their AI integrations.',
    cta: 'Join Discord',
    href: 'https://discord.com',
    color: 'from-indigo-500/10 to-indigo-600/10 hover:border-indigo-500/50',
    iconColor: 'text-indigo-400',
  },
  {
    icon: Slack,
    name: 'Slack Channel',
    desc: 'Best for enterprise customers wanting real-time private channels with our engineering staff.',
    cta: 'Request Invite',
    href: '/contact',
    color: 'from-pink-500/10 to-rose-600/10 hover:border-pink-500/50',
    iconColor: 'text-pink-400',
  },
  {
    icon: Github,
    name: 'GitHub Discussions',
    desc: 'Submit compiler configurations, report bugs, ask architectural questions, and view feature roadmaps.',
    cta: 'View Discussions',
    href: 'https://github.com',
    color: 'from-gray-500/10 to-zinc-600/10 hover:border-white/40',
    iconColor: 'text-white',
  },
];

const events = [
  {
    date: 'Aug 12, 2026',
    title: 'DevPilot Community Call: v1.4 Roadmap',
    desc: 'Join Sarah and Marcus for a live walkthrough of our new IDE extension release and automated pull request agent.',
    time: '10:00 AM PST &middot; Zoom',
  },
  {
    date: 'Aug 24, 2026',
    title: 'Workshop: Fine-Tuning Code Context Vectors',
    desc: 'A hands-on engineering lab covering AST token matching and custom index scopes for proprietary monorepos.',
    time: '2:00 PM PST &middot; YouTube Live',
  },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      <main className="relative overflow-hidden pt-24 pb-16">
        {/* Background Grid */}
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
        <div
          className="absolute left-1/2 top-20 -z-10 h-[380px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="py-12 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur mb-6">
              <Users className="h-3 w-3 text-primary" />
              Developer Community
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl max-w-3xl mx-auto">
              Join a global network of <span className="gradient-text">builders</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Collaborate, share index summaries, ask questions, and help build the future of compiler-assisted software development.
            </p>
          </div>

          {/* Channel Cards */}
          <div className="grid gap-6 md:grid-cols-3 py-12 max-w-5xl mx-auto">
            {channels.map((chan) => (
              <Card
                key={chan.name}
                className={`border-border/60 bg-card/25 hover:bg-card/45 transition-all duration-300 ${chan.color}`}
              >
                <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                  <div>
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 ${chan.iconColor}`}>
                      <chan.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold mt-4">{chan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{chan.desc}</p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-6 w-full border-border/80 text-foreground">
                    <a href={chan.href} target={chan.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer">
                      {chan.cta}
                      <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Events & Calendar */}
          <div className="py-12 border-t border-border/40 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 justify-center">
              <Calendar className="h-6 w-6 text-primary" />
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {events.map((ev, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-card/20 p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{ev.date}</span>
                    <h3 className="text-base font-bold">{ev.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ev.desc}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-start sm:items-end gap-2">
                    <span className="text-xs text-muted-foreground" dangerouslySetInnerHTML={{ __html: ev.time }} />
                    <Button size="sm" variant="secondary" className="text-xs">RSVP Now</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contribution Guidelines Banner */}
          <div className="my-12 rounded-2xl border border-border bg-gradient-to-br from-indigo-600/10 to-purple-600/10 p-8 text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
            <div className="relative">
              <div className="mx-auto mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Contribute to DevPilot Open Source</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
                We open-source our language plugins, AST config patterns, and CLI wrappers. Check out our contributor guide on GitHub!
              </p>
              <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  Contributor Guidelines
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
