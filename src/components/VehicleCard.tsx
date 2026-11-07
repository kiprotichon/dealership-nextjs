
import Link from 'next/link';
import Image from 'next/image';
import {
  Gauge,
  Fuel,
  Settings2,
  ArrowUpRight,
  CalendarDays,
} from 'lucide-react';

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

  const formattedPrice = Number(v.price).toLocaleString('en-KE');

  const isAvailable = !v.status || v.status === 'available';

  const specifications = [
    {
      icon: CalendarDays,
      label: 'Year',
      value: String(v.year),
    },
    {
      icon: Gauge,
      label: 'Mileage',
      value: v.mileage != null
        ? `${v.mileage.toLocaleString('en-KE')} km`
        : 'Not specified',
    },
    {
      icon: Fuel,
      label: 'Fuel',
      value: v.fuelType || 'Not specified',
    },
    {
      icon: Settings2,
      label: 'Transmission',
      value: v.transmission || 'Not specified',
    },
  ];

  return (
    <Link
      href={`/inventory/${v.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#f0bc00] hover:shadow-xl hover:shadow-black/10"
    >
      {/* VEHICLE IMAGE */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#eeeeee]">

        <Image
          src={img}
          alt={`${v.year} ${v.make} ${v.model}`}
          fill
          unoptimized
          sizes="(max-width: 640px) 290px, 340px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 opacity-70" />

        {/* Featured badge */}
        {v.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#f0bc00] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#0b0b0b] shadow-md">
            Featured
          </span>
        )}

        {/* Availability badge */}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider shadow-md ${
            isAvailable
              ? 'bg-white text-[#0b0b0b]'
              : 'bg-[#0b0b0b] text-white'
          }`}
        >
          {v.status || 'Available'}
        </span>

        {/* Image bottom title */}
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
            {v.year} · {v.make}
          </p>
        </div>

      </div>

      {/* VEHICLE INFORMATION */}
      <div className="flex flex-1 flex-col p-5">

        <div className="flex-1">

          <div className="flex items-start justify-between gap-3">

            <div>
              <h3 className="text-lg font-extrabold leading-snug text-[#0b0b0b] transition group-hover:text-[#9b7900]">
                {v.make} {v.model}
              </h3>

              <p className="mt-1 text-xs font-medium text-gray-500">
                {v.year} Model
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f0bc00]/15 text-[#0b0b0b] transition group-hover:bg-[#f0bc00]">
              <ArrowUpRight size={18} />
            </div>

          </div>

          {/* PRICE */}
          <div className="mt-5 border-y border-gray-100 py-4">

            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
              Asking Price
            </p>

            <p className="mt-1 text-2xl font-black tracking-tight text-[#0b0b0b]">
              <span className="mr-1 text-sm font-bold text-gray-500">
                KSh
              </span>
              {formattedPrice}
            </p>

          </div>

          {/* VEHICLE SPECIFICATIONS */}
          <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">

            {specifications.map((spec) => {
              const Icon = spec.icon;

              return (
                <div
                  key={spec.label}
                  className="flex min-w-0 items-start gap-2"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f5f5f5] text-[#8a6c00]">
                    <Icon size={14} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                      {spec.label}
                    </p>

                    <p className="mt-0.5 truncate text-xs font-bold text-gray-700">
                      {spec.value}
                    </p>
                  </div>
                </div>
              );
            })}

          </div>

        </div>

        {/* DETAILS BUTTON */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">

          <span className="text-xs font-bold text-[#0b0b0b]">
            View Vehicle Details
          </span>

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0b0b0b] text-white transition group-hover:bg-[#f0bc00] group-hover:text-[#0b0b0b]">
            <ArrowUpRight size={16} />
          </span>

        </div>

      </div>
    </Link>
  );
}
