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
  searchParams: { make?: string; sort?: string };
}) {
  const sort = searchParams.sort || 'newest';
  const make = searchParams.make;

  const vehicles = await prisma.vehicle.findMany({
    where: { status: 'available', ...(make ? { make: { equals: make, mode: 'insensitive' } } : {}) },
    orderBy: SORT_MAP[sort] || SORT_MAP.newest,
    include: { images: { where: { isPrimary: true }, take: 1 } }
  });

  return (
    <main className="py-12 px-[5%]">
      <h1 className="text-2xl font-bold mb-6">Our Inventory</h1>

      <InventoryFilters />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {vehicles.length
          ? vehicles.map(v => <VehicleCard key={v.slug} v={v as any} />)
          : <p>No vehicles match your search.</p>}
      </div>
    </main>
  );
}
