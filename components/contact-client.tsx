'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/password-input';
import { Mail, Phone, MapPin, MessageSquare, Send, Globe, LifeBuoy, Building2 } from 'lucide-react';
import { toast } from 'sonner';

export function ContactClient() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success('Your message has been sent! We will get back to you shortly.');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1000);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="py-12 md:py-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur mb-6">
          <MessageSquare className="h-3 w-3 text-primary" />
          Contact DevPilot
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl max-w-3xl mx-auto">
          We would love to hear from <span className="gradient-text">you</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions about pricing, integrations, features, or custom enterprise terms? Get in touch with our team.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 max-w-6xl mx-auto mt-8">
        {/* Contact Info and Cards (Left Column) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/30 p-6 space-y-6">
            <h2 className="text-xl font-bold">Contact Support</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              If you have technical support questions, checkout our documentation or submit a ticket to our engineering desk directly.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Email Sales</div>
                  <a href="mailto:sales@devpilot.ai" className="text-xs text-muted-foreground hover:text-foreground">sales@devpilot.ai</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <LifeBuoy className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Technical Support</div>
                  <a href="mailto:support@devpilot.ai" className="text-xs text-muted-foreground hover:text-foreground">support@devpilot.ai</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Phone Support</div>
                  <span className="text-xs text-muted-foreground">+1 (800) 555-0199</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/30 p-6 space-y-6">
            <h2 className="text-xl font-bold">Our Offices</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold">San Francisco Headquarters</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    100 Pine Street, Floor 12<br />San Francisco, CA 94111
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold">London Design Studio</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    24 Great Eastern Street<br />London, EC2A 3EH, United Kingdom
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (Right Column) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-border bg-card/45 p-6 md:p-8">
            <h2 className="text-xl font-bold mb-6">Send us a message</h2>
            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField id="name" label="Full Name *">
                  <Input
                    id="name"
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </FormField>

                <FormField id="email" label="Email Address *">
                  <Input
                    id="email"
                    type="email"
                    placeholder="alex@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormField>
              </div>

              <FormField id="subject" label="Subject *">
                <Input
                  id="subject"
                  placeholder="Sales Inquiry / Partnership"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </FormField>

              <FormField id="message" label="Your Message *">
                <Textarea
                  id="message"
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </FormField>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 h-11"
              >
                {submitting ? 'Sending Message...' : (
                  <>
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
