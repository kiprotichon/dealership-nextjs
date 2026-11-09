import Link from 'next/link';
import Image from 'next/image';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ArrowRight,
  Facebook,
  Instagram,
} from 'lucide-react';

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/inventory', label: 'Browse Inventory' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact Us' },
];

const socialLinks = [
  {
    name: 'Facebook',
    href: '', // Add Facebook URL
    icon: Facebook,
  },
  {
    name: 'Instagram',
    href: '', // Add Instagram URL
    icon: Instagram,
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@dailybazaar.ke',
    icon: null,
  },
].filter((social) => social.href);

export default function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-accent bg-primary text-gray-300">

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">

        {/* Brand */}
        <div>
          <Link href="/" className="inline-block">
            <Image
              src="/logo_transparent_yellow.png"
              alt="Daily Bazaar"
              width={160}
              height={60}
              className="mb-5 h-12 w-auto object-contain"
            />
          </Link>

          <p className="max-w-xs text-sm leading-7 text-gray-400">
            Quality vehicles, transparent pricing and honest service in
            Nairobi. Smart deals every day.
          </p>

          <p className="mt-5 text-sm font-semibold text-accent">
            Driven by Trust. Defined by Quality.
          </p>

  {/* Social Media */}
<div className="mt-6">
  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
    Follow Us
  </h4>

  <div className="flex items-center gap-3">
    {socialLinks.map((social) => {
      const Icon = social.icon;

      return (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.name}
          title={social.name}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-all hover:border-accent hover:bg-accent hover:text-primary"
        >
          {Icon ? (
            <Icon className="h-5 w-5" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.55v13.67a2.9 2.9 0 0 1-2.9 2.9 2.9 2.9 0 0 1-2.9-2.9 2.9 2.9 0 0 1 2.9-2.9c.3 0 .6.05.88.14V9.28a6.48 6.48 0 0 0-.88-.06 6.46 6.46 0 1 0 6.46 6.46V8.72a8.34 8.34 0 0 0 4.88 1.57V6.74a4.85 4.85 0 0 1-1.12-.05z" />
            </svg>
          )}
        </a>
      );
    })}
  </div>
</div>

  </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-accent">
            Explore
          </h3>

          <ul className="space-y-3 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-accent">
            Get in Touch
          </h3>

          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a
                href="tel:+254715455098"
                className="transition-colors hover:text-accent"
              >
                +254 715 455 098
              </a>
            </li>

            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a
                href="mailto:dailybazaarltd@gmail.com"
                className="break-all transition-colors hover:text-accent"
              >
                dailybazaarltd@gmail.com
              </a>
            </li>

            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>Ngong Road, Nairobi, Kenya</span>
            </li>
          </ul>

          <a
            href="https://maps.app.goo.gl/CowR3S71fgrVZDjd8"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-white"
          >
            Get Directions
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Opening Hours */}
        <div>
          <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-accent">
            Visit Our Showroom
          </h3>

          <div className="flex items-start gap-3 text-sm">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />

            <div>
              <p className="font-semibold text-white">
                Monday – Saturday
              </p>
              <p className="mt-1 text-gray-400">
                6:00 AM – 6:00 PM
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Sunday: Hours not specified
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:px-6 md:flex-row lg:px-8">

          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Daily Bazaar Ltd. All rights reserved.
          </p>

          <p className="text-xs text-gray-500">
            Quality vehicles. Honest service. Better driving.
          </p>

        </div>
      </div>

    </footer>
  );
} 

