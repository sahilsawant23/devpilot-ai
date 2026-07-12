'use client';

import Link from 'next/link';
import { Star, GitBranch, MoreHorizontal, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type Repo = {
  name: string;
  description: string;
  language: string;
  languageColor: string;
  size: string;
  stars: number;
  lastUpdated: string;
  status: string;
  health: number;
};

const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Analyzed: 'default',
  'Needs Review': 'destructive',
  Pending: 'secondary',
};

export function RepositoryCard({ repo }: { repo: Repo }) {
  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card/50 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-indigo-900/10">
      <Link href="/dashboard/repositories/analysis" className="block p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 to-purple-500/15 text-primary">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold leading-tight">{repo.name}</h3>
              <p className="text-xs text-muted-foreground">{repo.size}</p>
            </div>
          </div>
          <Badge variant={statusVariant[repo.status] ?? 'secondary'}>{repo.status}</Badge>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{repo.description}</p>

        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: repo.languageColor }}
            />
            {repo.language}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" />
            {repo.stars}
          </span>
          <span>{repo.lastUpdated}</span>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Health score</span>
            <span className="font-medium">{repo.health}/100</span>
          </div>
          <Progress
            value={repo.health}
            className={cn(
              'h-1.5',
              repo.health >= 85 ? '[&>*]:bg-emerald-500' : repo.health >= 70 ? '[&>*]:bg-amber-500' : '[&>*]:bg-red-500'
            )}
          />
        </div>
      </Link>
    </Card>
  );
}
