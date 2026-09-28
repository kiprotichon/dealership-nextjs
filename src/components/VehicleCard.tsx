import Link from 'next/link';
import Image from 'next/image';
import { Gauge, Fuel, Settings } from 'lucide-react';

export interface VehicleCardData {
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number | string;
  mileage: number | null;
  transmission: string | null;
  fuelType: string | null;
  status?: string;
  featured?: boolean;
  images?: { imageUrl: string }[];
}

export default function VehicleCard({ v }: { v: VehicleCardData }) {
  const img = v.images?.[0]?.imageUrl || '/placeholder-car.jpg';
  return (
    <Link href={`/inventory/${v.slug}`} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-accent hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <Image src={img} alt={`${v.year} ${v.make} ${v.model}`} fill unoptimized className="object-cover transition duration-300 group-hover:scale-105" />
        {v.featured && <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">Featured</span>}
        {v.status && v.status !== 'available' && (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold capitalize text-white">{v.status}</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{v.year} {v.make} {v.model}</h3>
        <p className="mt-1 text-xl font-extrabold text-primary">KSh {Number(v.price).toLocaleString()}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500">
          {v.mileage != null && <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{v.mileage.toLocaleString()} km</span>}
          {v.fuelType && <span className="flex items-center gap-1"><Fuel className="h-3.5 w-3.5" />{v.fuelType}</span>}
          {v.transmission && <span className="flex items-center gap-1"><Settings className="h-3.5 w-3.5" />{v.transmission}</span>}
        </div>
      </div>
    </Link>
  );
}
