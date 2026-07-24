'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, Shield, Info, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

export function CookiesClient() {
  const [essential, setEssential] = React.useState(true);
  const [analytics, setAnalytics] = React.useState(true);
  const [marketing, setMarketing] = React.useState(false);

  function handleSave() {
    toast.success('Your cookie preferences have been updated!');
  }

  const cookieTypes = [
    {
      id: 'essential',
      title: 'Essential Cookies',
      desc: 'Necessary for the website and authentication sessions to work. Cannot be disabled.',
      required: true,
      state: essential,
      setState: setEssential,
    },
    {
      id: 'analytics',
      title: 'Performance & Analytics',
      desc: 'Allows us to monitor traffic, load speed, and popular pages to enhance workspace efficiency.',
      required: false,
      state: analytics,
      setState: setAnalytics,
    },
    {
      id: 'marketing',
      title: 'Marketing & Targeting',
      desc: 'Used to deliver updates, customize newsletters, and track product trial completions.',
      required: false,
      state: marketing,
      setState: setMarketing,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="py-12 border-b border-border/40 mb-10 text-center md:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur mb-4">
          <Shield className="h-3.5 w-3.5 text-primary" />
          User Preferences
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Cookie Policy</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Manage your tracking, telemetry, and cookie preferences.</p>
      </div>

      <div className="rounded-2xl border border-border bg-card/25 p-6 md:p-8 backdrop-blur space-y-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          We use cookies to maintain your login status, customize dashboard themes, and track page loading times. Check out our definitions below to adjust your preferences.
        </p>

        {/* Toggles */}
        <div className="space-y-4 pt-4 border-t border-border/60">
          {cookieTypes.map((cookie) => (
            <div key={cookie.id} className="rounded-xl border border-border bg-background/50 p-4 flex items-start justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{cookie.title}</span>
                  {cookie.required && (
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary">Required</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">{cookie.desc}</p>
              </div>

              <div className="pt-1">
                {cookie.required ? (
                  <Switch checked={true} disabled className="data-[state=checked]:bg-primary" />
                ) : (
                  <Switch
                    checked={cookie.state}
                    onCheckedChange={(checked) => cookie.setState(checked)}
                    className="data-[state=checked]:bg-primary"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-border/60 flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 px-6 h-10"
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
