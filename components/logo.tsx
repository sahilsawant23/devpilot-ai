import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      {showText && (
        <span className="text-lg font-semibold tracking-tight">
          DevPilot<span className="text-primary"> AI</span>
        </span>
      )}
    </div>
  );
}
