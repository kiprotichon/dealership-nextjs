import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import VehicleCard from '@/components/VehicleCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: 'available' },
    orderBy: { createdAt: 'desc' },
    take: 6,
    include: { images: { where: { isPrimary: true }, take: 1 } }
  });

  const featured = vehicles.filter(v => v.featured).length ? vehicles.filter(v => v.featured) : vehicles;

  return (
    <main>
      <section
        className="text-white text-center py-24 px-[5%]"
        style={{ background: 'linear-gradient(rgba(11,31,58,0.85), rgba(11,31,58,0.85)), url(/hero-bg.jpg) center/cover' }}
      >
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Ride</h1>
        <p className="text-lg text-gray-300 mb-8">
          Trusted quality vehicles, transparent pricing, and financing options tailored for you.
        </p>
        <Link href="/inventory" className="btn">Browse Inventory</Link>
      </section>

      <section className="py-16 px-[5%]">
        <h2 className="text-2xl font-bold text-center mb-8">Featured Vehicles</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          {featured.length
            ? featured.map(v => <VehicleCard key={v.slug} v={v as any} />)
            : <p>No vehicles available yet. Check back soon.</p>}
        </div>
      </section>

      <section className="py-16 px-[5%] bg-white">
        <h2 className="text-2xl font-bold text-center mb-8">Why Choose Premier Motors</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
          <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
            <strong>Verified Vehicles</strong>
            <p className="text-gray-500 mt-1">Every car is inspected before listing.</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
            <strong>Flexible Financing</strong>
            <p className="text-gray-500 mt-1">Financing partners to help you drive today.</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 shadow-sm">
            <strong>Trade-In Welcome</strong>
            <p className="text-gray-500 mt-1">Trade your current vehicle toward a new one.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
