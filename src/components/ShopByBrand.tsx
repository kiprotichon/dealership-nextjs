import Link from 'next/link';
import { Car, ArrowUpRight } from 'lucide-react';

interface BrandCount {
  make: string;
  count: number;
}

export default function ShopByBrand({ brands }: { brands: BrandCount[] }) {
  if (!brands.length) return null;

  return (
    <section className="py-16 px-[5%] bg-gray-50">
      <div className="mb-8">
        <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-1">Browse by brand</p>
        <h2 className="text-2xl font-bold text-gray-900">Shop a name you know</h2>
        <p className="text-gray-500 mt-1">Jump straight into the vehicles currently available for each make.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {brands.slice(0, 12).map(b => (
          <Link
            key={b.make}
            href={`/inventory?make=${encodeURIComponent(b.make)}`}
            className="group bg-white rounded-xl border border-gray-200 p-5 text-center hover:border-accent hover:shadow-md transition"
          >
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 group-hover:bg-accent/20 transition">
              <Car className="h-6 w-6 text-gray-700" />
            </div>
            <div className="font-semibold text-sm text-gray-900">{b.make}</div>
            <div className="mt-1 flex items-center justify-center gap-1 text-xs text-gray-500 group-hover:text-accent">
              View cars <ArrowUpRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
