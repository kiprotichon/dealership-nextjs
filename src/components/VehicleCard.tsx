'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Gauge,
  Fuel,
  Settings2,
  ArrowUpRight,
  CalendarDays,
  CarFront,
  MessageCircle,
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
  const imageUrl = v.images?.[0]?.imageUrl?.trim() || '';
  const [imageFailed, setImageFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // FIX: if the image fails BEFORE React hydrates, onError never fires and the
  // browser shows the broken icon + alt text. Check the element once mounted.
  useEffect(() => {
    const img = imgRef.current;
    setImageFailed(!!img && img.complete && img.naturalWidth === 0);
  }, [imageUrl]);

  const formattedPrice = Number(v.price).toLocaleString('en-KE');

  const status = (v.status || 'available').toLowerCase();
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  const isAvailable = status === 'available';
  const isSold = status === 'sold';

  const statusStyles = isAvailable
    ? 'bg-white text-[#0b0b0b]'
    : isSold
    ? 'bg-[#0b0b0b] text-white'
    : 'bg-amber-100 text-amber-900'; // reserved

  const whatsappMessage = encodeURIComponent(
    `Hello Daily Bazaar, I'm interested in the ${v.year} ${v.make} ${v.model} listed on your website. Is it still available?`
  );

  const whatsappUrl = `https://wa.me/254715455098?text=${whatsappMessage}`;

  const specifications = [
    {
      icon: CalendarDays,
      label: 'Year',
      value: String(v.year),
    },
    {
      icon: Gauge,
      label: 'Mileage',
      value:
        v.mileage != null
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
    // `relative` lets the title link stretch over the whole card (see below)
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#f0bc00] hover:shadow-xl hover:shadow-black/10">
      {/* VEHICLE IMAGE (not a separate link - the whole card is tappable) */}
      <div className="relative aspect-[16/9] overflow-hidden bg-[#eeeeee] sm:aspect-[16/10]">
        {imageUrl && !imageFailed ? (
          <Image
            ref={imgRef}
            src={imageUrl}
            alt={`${v.year} ${v.make} ${v.model}`}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 340px"
            onError={() => setImageFailed(true)}
            className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
              isSold ? 'grayscale' : ''
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#f7f7f7] to-[#dddddd] text-gray-500">
            <CarFront size={54} strokeWidth={1.2} />
            <span className="mt-2 text-xs font-semibold uppercase tracking-wider">
              Image coming soon
            </span>
          </div>
        )}

        {/* IMAGE OVERLAY */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* FEATURED BADGE */}
        {v.featured && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#f0bc00] px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#0b0b0b] shadow-lg">
            Featured
          </span>
        )}

        {/* STATUS BADGE (Available / Reserved / Sold) */}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider shadow-lg ${statusStyles}`}
        >
          {statusLabel}
        </span>

        {/* IMAGE BOTTOM TITLE */}
        <div className="pointer-events-none absolute bottom-3 left-4 right-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-white/90">
            {v.year} · {v.make}
          </p>
        </div>
      </div>

      {/* VEHICLE INFORMATION */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex-1">
          {/* TITLE - its ::after stretches over the entire card so a tap
              anywhere opens the vehicle. Buttons below use `relative z-10`
              to stay clickable on their own. */}
          <h3 className="text-lg font-extrabold leading-snug text-[#0b0b0b] transition-colors group-hover:text-[#a77e00]">
            <Link
              href={`/inventory/${v.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {v.make} {v.model}
            </Link>
          </h3>

          {/* PRICE */}
          <div className="mt-3 border-y border-gray-100 py-3 sm:mt-4 sm:py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-500">
              Asking Price
            </p>

            <p className="mt-1 text-2xl font-black tracking-tight text-[#0b0b0b]">
              <span className="mr-1 text-sm font-bold text-[#8a6c00]">
                KSh
              </span>
              {formattedPrice}
            </p>
          </div>

          {/* VEHICLE SPECIFICATIONS */}
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 sm:mt-4 sm:gap-y-4">
            {specifications.map((spec) => {
              const Icon = spec.icon;

              return (
                <div
                  key={spec.label}
                  className="flex min-w-0 items-start gap-2"
                >
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f0bc00]/12 text-[#8a6c00]">
                    <Icon size={14} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">
                      {spec.label}
                    </p>

                    <p className="mt-0.5 truncate text-[13px] font-bold text-gray-800">
                      {spec.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3 sm:mt-5 sm:pt-4">
          <Link
            href={`/inventory/${v.slug}`}
            className="relative z-10 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-[#0b0b0b] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#f0bc00] hover:text-[#0b0b0b]"
          >
            View Details
            <ArrowUpRight size={15} />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-2.5 text-xs font-bold text-white transition hover:brightness-95"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}