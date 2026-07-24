import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing-navbar';
import { Footer } from '@/components/footer';
import { Activity, ShieldCheck, Server, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'System Status — DevPilot AI',
  description: 'Real-time operational status, uptime logs, and incident history of DevPilot AI core services, API, and dashboard.',
};

const services = [
  { name: 'Core API Gateway', status: 'Operational', uptime: '99.98%' },
  { name: 'AI Code Indexers', status: 'Operational', uptime: '99.95%' },
  { name: 'Dashboard Web App', status: 'Operational', uptime: '100%' },
  { name: 'Database & Vectors', status: 'Operational', uptime: '99.99%' },
  { name: 'VS Code Extension Sync', status: 'Operational', uptime: '99.91%' },
];

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />

      <main className="relative overflow-hidden pt-24 pb-16">
        {/* Background Grid */}
        <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
        <div
          className="absolute left-1/4 top-10 -z-10 h-[380px] w-[500px] rounded-full bg-gradient-to-br from-emerald-600/10 to-indigo-600/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Status Hero */}
          <div className="py-12 text-center">
            <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500 animate-pulse">
              <CheckCircle className="h-9 w-9" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              All Systems Operational
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Last updated: July 24, 2026, 10:11 PM UTC &middot; 100% uptime past 90 days.
            </p>
          </div>

          {/* Services List */}
          <div className="rounded-2xl border border-border bg-card/30 backdrop-blur p-6 space-y-4">
            <h2 className="text-lg font-bold border-b border-border pb-3 flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              Service Status
            </h2>

            <div className="divide-y divide-border/60">
              {services.map((srv) => (
                <div key={srv.name} className="py-3.5 flex items-center justify-between gap-4 text-sm">
                  <div className="space-y-0.5">
                    <span className="font-semibold">{srv.name}</span>
                    <p className="text-[10px] text-muted-foreground">Uptime: {srv.uptime}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-400">{srv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Uptime Graph (Visual Simulation) */}
          <div className="mt-8 rounded-2xl border border-border bg-card/30 backdrop-blur p-6">
            <h2 className="text-lg font-bold border-b border-border pb-3 mb-6 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Response Metrics (Last 90 Days)
            </h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>API gateway response latency</span>
                  <span className="font-semibold text-foreground">182ms avg</span>
                </div>
                {/* Simulated Green bars */}
                <div className="flex gap-[2px] h-8 items-end">
                  {Array.from({ length: 45 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex-1 rounded-sm bg-emerald-500/80 hover:bg-emerald-400 transition-colors"
                      style={{ height: `${80 + Math.random() * 20}%` }}
                      title="Uptime: 100% | Latency: 182ms"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Historical Incidents */}
          <div className="mt-8 rounded-2xl border border-border bg-card/30 backdrop-blur p-6">
            <h2 className="text-lg font-bold border-b border-border pb-3 mb-6 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Recent Incidents
            </h2>

            <div className="space-y-6">
              <div>
                <div className="text-xs text-muted-foreground font-semibold">July 18, 2026</div>
                <h3 className="text-sm font-semibold mt-1">Minor CLI Indexing Delays</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  We experienced a brief degradation in AI indexing queues due to high usage of large monorepos. The team increased parallel server counts and resolved the queue backlog within 24 minutes.
                </p>
                <div className="mt-2 text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                  <CheckCircle className="h-3 w-3" /> Resolved (Duration: 24 mins)
                </div>
              </div>

              <div className="border-t border-border/40 pt-4">
                <div className="text-xs text-muted-foreground font-semibold">June 24, 2026</div>
                <h3 className="text-sm font-semibold mt-1">Scheduled Database Maintenance</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Our databases were upgraded to enable recursive AST path search caches. The upgrade was completed during our low-traffic window with zero impact to active API queries.
                </p>
                <div className="mt-2 text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                  <CheckCircle className="h-3 w-3" /> Completed
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
