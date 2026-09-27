import Link from 'next/link';
import Image from 'next/image';

export interface VehicleCardData {
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number | string;
  mileage: number | null;
  transmission: string | null;
  fuelType: string | null;
  featured?: boolean;
  images?: { imageUrl: string }[];
}

function formatPrice(price: number | string) {
  return 'KSh ' + Number(price).toLocaleString();
}

export default function VehicleCard({ v }: { v: VehicleCardData }) {
  const img = v.images?.[0]?.imageUrl || '/placeholder-car.jpg';
  return (
    <Link
      href={`/inventory/${v.slug}`}
      className="bg-white rounded-xl overflow-hidden shadow hover:-translate-y-1 transition block"
    >
      <div className="relative h-48 w-full bg-gray-200">
        <Image src={img} alt={`${v.make} ${v.model}`} fill className="object-cover" unoptimized />
      </div>
      <div className="p-4">
        {v.featured && (
          <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded mb-2">Featured</span>
        )}
        <h3 className="font-semibold">{v.year} {v.make} {v.model}</h3>
        <div className="text-accent font-bold text-lg">{formatPrice(v.price)}</div>
        <div className="flex gap-3 text-sm text-gray-500 mt-2 flex-wrap">
          {v.mileage && <span>{v.mileage.toLocaleString()} km</span>}
          {v.transmission && <span>{v.transmission}</span>}
          {v.fuelType && <span>{v.fuelType}</span>}
        </div>
      </div>
    </Link>
  );
}
