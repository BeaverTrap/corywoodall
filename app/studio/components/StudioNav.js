'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/studio', label: 'Dashboard' },
  { href: '/studio/site', label: 'Site content' },
  { href: '/studio/galleries', label: 'Galleries' },
  { href: '/studio/articles', label: 'Articles' },
  { href: '/', label: 'View site', muted: true },
];

export default function StudioNav({ email }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative border-b border-black/10 bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Private</p>
            <h1 className="text-lg sm:text-xl font-bold tracking-wide truncate">Cory Woodall Studio</h1>
          </div>

          <nav className="hidden md:flex flex-wrap items-center justify-end gap-4 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={link.muted ? 'text-black/60 hover:underline' : 'hover:underline'}
              >
                {link.label}
              </Link>
            ))}
            {email ? <span className="text-black/50 truncate max-w-[180px]">{email}</span> : null}
            <form action="/auth/signout" method="post">
              <button type="submit" className="px-3 py-1.5 rounded bg-black text-white text-sm">
                Sign out
              </button>
            </form>
          </nav>

          <button
            type="button"
            className="md:hidden p-2 rounded-md text-black hover:bg-black/10 transition-colors shrink-0"
            aria-label={menuOpen ? 'Close studio menu' : 'Open studio menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen ? (
          <nav className="md:hidden mt-4 pt-4 border-t border-black/10 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2.5 px-2 rounded hover:bg-black/5 ${
                  link.muted ? 'text-black/60' : 'text-black'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {email ? <p className="px-2 py-2 text-sm text-black/50 break-all">{email}</p> : null}
            <form action="/auth/signout" method="post" className="px-2 pt-2">
              <button
                type="submit"
                className="w-full px-3 py-2.5 rounded bg-black text-white text-sm"
              >
                Sign out
              </button>
            </form>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
