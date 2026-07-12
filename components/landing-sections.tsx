'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch,
  MessageSquare,
  ShieldCheck,
  FileText,
  TestTube,
  Bug,
  Sparkles,
  Check,
  ArrowRight,
  Zap,
  Code2,
  Brain,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/fade-in';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Brain,
    title: 'Explain Code',
    description:
      'Ask questions about any codebase and get instant, context-aware explanations of functions, flows, and architecture.',
  },
  {
    icon: Bug,
    title: 'Detect Bugs',
    description:
      'Surface critical issues, security vulnerabilities, and logic errors before they reach production.',
  },
  {
    icon: FileText,
    title: 'Generate Documentation',
    description:
      'Auto-generate READMEs, API docs, architecture overviews, and inline comments that stay in sync.',
  },
  {
    icon: TestTube,
    title: 'Create Unit Tests',
    description:
      'Produce high-coverage test suites tailored to your code with one click — including edge cases.',
  },
  {
    icon: GitBranch,
    title: 'Analyze Repositories',
    description:
      'Get a health score, tech stack breakdown, and structural insights for any GitHub repository.',
  },
  {
    icon: MessageSquare,
    title: 'Chat With Your Code',
    description:
      'A ChatGPT-style interface grounded in your codebase. Ask, refactor, and ship faster.',
  },
];

const steps = [
  {
    icon: GitBranch,
    title: 'Connect a repository',
    description:
      'Import from GitHub or upload a ZIP. DevPilot indexes your code in seconds.',
  },
  {
    icon: Sparkles,
    title: 'Ask or automate',
    description:
      'Chat with your codebase, request a review, or generate tests and docs on demand.',
  },
  {
    icon: Zap,
    title: 'Ship with confidence',
    description:
      'Catch bugs early, keep documentation current, and improve code quality continuously.',
  },
];

const testimonials = [
  {
    quote:
      'DevPilot cut our onboarding time in half. New engineers understand our codebase in days, not weeks.',
    name: 'Sarah Chen',
    role: 'Staff Engineer, Linear',
    avatar: 'https://i.pravatar.cc/100?img=47',
  },
  {
    quote:
      'The bug detection caught a race condition in our payment flow that would have been painful in production.',
    name: 'Marcus Webb',
    role: 'CTO, Fleetbase',
    avatar: 'https://i.pravatar.cc/100?img=12',
  },
  {
    quote:
      'Documentation used to be the last thing we did. Now it is the first, and it writes itself.',
    name: 'Priya Nair',
    role: 'Lead Developer, Notion',
    avatar: 'https://i.pravatar.cc/100?img=32',
  },
  {
    quote:
      'I chat with our codebase like I chat with a senior engineer. It is genuinely transformative.',
    name: 'Alex Rivera',
    role: 'Founder, Cursor Labs',
    avatar: 'https://i.pravatar.cc/100?img=15',
  },
  {
    quote:
      'Test coverage went from 42% to 88% in a week. The generated tests are actually useful.',
    name: 'Jenna Park',
    role: 'QA Lead, Vercel',
    avatar: 'https://i.pravatar.cc/100?img=20',
  },
  {
    quote:
      'The repository health score gives us a single number to track code quality across teams.',
    name: 'David Okafor',
    role: 'Engineering Manager, GitHub',
    avatar: 'https://i.pravatar.cc/100?img=33',
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$0',
    period: '/mo',
    description: 'For individual developers getting started.',
    features: [
      '3 repositories',
      '100 AI chats / month',
      'Basic code review',
      'Community support',
    ],
    cta: 'Start free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$24',
    period: '/mo',
    description: 'For professional developers shipping fast.',
    features: [
      'Unlimited repositories',
      'Unlimited AI chats',
      'Advanced bug detection',
      'Documentation & test generation',
      'Priority support',
    ],
    cta: 'Start 14-day trial',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$79',
    period: '/mo',
    description: 'For engineering teams collaborating.',
    features: [
      'Everything in Pro',
      'Shared workspaces',
      'Team analytics',
      'SSO & SAML',
      'Dedicated support',
    ],
    cta: 'Contact sales',
    highlighted: false,
  },
];

const faqs = [
  {
    q: 'How does DevPilot understand my codebase?',
    a: 'DevPilot indexes your repository structure, parses source files, and builds a semantic understanding of your code. This lets it answer questions with full project context rather than just reading single files.',
  },
  {
    q: 'Is my code sent to third parties?',
    a: 'No. Your code is processed in an isolated environment and never used to train shared models. Enterprise customers can deploy fully on-prem.',
  },
  {
    q: 'Which languages do you support?',
    a: 'TypeScript, JavaScript, Python, Go, Rust, Java, C#, and Ruby. We add new languages regularly based on customer demand.',
  },
  {
    q: 'Can I use DevPilot with private GitHub repos?',
    a: 'Yes. Connect via GitHub OAuth and select which repositories to import. You can revoke access at any time.',
  },
  {
    q: 'Do you offer a free plan?',
    a: 'Yes, the Starter plan is free forever and includes 3 repositories and 100 AI chats per month. No credit card required.',
  },
  {
    q: 'How accurate is the bug detection?',
    a: 'DevPilot combines static analysis with AI reasoning to catch both common and subtle issues. Every finding includes an explanation and a suggested fix so you can verify before applying.',
  },
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* background */}
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div
        className="absolute left-1/2 top-0 -z-10 h-[480px] w-[680px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-purple-600/30 blur-3xl"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            Now with GitHub repository analysis
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
          >
            Your AI Software
            <br />
            <span className="gradient-text">Engineering Assistant</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground"
          >
            Analyze repositories, explain code, detect bugs, generate
            documentation, and build software faster using AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 text-white hover:opacity-90"
            >
              <Link href="/signup">
                Start building free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl px-6"
            >
              <Link href="/dashboard">
                <Sparkles className="mr-2 h-4 w-4" />
                Live demo
              </Link>
            </Button>
          </motion.div>

          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required · Free forever plan
          </p>
        </div>

        {/* Product preview */}
        <FadeIn delay={0.25} className="mt-16">
          <ProductPreview />
        </FadeIn>
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <div
        className="absolute -inset-x-8 -top-8 -z-10 h-40 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl"
        aria-hidden
      />
      <div className="gradient-border overflow-hidden rounded-2xl shadow-2xl shadow-indigo-900/40">
        <div className="glass-dark flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          <span className="ml-3 text-xs text-muted-foreground">
            devpilot.ai/dashboard
          </span>
        </div>
        <div className="grid grid-cols-12 gap-0 bg-card">
          {/* mini sidebar */}
          <div className="col-span-3 hidden border-r border-border p-3 sm:block">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500" />
              <div className="h-3 w-20 rounded bg-muted" />
            </div>
            <div className="space-y-1.5">
              {['Dashboard', 'Repositories', 'AI Chat', 'Code Review', 'Analytics'].map(
                (item, i) => (
                  <div
                    key={item}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px]',
                      i === 0 ? 'bg-primary/15 text-primary' : 'text-muted-foreground'
                    )}
                  >
                    <div className="h-3 w-3 rounded bg-current opacity-60" />
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
          {/* content */}
          <div className="col-span-12 sm:col-span-9 p-4">
            <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                { label: 'Repositories', value: '24', c: 'from-blue-500 to-cyan-500' },
                { label: 'AI Chats', value: '1,284', c: 'from-indigo-500 to-purple-500' },
                { label: 'Bugs Found', value: '342', c: 'from-amber-500 to-orange-500' },
                { label: 'Docs Created', value: '178', c: 'from-pink-500 to-rose-500' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-background/50 p-3"
                >
                  <div className={cn('mb-2 h-7 w-7 rounded-lg bg-gradient-to-br', s.c)} />
                  <div className="text-lg font-semibold">{s.value}</div>
                  <div className="text-[10px] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-background/50 p-3">
                <div className="mb-2 text-[11px] text-muted-foreground">Weekly Activity</div>
                <div className="flex h-24 items-end gap-1.5">
                  {[42, 56, 48, 72, 84, 38, 22].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-blue-500/40 to-indigo-400"
                      style={{ height: `${(h / 84) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-background/50 p-3">
                <div className="mb-2 text-[11px] text-muted-foreground">Language Distribution</div>
                <div className="flex h-24 items-center justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-conic from-blue-500 via-indigo-500 to-purple-500 text-[11px] font-medium text-white">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-card">
                      38%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LandingFeatures() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Features
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to ship better code
          </h2>
          <p className="mt-4 text-muted-foreground">
            A complete AI toolkit that understands your entire codebase and
            helps you move faster at every stage of development.
          </p>
        </FadeIn>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.05}>
              <Card className="group h-full border-border/60 bg-card/50 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-indigo-900/10">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 text-primary transition-transform group-hover:scale-110">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How it works
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            From repository to shipped in three steps
          </h2>
        </FadeIn>

        <div className="relative mt-16 grid gap-8 md:grid-cols-3">
          <div
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
            aria-hidden
          />
          {steps.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.1}>
              <div className="relative text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30">
                  <s.icon className="h-7 w-7" />
                </div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  Step {i + 1}
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingTestimonials() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Testimonials
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Trusted by engineering teams worldwide
          </h2>
        </FadeIn>

        <div className="mt-16 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {testimonials.map((t, i) => (
            <FadeIn key={t.name} delay={(i % 3) * 0.08}>
              <Card className="break-inside-avoid border-border/60 bg-card/50">
                <CardContent className="p-6">
                  <p className="text-sm leading-relaxed text-foreground/90">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingPricing() {
  return (
    <section id="pricing" className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            Pricing
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free. Upgrade when you are ready. Cancel anytime.
          </p>
        </FadeIn>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 lg:grid-cols-3">
          {pricingPlans.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.08}>
              <Card
                className={cn(
                  'relative h-full border-border/60 bg-card/50',
                  p.highlighted && 'gradient-border shadow-xl shadow-indigo-900/20'
                )}
              >
                {p.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight">{p.price}</span>
                    <span className="text-muted-foreground">{p.period}</span>
                  </div>
                  <Button
                    asChild
                    className={cn(
                      'mt-6 w-full',
                      p.highlighted
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90'
                        : ''
                    )}
                    variant={p.highlighted ? 'default' : 'outline'}
                  >
                    <Link href="/signup">{p.cta}</Link>
                  </Button>
                  <ul className="mt-6 space-y-3">
                    {p.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-muted-foreground">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingFAQ() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <section id="faq" className="relative py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            FAQ
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
        </FadeIn>

        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <FadeIn key={f.q} delay={i * 0.04}>
                <div className="overflow-hidden rounded-xl border border-border/60 bg-card/50">
                  <button
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-medium">{f.q}</span>
                    <span
                      className={cn(
                        'text-muted-foreground transition-transform',
                        isOpen && 'rotate-45'
                      )}
                    >
                      +
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-sm text-muted-foreground">{f.a}</p>
                  </motion.div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function LandingCTA() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20 p-10 text-center sm:p-16">
            <div
              className="absolute inset-0 grid-bg opacity-30"
              aria-hidden
            />
            <div className="relative">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-indigo-500/30">
                <Code2 className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Start building faster today
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Join thousands of developers using DevPilot AI to understand,
                improve, and document their codebases.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 text-white hover:opacity-90"
                >
                  <Link href="/signup">
                    Get started free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-xl px-6">
                  <Link href="/dashboard">View live demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
