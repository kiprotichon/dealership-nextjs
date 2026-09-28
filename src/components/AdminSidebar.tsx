'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/listings', label: 'Listings' },
  { href: '/admin/add-vehicle', label: 'Add Vehicle' },
  { href: '/admin/inquiries', label: 'Inquiries' }
];

export default function AdminSidebar({ onLogout }: { onLogout: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-primary text-white p-5 shrink-0">
      <Image src="/logo-white.png" alt="Daily Bazaar" width={140} height={54} className="h-10 w-auto object-contain mb-6" />
      {LINKS.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className={`block px-2 py-2 rounded-md mb-1 ${pathname === link.href ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/10'}`}
        >
          {link.label}
        </Link>
      ))}
      <button onClick={onLogout} className="block px-2 py-2 rounded-md text-gray-300 hover:bg-white/10 w-full text-left">
        Logout
      </button>
    </aside>
  );
}
