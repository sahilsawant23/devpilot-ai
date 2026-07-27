'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertOctagon, RotateCcw, Home, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Unhandled runtime error captured:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-500 shadow-lg">
          <AlertOctagon className="h-8 w-8" />
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred in DevPilot AI. Our automated diagnostics system has recorded this event.
        </p>

        {error.message && (
          <div className="mt-4 rounded-xl border border-border bg-card p-3 text-left font-mono text-xs text-muted-foreground overflow-x-auto">
            {error.message}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <RotateCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button asChild variant="outline">
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>

          <Button asChild variant="ghost">
            <Link href="/contact">
              <LifeBuoy className="mr-2 h-4 w-4" />
              Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
