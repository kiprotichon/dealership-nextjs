
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BRANDS = [
  { name: 'Audi', make: 'Audi', logo: 'Audi.jpg' },
  { name: 'BMW', make: 'BMW', logo: 'BMW.jpg' },
  { name: 'Ford', make: 'Ford', logo: 'Ford.jpg' },
  { name: 'Honda', make: 'Honda', logo: 'Honda.jpg' },
  { name: 'Isuzu', make: 'Isuzu', logo: 'Isuzu.jpg' },
  { name: 'Jeep', make: 'Jeep', logo: 'Jeep.jpg' },
  { name: 'Land Rover', make: 'Land Rover', logo: 'Land-Rover.jpg' },
  { name: 'Lexus', make: 'Lexus', logo: 'Lexus.jpg' },
  { name: 'Mazda', make: 'Mazda', logo: 'Mazda.jpg' },
  { name: 'Mercedes-Benz', make: 'Mercedes', logo: 'Mercedes.jpg' },
  { name: 'Mini Cooper', make: 'Mini', logo: 'Mini-Cooper.jpg' },
  { name: 'Mitsubishi', make: 'Mitsubishi', logo: 'Mitsubishi.jpg' },
  { name: 'Nissan', make: 'Nissan', logo: 'Nissan.jpg' },
  { name: 'Peugeot', make: 'Peugeot', logo: 'Peugeot.jpg' },
  { name: 'Porsche', make: 'Porsche', logo: 'Porsche.jpg' },
  { name: 'Subaru', make: 'Subaru', logo: 'Subaru.jpg' },
  { name: 'Suzuki', make: 'Suzuki', logo: 'Suzuki.jpg' },
  { name: 'Toyota', make: 'Toyota', logo: 'Toyota.jpg' },
  { name: 'Volvo', make: 'Volvo', logo: 'Volvo.jpg' },
  { name: 'Volkswagen', make: 'Volkswagen', logo: 'VW.jpg' },
];

function normalizeBrand(value: string) {
  const brand = value.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (brand === 'mercedes' || brand === 'mercedesbenz') return 'mercedes';
  if (brand === 'vw' || brand === 'volkswagen') return 'volkswagen';
  if (brand === 'mini' || brand === 'minicooper') return 'mini';
  if (brand === 'landrover') return 'landrover';

  return brand;
}

export default function BrandScroller({
  counts,
}: {
  counts: Record<string, number>;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [failedLogos, setFailedLogos] = useState<string[]>([]);

  const brands = BRANDS
    .map((brand) => {
      const count = Object.entries(counts).reduce(
        (total, [databaseMake, vehicleCount]) =>
          normalizeBrand(databaseMake) === normalizeBrand(brand.make)
            ? total + vehicleCount
            : total,
        0
      );

      return { ...brand, count };
    })
    .filter((brand) => !failedLogos.includes(brand.logo))
    .sort((a, b) => b.count - a.count);

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -300 : 300,
      behavior: 'smooth',
    });
  };

  return (
    <section>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b58b00]">
            Explore our collection
          </p>

          <h2 className="mt-2 text-3xl font-black text-[#0b0b0b] sm:text-4xl">
            Shop By Brand
          </h2>

          <p className="mt-3 text-sm text-gray-500">
            Browse available vehicles from your favourite manufacturers.
          </p>
        </div>

        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll brands left"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 transition hover:border-[#f0bc00] hover:bg-[#f0bc00]"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll brands right"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 transition hover:border-[#f0bc00] hover:bg-[#f0bc00]"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
      >
        {brands.map((brand) => (
          <Link
            key={brand.name}
            href={`/inventory?make=${encodeURIComponent(brand.make)}`}
            className="group flex min-w-[150px] flex-col items-center rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-[#f0bc00] hover:shadow-lg sm:min-w-[170px]"
          >
            <div className="relative flex h-20 w-full items-center justify-center">
              <Image
                src={`/brands/${brand.logo}`}
                alt={`${brand.name} logo`}
                width={130}
                height={73}
                unoptimized
                className="max-h-[65px] w-auto max-w-full object-contain"
                onError={() =>
                  setFailedLogos((current) =>
                    current.includes(brand.logo)
                      ? current
                      : [...current, brand.logo]
                  )
                }
              />
            </div>

            <h3 className="mt-3 text-center text-sm font-bold text-[#0b0b0b] transition group-hover:text-[#a77e00]">
              {brand.name}
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {brand.count} {brand.count === 1 ? 'vehicle' : 'vehicles'}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
