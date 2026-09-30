'use client';

import { useState } from 'react';
import Link from 'next/link';

// Priority order – brands with stock appear first via sorting in parent, but this list defines display order preference
const PRIORITY = [
  'Toyota', 'BMW', 'Mercedes-Benz', 'Nissan', 'Mazda', 'Subaru',
  'Honda', 'Mitsubishi', 'Isuzu', 'Audi', 'Volkswagen', 'Ford',
  'Hyundai', 'Kia', 'Suzuki', 'Land Rover', 'Lexus', 'Peugeot',
  'Volvo', 'Jeep', 'Chevrolet', 'Porsche', 'Tesla', 'Hino'
];

// Working logo URLs (vehiclespecs CDN). Missing ones fall back to initials.
const LOGOS: Record<string, string> = {
  Toyota: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/toyota-logo.svg',
  BMW: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/bmw-logo.svg',
  'Mercedes-Benz': 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/mercedes-benz-logo.svg',
  Mercedes: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/mercedes-benz-logo.svg',
  Nissan: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/nissan-logo.svg',
  Mazda: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/mazda-logo.svg',
  Mitsubishi: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/mitsubishi-logo.svg',
  Isuzu: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/isuzu-logo.svg',
  Audi: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/audi-logo.svg',
  Volkswagen: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/volkswagen-logo.svg',
  Ford: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/ford-logo.svg',
  Hyundai: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/hyundai-logo.svg',
  Kia: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/kia-logo.svg',
  Suzuki: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/suzuki-logo.svg',
  'Land Rover': 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/land-rover-logo.svg',
  Peugeot: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/peugeot-logo.svg',
  Volvo: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/volvo-logo.svg',
  Jeep: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/jeep-logo.svg',
  Porsche: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/porsche-logo.svg',
  Tesla: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/tesla-logo.svg',
  Honda: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/honda-logo.svg',
  Subaru: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/subaru-logo.svg',
  Lexus: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/lexus-logo.svg',
  Chevrolet: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/chevrolet-logo.svg',
  Hino: 'https://cdn.jsdelivr.net/gh/vehiclespecs/brand-logos@main/hino-logo.svg',
};

function BrandCard({ make, count }: { make: string; count: number }) {
  const [imgFailed, setImgFailed] = useState(false);
  const logo = LOGOS[make];

  return (
    <Link
      href={`/inventory?make=${encodeURIComponent(make)}`}
      className="group flex w-36 shrink-0 flex-col items-center rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-accent hover:shadow-md"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 overflow-hidden">
        {logo && !imgFailed ? (
          <img
            src={logo}
            alt={`${make} logo`}
            className="h-10 w-10 object-contain"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="text-sm font-extrabold text-primary">{make.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      <p className="mt-3 text-sm font-semibold text-primary text-center truncate w-full">{make}</p>
      <p className="text-xs text-gray-500">
        {count > 0 ? `${count} ${count === 1 ? 'car' : 'cars'} available` : 'View inventory'}
      </p>
    </Link>
  );
}

export default function BrandScroller({ counts }: { counts: Record<string, number> }) {
  // Stock first, then priority order
  const withStock = Object.keys(counts).filter(m => counts[m] > 0);
  const rest = PRIORITY.filter(m => !withStock.includes(m));
  // Also include any stock brands not in PRIORITY
  const extra = withStock.filter(m => !PRIORITY.includes(m));
  const ordered = [
    ...withStock.sort((a, b) => counts[b] - counts[a]),
    ...PRIORITY.filter(m => !withStock.includes(m)),
    ...extra
  ];
  // Deduplicate
  const makes = Array.from(new Set(ordered));

  return (
    <div className="mt-6 -mx-4 px-4">
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {makes.map(make => (
          <BrandCard key={make} make={make} count={counts[make] || 0} />
        ))}
      </div>
    </div>
  );
}
