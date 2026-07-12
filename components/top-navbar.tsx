'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Menu, Search, Bell, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { navItems } from '@/lib/nav';
import { repositories } from '@/lib/data';
import { toast } from 'sonner';

export function TopNavbar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);
  const [mobileSearch, setMobileSearch] = React.useState(false);
  const [readNotifications, setReadNotifications] = React.useState<Set<number>>(new Set());

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return repositories
      .filter((r) => r.name.toLowerCase().includes(q) || r.language.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query]);

  const notifications = [
    { id: 1, title: 'Repository analysis complete', time: '2m', unread: true },
    { id: 2, title: '3 new bugs detected in billing-api', time: '18m', unread: true },
    { id: 3, title: 'Documentation generated', time: '1h', unread: false },
  ];

  const unreadCount = notifications.filter((n) => !readNotifications.has(n.id) && n.unread).length;

  const current =
    [...navItems]
      .sort((a, b) => b.href.length - a.href.length)
      .find((n) => pathname === n.href || pathname.startsWith(n.href))?.title ??
    'Dashboard';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent lg:hidden"
        aria-label="Open menu"
        onClick={onMenu}
      >
        <Menu className="h-5 w-5" />
      </button>

      <h1 className="hidden text-base font-semibold sm:block">{current}</h1>

      <div className="relative ml-auto hidden max-w-xs flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search repositories, chats..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSearch(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              setShowSearch(true);
            }
            if (e.key === 'Escape') {
              setShowSearch(false);
              setQuery('');
            }
          }}
          onFocus={() => query && setShowSearch(true)}
          className="h-9 bg-card pl-9"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setShowSearch(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {showSearch && results.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-xl">
            <p className="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Repositories
            </p>
            {results.map((r) => (
              <button
                key={r.name}
                onClick={() => {
                  router.push('/dashboard/repositories/analysis');
                  setShowSearch(false);
                  setQuery('');
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-accent"
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.languageColor }} />
                <span className="text-sm font-medium">{r.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{r.language}</span>
              </button>
            ))}
          </div>
        )}
        {showSearch && results.length === 0 && query.trim() && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-border bg-popover p-4 text-center text-sm text-muted-foreground shadow-xl">
            No results for &ldquo;{query}&rdquo;
          </div>
        )}
      </div>

      <div className="ml-auto flex items-center gap-1 md:ml-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 md:hidden"
          aria-label="Search"
          onClick={() => setMobileSearch((s) => !s)}
        >
          <Search className="h-4 w-4" />
        </Button>

        {mobileSearch && (
          <div className="fixed inset-x-0 top-16 z-40 border-b border-border bg-background p-3 md:hidden">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search repositories..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowSearch(true); }}
                className="h-9 bg-card pl-9"
              />
            </div>
            {results.length > 0 && (
              <div className="mt-2 space-y-1">
                {results.map((r) => (
                  <button
                    key={r.name}
                    onClick={() => {
                      router.push('/dashboard/repositories/analysis');
                      setMobileSearch(false);
                      setQuery('');
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-accent"
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.languageColor }} />
                    <span className="text-sm font-medium">{r.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => setReadNotifications(new Set(notifications.map((n) => n.id)))}
                  className="text-xs font-normal text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => {
              const isUnread = !readNotifications.has(n.id) && n.unread;
              return (
                <DropdownMenuItem
                  key={n.id}
                  className="flex items-start justify-between gap-2 py-2"
                  onClick={() => setReadNotifications((prev) => new Set(prev).add(n.id))}
                >
                  <div>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.time} ago</p>
                  </div>
                  {isUnread && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-accent">
              <Avatar className="h-7 w-7">
                <AvatarImage src="https://i.pravatar.cc/100?img=8" alt="Alex Morgan" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">Alex Morgan</span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:inline" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <div>
                <p className="text-sm font-medium">Alex Morgan</p>
                <p className="text-xs font-normal text-muted-foreground">
                  alex@devpilot.ai
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/login')}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
