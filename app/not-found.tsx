'use client';

import Link from 'next/link';
import { ArrowLeft, Home, FileQuestion, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <MarketingNavbar />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        {/* Glowing Background Orbs */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[450px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-pink-600/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-xl backdrop-blur-xl">
            <FileQuestion className="h-10 w-10 animate-bounce" />
          </div>

          <h1 className="mt-6 text-7xl font-extrabold tracking-tight text-foreground sm:text-8xl">
            404
          </h1>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Page Not Found
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            Sorry, we couldn&apos;t find the page or resource you were looking for. It might have been moved, deleted, or never existed.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
