'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CarFront,
  PlusCircle,
  MessageSquare,
  LockKeyhole,
  Menu,
  X,
  LogOut,
  ChevronRight
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/listings', label: 'Vehicle Listings', icon: CarFront },
  { href: '/admin/add-vehicle', label: 'Add Vehicle', icon: PlusCircle },
  { href: '/admin/inquiries', label: 'Customer Inquiries', icon: MessageSquare },
  { href: '/admin/change-password', label: 'Change Password', icon: LockKeyhole }
];

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Login page must never show the admin layout/sidebar
  const isLoginPage = pathname === '/admin/login';

  // Protect all admin pages except the login page
  useEffect(() => {
    if (isLoginPage) {
      setReady(true);
      return;
    }

    const token = localStorage.getItem('admin_token');

    if (!token) {
      router.replace('/admin/login');
      return;
    }

    setReady(true);
  }, [isLoginPage, router]);

  // Close mobile menu when navigating
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Close drawer with Escape key
  useEffect(() => {
    if (!menuOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  function logout() {
    localStorage.removeItem('admin_token');
    setReady(false);
    router.replace('/admin/login');
  }

  /*
   * Login page:
   * Render ONLY the login page.
   * No sidebar, no admin header, no admin navigation.
   */
  if (isLoginPage) {
    return <>{children}</>;
  }

  /*
   * Protected admin pages:
   * Don't render the admin interface until authentication
   * has been checked.
   */
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f6f8]">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#f0bc00]" />
          <p className="text-sm text-gray-500">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-[#f5f6f8] text-gray-900">

      {/* Top black line - Desktop only */}
      <div className="fixed top-0 left-0 right-0 z-50 hidden h-[10px] bg-[#0b0b0b] lg:block" />

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-[#0b0b0b] text-white lg:flex">

        <div className="flex h-24 items-center border-b border-white/10 px-7">
          <Image
            src="/logo_transparent_yellow.png"
            alt="Daily Bazaar"
            width={155}
            height={60}
            className="h-11 w-auto object-contain"
            priority
          />
        </div>

        <div className="px-5 pt-8">
          <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[2px] text-gray-500">
            Management
          </p>

          <nav className="space-y-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;

              const active =
                pathname === link.href ||
                (link.href !== '/admin/dashboard' &&
                  pathname.startsWith(link.href + '/'));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    active
                      ? 'bg-[#f0bc00] text-[#0b0b0b]'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={19} />
                  <span>{link.label}</span>

                  {active && (
                    <ChevronRight size={16} className="ml-auto" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-white/10 p-5">
          <div className="mb-4 rounded-xl bg-white/5 p-3">
            <p className="text-xs font-semibold text-white">
              Daily Bazaar
            </p>

            <p className="mt-1 text-[11px] text-gray-500">
              Administration Panel
            </p>
          </div>

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile and Tablet Header */}
      <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-black/20 bg-[#0b0b0b] px-4 shadow-sm lg:hidden">

        <Image
          src="/logo_transparent_yellow.png"
          alt="Daily Bazaar"
          width={200}
          height={60}
          className="h-12 w-auto rounded bg-[#0b0b0b] px-2 py-1 object-contain"
        />

        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-yellow-500 transition hover:bg-white/10 hover:text-white"
        >
          <Menu size={22} />
        </button>
      </header>

      {/* Mobile and Tablet Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">

          <button
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[min(290px,85vw)] flex-col bg-[#0b0b0b] text-white shadow-2xl">

            <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">

              <Image
                src="/logo_transparent_yellow.png"
                alt="Daily Bazaar"
                width={200}
                height={60}
                className="h-12 w-auto object-contain"
              />

              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X size={21} />
              </button>
            </div>

            <div className="px-4 pt-7">

              <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[2px] text-gray-500">
                Management
              </p>

              <nav className="space-y-1">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;

                  const active =
                    pathname === link.href ||
                    (link.href !== '/admin/dashboard' &&
                      pathname.startsWith(link.href + '/'));

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-medium transition ${
                        active
                          ? 'bg-[#f0bc00] text-black'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon size={19} />
                      {link.label}

                      {active && (
                        <ChevronRight size={16} className="ml-auto" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-auto border-t border-white/10 p-4">
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="min-h-screen w-full min-w-0 overflow-x-hidden px-4 py-5 sm:px-6 lg:ml-64 lg:w-[calc(100%-16rem)] lg:px-8 lg:py-8">
        {children}
      </main>

    </div>
  );
}