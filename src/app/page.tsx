import Link from 'next/link';
import { Shield, Building2, Truck } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import VehicleCard from '@/components/VehicleCard';
import SearchPanel from '@/components/SearchPanel';
import BrandScroller from '@/components/BrandScroller';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [rows, featured] = await Promise.all([
    prisma.vehicle.findMany({ where: { status: 'available' }, select: { make: true, model: true, year: true } }),
    prisma.vehicle.findMany({
      where: { status: 'available' },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take: 6,
      include: { images: { where: { isPrimary: true }, take: 1 } }
    })
  ]);

  const models: Record<string, string[]> = {};
  const counts: Record<string, number> = {};
  for (const r of rows) {
    counts[r.make] = (counts[r.make] || 0) + 1;
    models[r.make] = Array.from(new Set([...(models[r.make] || []), r.model])).sort();
  }
  const years = Array.from(new Set(rows.map(r => r.year))).sort((a, b) => b - a);

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-32 sm:px-6 sm:pt-24 lg:px-8">
          <p className="text-sm font-semibold text-accent">Smart deals everyday</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Quality cars at prices that make sense.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-gray-300">
            Browse our Nairobi inventory of inspected vehicles, with transparent pricing and no surprises.
          </p>
        </div>
      </section>

      {/* Search – overlaps hero cleanly */}
      <section className="relative z-10 -mt-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SearchPanel models={models} years={years} />
        </div>
      </section>

      {/* Brand logos – horizontal scroll, stock first */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-primary sm:text-3xl">Start with a name you know.</h2>
        <p className="mt-1 text-sm text-gray-500">Swipe or scroll to browse popular makes.</p>
        <BrandScroller counts={counts} />
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">Featured vehicles</h2>
          <Link
            href="/inventory"
            className="text-sm font-semibold text-primary underline decoration-accent decoration-2 underline-offset-4"
          >
            View all inventory
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length ? (
            featured.map(v => <VehicleCard key={v.slug} v={v as any} />)
          ) : (
            <p className="text-gray-500">No vehicles available yet. Check back soon.</p>
          )}
        </div>
      </section>

      {/* Why buy with us */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-primary text-center mb-8">
          Why Buy Vehicles for Sale in Kenya With Us
        </h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Shield,
              title: 'Verified Stock',
              desc: 'Every car for sale in Kenya on our platform is inspected and listed with accurate mileage, condition and import history with no surprises.'
            },
            {
              icon: Building2,
              title: 'Flexible Financing',
              desc: 'We work with leading banks so you can finance your next vehicle with terms that fit your budget, up to 100% financing available.'
            },
            {
              icon: Truck,
              title: 'Nationwide Delivery',
              desc: 'Buy from anywhere in the country and we will deliver used and new cars for sale in Kenya right to your doorstep.'
            }
          ].map(item => (
            <div key={item.title} className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-primary mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-primary text-center mb-6">Common Questions</h2>
        <div className="space-y-3">
          {[
            {
              q: 'How do I buy a car in Kenya through Daily Bazaar?',
              a: 'Browse inventory, contact us via WhatsApp or the inquiry form, arrange a viewing, and complete the purchase with transparent paperwork.'
            },
            {
              q: 'Do you sell both new and used cars for sale in Kenya?',
              a: 'Yes. We list Foreign Used, Locally Used and Brand New vehicles depending on current stock.'
            },
            {
              q: 'What makes Daily Bazaar one of the top car dealers in Kenya?',
              a: 'Inspected stock, honest pricing, flexible financing options and friendly local support in Nairobi.'
            }
          ].map((item, i) => (
            <details key={i} className="group bg-white rounded-xl border border-gray-200">
              <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-medium text-primary list-none">
                {item.q}
                <span className="text-accent text-xl group-open:rotate-45 transition">+</span>
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-600">{item.a}</div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
