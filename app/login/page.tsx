'use client';

import * as React from 'react';
import Link from 'next/link';
import { Github, Mail, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PasswordInput, FormField } from '@/components/password-input';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = React.useState(false);

  function validate() {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Invalid credentials');
        setLoading(false);
        return;
      }

      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (err) {
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your DevPilot AI account to continue."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormField id="email" label="Email">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="pl-10"
              aria-invalid={!!errors.email}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </FormField>

        <FormField
          id="password"
          label="Password"
          hint={
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>
          }
        >
          <PasswordInput value={password} onChange={setPassword} id="password" />
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
        </FormField>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <Checkbox checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
          Remember me for 30 days
        </label>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-background px-2 text-xs text-muted-foreground">
            OR CONTINUE WITH
          </span>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={() => toast.info('GitHub OAuth coming soon')}>
        <Github className="mr-2 h-4 w-4" />
        Continue with GitHub
      </Button>
    </AuthLayout>
  );
}
