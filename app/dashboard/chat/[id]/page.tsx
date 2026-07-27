'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MessageSquare,
  Send,
  User,
  Bot,
  ArrowLeft,
  Sparkles,
  Copy,
  Check,
  Code2,
} from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function ChatSessionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = (params?.id as string) || 'session_1';

  const [inputMsg, setInputMsg] = React.useState('');
  const [messages, setMessages] = React.useState<Array<{ role: 'user' | 'assistant'; content: string; time: string }>>([
    {
      role: 'user',
      content: 'How do I optimize our database query latency in billing-api?',
      time: '10:14 AM',
    },
    {
      role: 'assistant',
      content: 'I analyzed `billing-api/src/db/queries.go`. The bottleneck is caused by un-indexed `user_id` joins on the `transactions` table. Adding a composite index `(user_id, created_at DESC)` reduces query time from 420ms to 4ms.',
      time: '10:15 AM',
    },
  ]);

  const handleSend = () => {
    if (!inputMsg.trim()) return;
    const userMessage = { role: 'user' as const, content: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages((prev) => [...prev, userMessage]);
    setInputMsg('');

    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant' as const,
        content: `I recommend wrapping that operation in an asynchronous worker thread using Redis queue. Let me know if you want me to generate the PR.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  return (
    <AppShell>
      <PageHeader
        title={`Chat Session #${sessionId}`}
        description="Persistent AI repository chat history and code assistant transcript."
        actions={
          <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/chat')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> All Conversations
          </Button>
        }
      />

      <Card className="border-border/60 bg-card/50 flex flex-col h-[70vh]">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'border border-border/80 bg-background/90 text-foreground'
                }`}
              >
                <p>{m.content}</p>
                <span className="mt-1 block text-[10px] opacity-70 text-right">{m.time}</span>
              </div>
              {m.role === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-foreground">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
        </CardContent>

        <div className="border-t border-border/60 p-3 bg-background/50">
          <div className="flex gap-2">
            <Input
              placeholder="Ask DevPilot AI about this codebase..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="bg-card"
            />
            <Button onClick={handleSend} className="bg-primary text-primary-foreground">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </AppShell>
  );
}
