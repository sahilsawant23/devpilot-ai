'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, GitBranch, Users, ArrowRight, ArrowLeft,
  CheckCircle2, Code2, BookOpen, Bug, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const STEPS = ['Welcome', 'Your workflow', 'Almost done'];

const USE_CASES = [
  { id: 'review', icon: Bug, label: 'Code Review', desc: 'Detect bugs & security issues automatically' },
  { id: 'docs', icon: BookOpen, label: 'Documentation', desc: 'Auto-generate READMEs & API docs' },
  { id: 'chat', icon: Code2, label: 'AI Chat', desc: 'Chat with your codebase to understand it faster' },
  { id: 'tests', icon: Zap, label: 'Unit Tests', desc: 'Generate comprehensive test suites' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  async function finish() {
    setLoading(true);
    try {
      await fetch('/api/auth/onboarding', { method: 'POST' });
      toast.success('Welcome to DevPilot AI! 🚀');
      router.push('/dashboard');
    } catch {
      toast.error('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300 ${
                    i < step
                      ? 'bg-emerald-500 text-white'
                      : i === step
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`hidden text-xs sm:inline ${i === step ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px w-8 transition-all duration-500 ${i < step ? 'bg-emerald-500' : 'bg-border'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step content */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-2xl backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-8 text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-purple-500/25">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h1 className="mb-2 text-2xl font-bold">Welcome to DevPilot AI</h1>
                <p className="mb-8 text-muted-foreground">
                  Your AI-powered software engineering assistant. Let's get you set up in under a minute.
                </p>
                <div className="mb-8 grid grid-cols-3 gap-3">
                  {[
                    { icon: GitBranch, label: 'Connect repos' },
                    { icon: Code2, label: 'Analyze code' },
                    { icon: Zap, label: 'Ship faster' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="rounded-xl border border-border/60 bg-background/40 p-3 text-center">
                      <Icon className="mx-auto mb-1.5 h-5 w-5 text-primary" />
                      <p className="text-xs font-medium">{label}</p>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                  onClick={() => setStep(1)}
                >
                  Get started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-8"
              >
                <h2 className="mb-1 text-xl font-bold">What will you use DevPilot for?</h2>
                <p className="mb-6 text-sm text-muted-foreground">Select all that apply — we'll tailor your experience.</p>
                <div className="mb-6 grid grid-cols-2 gap-3">
                  {USE_CASES.map(({ id, icon: Icon, label, desc }) => (
                    <button
                      key={id}
                      onClick={() => toggle(id)}
                      className={`group relative rounded-xl border p-4 text-left transition-all duration-200 ${
                        selected.includes(id)
                          ? 'border-primary/60 bg-primary/10 ring-1 ring-primary/30'
                          : 'border-border/60 bg-background/40 hover:border-border hover:bg-accent/40'
                      }`}
                    >
                      {selected.includes(id) && (
                        <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-primary" />
                      )}
                      <Icon className={`mb-2 h-5 w-5 ${selected.includes(id) ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                    onClick={() => setStep(2)}
                  >
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.25 }}
                className="p-8 text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/25">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h2 className="mb-2 text-xl font-bold">You're all set!</h2>
                <p className="mb-8 text-muted-foreground">
                  Head to your dashboard to connect your first repository and start using AI-powered code tools.
                </p>
                <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-left">
                  <p className="mb-2 text-sm font-semibold text-emerald-400">✨ Your plan includes:</p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li>• Unlimited AI chat sessions</li>
                    <li>• Up to 10 repository connections</li>
                    <li>• Code review &amp; bug detection</li>
                    <li>• Documentation generation</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                    onClick={finish}
                    disabled={loading}
                  >
                    {loading ? 'Setting up...' : 'Go to Dashboard'} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Already familiar?{' '}
          <button onClick={finish} className="text-primary hover:underline">
            Skip setup
          </button>
        </p>
      </div>
    </div>
  );
}
