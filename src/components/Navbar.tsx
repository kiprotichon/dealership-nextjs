'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-accent/20 bg-primary text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image src="/logo-white.png" alt="Daily Bazaar" width={160} height={60} className="h-11 w-auto object-contain" priority />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-gray-200 hover:text-accent">{l.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <a href="tel:+254715455098" className="flex items-center gap-2 text-sm text-gray-200 hover:text-accent">
            <Phone className="h-4 w-4" /> +254 715 455 098
          </a>
          <a href="https://wa.me/254715455098" target="_blank" rel="noreferrer" className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-primary hover:brightness-95">
            WhatsApp us
          </a>
        </div>
        <button className="rounded-lg p-2 hover:bg-white/10 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-accent/20 px-4 py-3 md:hidden">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-accent">{l.label}</Link>
          ))}
          <a href="tel:+254715455098" className="mt-2 rounded-lg bg-accent px-3 py-2 text-sm font-bold text-primary">Call +254 715 455 098</a>
        </nav>
      )}
    </header>
  );
}
