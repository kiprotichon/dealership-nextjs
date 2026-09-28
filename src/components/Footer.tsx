import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t-4 border-accent bg-primary text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Image src="/logo-white.png" alt="Daily Bazaar" width={160} height={60} className="mb-4 h-12 w-auto object-contain" />
          <p className="max-w-xs text-sm leading-relaxed text-gray-400">
            Quality vehicles, transparent pricing and honest service in Nairobi. Smart deals everyday.
          </p>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-accent">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/inventory" className="hover:text-accent">Inventory</Link></li>
            <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 font-semibold text-accent">Visit or call</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><a href="tel:+254715455098" className="hover:text-accent">+254 715 455 098</a></li>
            <li className="flex gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><a href="mailto:dailybazaarltd@gmail.com" className="hover:text-accent">dailybazaarltd@gmail.com</a></li>
            <li className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" /><span>P.O Box 180101-00100, Nairobi</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Daily Bazaar Ltd. All rights reserved.
      </div>
    </footer>
  );
}
