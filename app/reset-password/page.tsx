'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle, Lock } from 'lucide-react';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { PasswordInput, FormField } from '@/components/password-input';
import { toast } from 'sonner';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  if (!token) {
    return (
      <AuthLayout title="Invalid link" subtitle="This password reset link is missing or malformed.">
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/15 text-destructive">
            <XCircle className="h-7 w-7" />
          </div>
          <p className="text-sm text-muted-foreground">
            Please request a new reset link from the forgot password page.
          </p>
          <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90">
            <Link href="/forgot-password">Request new link</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout title="Password updated!" subtitle="Your password has been reset successfully.">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
            onClick={() => router.push('/login')}
          >
            Sign in with new password
          </Button>
        </div>
      </AuthLayout>
    );
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!password) return setError('Password is required');
    if (password.length < 8) return setError('Use at least 8 characters');
    if (password !== confirm) return setError('Passwords do not match');
    setError(undefined);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Reset failed. Please try again.');
        setLoading(false);
        return;
      }

      toast.success('Password reset successfully!');
      setDone(true);
    } catch {
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Choose a strong password for your account."
      footer={
        <>
          Remember it?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormField id="new-password" label="New password">
          <PasswordInput value={password} onChange={setPassword} showStrength id="new-password" />
        </FormField>

        <FormField id="confirm-password" label="Confirm password">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter password"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </FormField>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating password...
            </>
          ) : (
            'Reset password'
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
