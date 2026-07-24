'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FormField } from '@/components/password-input';
import { Briefcase, MapPin, Clock, DollarSign, Gift, Star, Award, Heart, Check } from 'lucide-react';
import { toast } from 'sonner';

const positions = [
  {
    id: 'ai-scientist',
    title: 'Lead AI Scientist (NLP/Code)',
    team: 'AI Research',
    location: 'Remote (US / Europe)',
    type: 'Full-time',
    salary: '$180k - $240k + Equity',
    description: 'We are seeking an experienced ML researcher to lead the development of our code indexing models, contextual code generation solvers, and compiler-integrated feedback loops.',
  },
  {
    id: 'full-stack-engineer',
    title: 'Senior Full Stack Engineer (React/Go)',
    team: 'Product Engineering',
    location: 'Remote (Global)',
    type: 'Full-time',
    salary: '$140k - $190k + Equity',
    description: 'Help us design and scale our responsive Next.js frontend interfaces and our high-throughput Golang indexing pipeline. Focus on rich animations, sub-100ms API responses, and clean codebases.',
  },
  {
    id: 'devrel',
    title: 'Developer Relations Engineer',
    team: 'Growth & Community',
    location: 'Remote / Hybrid (SF or London)',
    type: 'Full-time',
    salary: '$110k - $150k + Equity',
    description: 'Build open-source demos, write technical content, speak at developer conferences, and run our community Discord server. You will be the bridge between our customers and product engineering team.',
  },
  {
    id: 'security-engineer',
    title: 'Senior Security Engineer',
    team: 'Security & Infrastructure',
    location: 'Remote (Global)',
    type: 'Full-time',
    salary: '$150k - $200k + Equity',
    description: 'Lead efforts on container isolation, zero-retention runtime architectures, vulnerability scanning integrations, and SOC2 compliance monitoring across our Kubernetes infrastructure.',
  },
];

const perks = [
  { icon: Heart, title: 'Health & Wellness', desc: 'Comprehensive medical, dental, and vision packages for you and your family.' },
  { icon: Gift, title: 'Stipends & Setup', desc: '$3,000 workspace budget for a state-of-the-art laptop, desk, chair, and accessories.' },
  { icon: Star, title: 'Flexible PTO', desc: 'Unlimited paid time off with a mandatory 3 weeks minimum to prevent developer burnout.' },
  { icon: Award, title: 'Learning Stipend', desc: '$2,000 annually for books, courses, conference tickets, and training programs.' },
];

export function CareersClient() {
  const [selectedJob, setSelectedJob] = React.useState<typeof positions[0] | null>(null);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [resume, setResume] = React.useState('');
  const [cover, setCover] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !resume) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success(`Application for ${selectedJob?.title} submitted successfully!`);
      setSelectedJob(null);
      setName('');
      setEmail('');
      setResume('');
      setCover('');
    }, 1200);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="py-12 md:py-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur mb-6">
          <Briefcase className="h-3 w-3 text-primary" />
          Careers at DevPilot
        </div>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl max-w-3xl mx-auto">
          Help us build the next generation of <span className="gradient-text">developer tooling</span>
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          We are a remote-first, developer-focused team building AI assistants that understand codebases deeply. Join us in making software engineering faster and more creative.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="py-12 border-t border-border/40">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold">Why Join DevPilot?</h2>
          <p className="mt-2 text-sm text-muted-foreground">We take care of our team so they can build exceptional tools for developers.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((p) => (
            <div key={p.title} className="rounded-xl border border-border/60 bg-card/30 p-6 text-center transition-all hover:bg-card/50">
              <div className="mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Positions Board */}
      <div className="py-12 border-t border-border/40">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold">Open Roles</h2>
          <p className="mt-2 text-sm text-muted-foreground">Select a role to view the description and apply.</p>
        </div>
        <div className="space-y-4 max-w-4xl mx-auto">
          {positions.map((pos) => (
            <Card
              key={pos.id}
              className="border-border/60 bg-card/25 hover:bg-card/45 hover:border-primary/40 transition-all duration-300"
            >
              <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="rounded bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">{pos.team}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {pos.location}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {pos.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{pos.title}</h3>
                  <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">{pos.description}</p>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between shrink-0 gap-4">
                  <span className="flex items-center text-xs font-semibold text-primary">
                    <DollarSign className="h-3.5 w-3.5" />
                    {pos.salary}
                  </span>
                  <Button
                    onClick={() => setSelectedJob(pos)}
                    size="sm"
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    Apply Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Application Dialog */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-xl border-border bg-card p-6 md:p-8 scrollbar-thin">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Apply for Open Position</DialogTitle>
            <DialogDescription className="text-xs text-primary font-semibold mt-1">
              {selectedJob?.title} &middot; {selectedJob?.location}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApply} className="space-y-4 mt-4">
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
                placeholder="alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormField>

            <FormField id="resume" label="Link to Resume / LinkedIn Profile *">
              <Input
                id="resume"
                placeholder="https://linkedin.com/in/alexmorgan"
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                required
              />
            </FormField>

            <FormField id="cover" label="Tell us why you are a great fit (Optional)">
              <Textarea
                id="cover"
                placeholder="Tell us about a project you shipped recently..."
                rows={4}
                value={cover}
                onChange={(e) => setCover(e.target.value)}
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setSelectedJob(null)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
