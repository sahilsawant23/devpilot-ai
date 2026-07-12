'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Stat } from '@/lib/data';

export function StatCard({ stat, index = 0 }: { stat: Stat; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Card className="group relative overflow-hidden border-border/60 bg-card/50 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-indigo-900/10">
        <div
          className={cn(
            'absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-opacity group-hover:opacity-40',
            stat.accent
          )}
          aria-hidden
        />
        <div className="relative p-5">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg',
                stat.accent
              )}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <span
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                stat.trend === 'up'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-red-500/10 text-red-500'
              )}
            >
              {stat.trend === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {stat.delta}
            </span>
          </div>
          <p className="mt-4 text-2xl font-semibold tracking-tight">{stat.value}</p>
          <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
        </div>
      </Card>
    </motion.div>
  );
}
