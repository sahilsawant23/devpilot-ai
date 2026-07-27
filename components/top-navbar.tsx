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
import { formatDistanceToNow } from 'date-fns';

export function TopNavbar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = React.useState<{ name: string; email: string; role?: string } | null>(null);
  const [notificationsList, setNotificationsList] = React.useState<any[]>([]);

  async function fetchNotifications() {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotificationsList(data.notifications ?? []);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }

  React.useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user in navbar:', err);
      }
    }
    fetchMe();
    fetchNotifications();
  }, []);

  const name = user?.name ?? 'Sahil Sawant';
  const email = user?.email ?? 'sahil@devpilot.ai';
  const role = user?.role ?? 'ADMIN';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const [query, setQuery] = React.useState('');
  const [showSearch, setShowSearch] = React.useState(false);
  const [mobileSearch, setMobileSearch] = React.useState(false);

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return repositories
      .filter((r) => r.name.toLowerCase().includes(q) || r.language.toLowerCase().includes(q))
      .slice(0, 5);
  }, [query]);

  const unreadCount = notificationsList.filter((n) => !n.read).length;

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
                <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 sm:w-96">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs">
                {unreadCount > 0 && (
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/notifications', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ all: true })
                        });
                        if (res.ok) {
                          toast.success('Marked all as read');
                          fetchNotifications();
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
                {notificationsList.length > 0 && (
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/notifications?all=true', {
                          method: 'DELETE'
                        });
                        if (res.ok) {
                          toast.info('Notifications cleared');
                          fetchNotifications();
                        }
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
            <DropdownMenuSeparator className="m-0" />
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {notificationsList.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">No pending notifications at this moment.</p>
                </div>
              ) : (
                notificationsList.map((n) => {
                  const isUnread = !n.read;
                  return (
                    <div
                      key={n.id}
                      className={`group relative flex items-start gap-3 p-3 text-left transition-colors hover:bg-accent/50 ${
                        isUnread ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="mt-1 flex h-2 w-2 shrink-0 rounded-full">
                        {isUnread ? (
                          <span className="h-2 w-2 rounded-full bg-primary" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                        )}
                      </div>
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={async () => {
                          if (!n.read) {
                            try {
                              const res = await fetch('/api/notifications', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ id: n.id })
                              });
                              if (res.ok) fetchNotifications();
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                      >
                        <p className={`text-xs sm:text-sm ${isUnread ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                          {n.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            const res = await fetch(`/api/notifications?id=${n.id}`, {
                              method: 'DELETE'
                            });
                            if (res.ok) fetchNotifications();
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-foreground transition-opacity"
                        title="Delete notification"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-accent">
              <Avatar className="h-7 w-7">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`} alt={name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{name}</span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:inline" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{name}</p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary border border-primary/20">
                    {role}
                  </span>
                </div>
                <p className="text-xs font-normal text-muted-foreground">
                  {email}
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
            <DropdownMenuItem onClick={async () => {
              await fetch('/api/auth/me', { method: 'DELETE' });
              router.push('/login');
            }}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
