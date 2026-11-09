'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ChevronRight, ArrowRight } from 'lucide-react';

const links = [
  { href: '/', label: 'Home' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-accent/20 bg-primary text-white">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setOpen(false)}
          aria-label="Daily Bazaar home"
        >
          <Image
            src="/logo_transparent_yellow.png"
            alt="Daily Bazaar"
            width={160}
            height={60}
            className="h-11 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'text-accent'
                    : 'text-gray-200 hover:text-accent'
                }`}
              >
                {link.label}

                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-accent" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">

          {/* Browse Inventory */}
          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-primary transition-all hover:brightness-95"
          >
            Browse Inventory
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Contact Us */}
          <Link
            href="/contact"
            className={`rounded-lg border px-4 py-2.5 text-sm font-bold transition-colors ${
              isActive('/contact')
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-white/20 text-white hover:border-accent hover:text-accent'
            }`}
          >
            Contact Us
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="rounded-lg p-2 transition-colors hover:bg-white/10 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-accent/20 bg-primary md:hidden">

          <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

            {/* Navigation Links */}
            <div className="space-y-1">
              {links.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                      active
                        ? 'bg-accent/10 text-accent'
                        : 'text-gray-200 hover:bg-white/10 hover:text-accent'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4 opacity-60" />
                  </Link>
                );
              })}
            </div>

            {/* Mobile Actions */}
            <div className="mt-4 space-y-3 border-t border-white/10 pt-4">

              {/* Browse Inventory */}
              <Link
                href="/inventory"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-bold text-primary transition-all hover:brightness-95"
              >
                Browse Inventory
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Contact Us */}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-lg border border-white/20 px-4 py-3 text-sm font-bold text-white transition-colors hover:border-accent hover:text-accent"
              >
                Contact Us
              </Link>

            </div>

          </nav>
        </div>
      )}

    </header>
  );
}