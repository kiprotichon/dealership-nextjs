import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import VehicleCard from '@/components/VehicleCard';
import InventoryFilters from '@/components/InventoryFilters';

export const dynamic = 'force-dynamic';

const SORT_MAP: Record<string, any> = {
  newest: { createdAt: 'desc' },
  price_low: { price: 'asc' },
  price_high: { price: 'desc' },
  year: { year: 'desc' }
};

export default async function InventoryPage({
  searchParams
}: {
  searchParams: { q?: string; make?: string; model?: string; year?: string; status?: string; sort?: string };
}) {
  const { q, make, model, year, status = 'available', sort = 'newest' } = searchParams;
  const ci = (v: string) => ({ equals: v, mode: 'insensitive' as const });

  const where: any = {};
  if (status !== 'any') where.status = status;
  if (make) where.make = ci(make);
  if (model) where.model = ci(model);
  if (year && !isNaN(Number(year))) where.year = Number(year);
  if (q) where.OR = ['make', 'model', 'description'].map(f => ({ [f]: { contains: q, mode: 'insensitive' } }));

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: SORT_MAP[sort] || SORT_MAP.newest,
    include: { images: { where: { isPrimary: true }, take: 1 } }
  });

  const filtered = Boolean(q || make || model || year);

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">{make ? `${make} ${model || ''}`.trim() : 'Our inventory'}</h1>
          <p className="mt-1 text-sm text-gray-500">{vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} found</p>
        </div>
        {filtered && <Link href="/inventory" className="text-sm font-semibold text-primary underline decoration-accent decoration-2 underline-offset-4">Clear filters</Link>}
      </div>

      <InventoryFilters />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.length ? vehicles.map(v => <VehicleCard key={v.slug} v={v as any} />) : <p className="text-gray-500">No vehicles match your search.</p>}
      </div>
    </main>
  );
}
