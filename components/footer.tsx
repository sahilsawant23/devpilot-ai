import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { Logo } from '@/components/logo';

const groups = [
  {
    title: 'Product',
    links: [
      { title: 'Features', href: '/#features' },
      { title: 'How it Works', href: '/#how-it-works' },
      { title: 'Pricing', href: '/#pricing' },
      { title: 'FAQ', href: '/#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { title: 'About', href: '#' },
      { title: 'Blog', href: '#' },
      { title: 'Careers', href: '#' },
      { title: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'Documentation', href: '#' },
      { title: 'API Reference', href: '#' },
      { title: 'Community', href: '#' },
      { title: 'Status', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { title: 'Privacy', href: '#' },
      { title: 'Terms', href: '#' },
      { title: 'Security', href: '#' },
      { title: 'Cookies', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Your AI Software Engineering Assistant. Analyze repositories,
              explain code, and build software faster.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="#"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h4 className="text-sm font-semibold">{g.title}</h4>
              <ul className="mt-4 space-y-3">
                {g.links.map((l) => (
                  <li key={l.title}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DevPilot AI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built for developers, by developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
