'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Search,
  Send,
  Copy,
  RefreshCw,
  Check,
  Sparkles,
  Bug,
  FileText,
  TestTube,
  BookOpen,
  Zap,
  Trash2,
  MessagesSquare,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { formatDistanceToNow } from 'date-fns';

type Role = 'user' | 'assistant';
type Message = {
  id: string;
  role: Role;
  content: string;
  isCode?: boolean;
  pending?: boolean;
};

type Conversation = {
  id: string;
  title: string;
  preview: string;
  time: string;
};

const suggestedPrompts = [
  { icon: Sparkles, label: 'Explain this repository' },
  { icon: Bug, label: 'Find bugs' },
  { icon: Zap, label: 'Improve performance' },
  { icon: TestTube, label: 'Generate tests' },
  { icon: BookOpen, label: 'Create README' },
  { icon: FileText, label: 'Explain authentication flow' },
];

const sampleAssistantResponse = `Here's an overview of the authentication flow in **web-platform**:

The codebase uses a JWT-based auth strategy with three main layers:

1. **Token issuance** — \`authService.login()\` validates credentials and signs a JWT with a 15-minute expiry.
2. **Token refresh** — a refresh token (7-day expiry) is stored in an httpOnly cookie.
3. **Middleware verification** — \`withAuth()\` validates the JWT on protected routes.

\`\`\`typescript
// src/middleware/withAuth.ts
export async function withAuth(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return unauthorized();
  const payload = await verifyJwt(token);
  return payload ? next(req, payload) : unauthorized();
}
\`\`\`

A potential improvement: rotate the refresh token on each use to prevent replay attacks.`;

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-muted-foreground"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="my-3 overflow-hidden rounded-lg border border-border bg-[hsl(230_25%_5%)]">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="text-xs text-muted-foreground">typescript</span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-foreground/90 scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(```[\s\S]*?```)/g);
  return (
    <div className="text-sm leading-relaxed">
      {parts.map((part, i) => {
        if (part.startsWith('```')) {
          const code = part.replace(/^```\w*\n?/, '').replace(/```$/, '');
          return <CodeBlock key={i} code={code} />;
        }
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: part
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/`([^`]+)`/g, '<code class="rounded bg-muted px-1.5 py-0.5 text-xs">$1</code>')
                .replace(/^(\d+)\.\s/gm, '<br/>$1. ')
                .replace(/^-\s/gm, '<br/>• '),
            }}
          />
        );
      })}
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'm1',
      role: 'assistant',
      content: 'Hi there! I have indexed **web-platform**. Ask me anything about the codebase, or pick a suggested prompt below to get started.',
    },
  ]);
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const [activeConv, setActiveConv] = React.useState('');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Dynamic chat list states
  const [conversationsList, setConversationsList] = React.useState<Conversation[]>([]);

  async function fetchConversations() {
    try {
      const res = await fetch('/api/chat');
      if (res.ok) {
        const data = await res.json();
        const mapped = (data.chats ?? []).map((c: any) => ({
          id: c.id,
          title: c.title,
          preview: 'Click to resume conversation...',
          time: formatDistanceToNow(new Date(c.updatedAt), { addSuffix: true }),
        }));
        setConversationsList(mapped);
        
        // Auto select the first conversation if activeConv is empty
        if (mapped.length > 0 && !activeConv) {
          setActiveConv(mapped[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch chat sessions:', err);
    }
  }

  React.useEffect(() => {
    fetchConversations();
  }, []);

  const filteredConversations = React.useMemo(() => {
    if (!searchQuery.trim()) return conversationsList;
    const q = searchQuery.toLowerCase();
    return conversationsList.filter(
      (c) => c.title.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q)
    );
  }, [searchQuery, conversationsList]);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  async function newConversation() {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success('New conversation started');
        fetchConversations();
        if (data.chat) {
          setActiveConv(data.chat.id);
          setMessages([
            {
              id: `m-${Date.now()}`,
              role: 'assistant',
              content: 'New conversation started. Ask me anything about your codebase!',
            },
          ]);
        }
      }
    } catch (err) {
      toast.error('Failed to start new conversation');
    }
  }

  function clearChat() {
    setMessages([
      {
        id: `m-${Date.now()}`,
        role: 'assistant',
        content: 'Chat cleared. What would you like to explore?',
      },
    ]);
    toast.success('Chat cleared');
  }

  function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || typing) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      const assistantMsg: Message = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: sampleAssistantResponse,
      };
      setMessages((m) => [...m, assistantMsg]);
    }, 1600);
  }

  function regenerate() {
    const last = messages[messages.length - 1];
    if (!last || last.role !== 'assistant') return;
    setMessages((m) => m.slice(0, -1));
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: `a-${Date.now()}`, role: 'assistant', content: sampleAssistantResponse },
      ]);
    }, 1400);
  }

  function copyMessage(id: string, content: string) {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <AppShell>
      <div className="grid h-[calc(100vh-7rem)] grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        {/* Conversation history */}
        <aside className="hidden flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/50 lg:flex">
          <div className="border-b border-border p-3">
            <Button onClick={newConversation} className="w-full justify-start bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              New conversation
            </Button>
          </div>
          <div className="p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 bg-background pl-9"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-thin">
            {filteredConversations.length === 0 && (
              <p className="px-3 py-4 text-center text-xs text-muted-foreground">
                No conversations found
              </p>
            )}
            {filteredConversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveConv(c.id)}
                className={cn(
                  'mb-1 w-full rounded-lg p-3 text-left transition-colors',
                  activeConv === c.id ? 'bg-primary/10' : 'hover:bg-accent/50'
                )}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className={cn('h-4 w-4 shrink-0', activeConv === c.id ? 'text-primary' : 'text-muted-foreground')} />
                  <p className={cn('truncate text-sm font-medium', activeConv === c.id && 'text-primary')}>
                    {c.title}
                  </p>
                </div>
                <p className="mt-1 truncate pl-6 text-xs text-muted-foreground">{c.preview}</p>
                <p className="mt-1 pl-6 text-xs text-muted-foreground/70">{c.time}</p>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat window */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/50">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                <MessagesSquare className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold">Explain authentication flow</p>
                <p className="text-xs text-muted-foreground">web-platform · 12 files in context</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Clear chat" onClick={clearChat}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-3', m.role === 'user' && 'flex-row-reverse')}
                >
                  <div
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium',
                      m.role === 'user'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-gradient-to-br from-blue-500 to-purple-500 text-white'
                    )}
                  >
                    {m.role === 'user' ? 'AM' : <Sparkles className="h-4 w-4" />}
                  </div>
                  <div
                    className={cn(
                      'group max-w-[80%] rounded-2xl px-4 py-3',
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border bg-background/60'
                    )}
                  >
                    <MessageContent content={m.content} />
                    {m.role === 'assistant' && (
                      <div className="mt-3 flex items-center gap-2 border-t border-border/60 pt-3 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => copyMessage(m.id, m.content)}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          {copiedId === m.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          Copy
                        </button>
                        <button
                          onClick={regenerate}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Regenerate
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl border border-border bg-background/60 px-4 py-3">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Suggested prompts */}
          {messages.length <= 1 && (
            <div className="border-t border-border px-4 py-3">
              <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
                {suggestedPrompts.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => send(p.label)}
                    className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <p.icon className="h-3.5 w-3.5" />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="mx-auto flex max-w-3xl items-end gap-2">
              <div className="relative flex-1">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Ask anything about your codebase..."
                  className="h-12 resize-none pr-12"
                />
              </div>
              <Button
                onClick={() => send()}
                disabled={!input.trim() || typing}
                size="icon"
                className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted-foreground">
              DevPilot can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
