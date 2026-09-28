import Link from 'next/link';
import { Shield, Tag, Headphones } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import VehicleCard from '@/components/VehicleCard';
import SearchPanel from '@/components/SearchPanel';

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
  const brands = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <main>
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 pb-40 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <p className="text-sm font-semibold text-accent">Smart deals everyday</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">Quality cars at prices that make sense.</h1>
          <p className="mt-5 max-w-xl text-lg text-gray-300">Browse our Nairobi inventory of inspected vehicles, with transparent pricing and no surprises.</p>
        </div>
      </section>

      <section className="-mt-28 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl"><SearchPanel models={models} years={years} /></div>
      </section>

      {brands.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">Start with a name you know.</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {brands.map(([make, n]) => (
              <Link key={make} href={`/inventory?make=${encodeURIComponent(make)}`} className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-accent hover:shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-extrabold text-accent">{make.slice(0, 2).toUpperCase()}</div>
                <p className="mt-4 font-semibold text-primary">{make}</p>
                <p className="text-sm text-gray-500">{n} {n === 1 ? 'car' : 'cars'} available</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">Featured vehicles</h2>
          <Link href="/inventory" className="text-sm font-semibold text-primary underline decoration-accent decoration-2 underline-offset-4">View all inventory</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.length ? featured.map(v => <VehicleCard key={v.slug} v={v as any} />) : <p className="text-gray-500">No vehicles available yet. Check back soon.</p>}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-3xl bg-accent p-8 sm:grid-cols-3">
          {[
            { icon: Shield, title: 'Inspected before listing', desc: 'Every car is checked so you buy with confidence.' },
            { icon: Tag, title: 'Transparent pricing', desc: 'The price you see is the price you pay.' },
            { icon: Headphones, title: 'Local support', desc: 'Call or WhatsApp us, or visit us in Nairobi.' }
          ].map(i => (
            <div key={i.title} className="flex gap-4">
              <i.icon className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <div><p className="font-bold text-primary">{i.title}</p><p className="mt-1 text-sm text-primary/80">{i.desc}</p></div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
