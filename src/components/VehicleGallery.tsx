'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export default function VehicleGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(images[0] || '/placeholder-car.jpg');
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const mainImages = images.slice(0, 3);
  const remaining = images.length - 3;

  return (
    <div>
      {/* Main image */}
      <div
        className="relative h-72 sm:h-80 lg:h-96 w-full rounded-2xl overflow-hidden mb-3 bg-gray-100 cursor-pointer"
        onClick={() => setLightbox(true)}
      >
        <Image src={active} alt={alt} fill className="object-cover" unoptimized priority />
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {mainImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(img)}
            className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition ${
              active === img ? 'border-accent' : 'border-transparent hover:border-gray-300'
            }`}
          >
            <Image src={img} alt={`${alt} ${i + 1}`} fill className="object-cover" unoptimized />
          </button>
        ))}

        {remaining > 0 && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600 hover:bg-gray-200 transition"
          >
            <span className="absolute inset-0">
              <Image src={images[3]} alt="" fill className="object-cover opacity-40" unoptimized />
            </span>
            <span className="relative z-10 bg-white/90 px-3 py-1.5 rounded-full shadow text-xs font-semibold">
              Show more photos
            </span>
          </button>
        )}
      </div>

      {/* Expanded thumbs when "Show more" clicked */}
      {showAll && images.length > 3 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {images.slice(3).map((img, i) => (
            <button
              key={i + 3}
              onClick={() => setActive(img)}
              className={`relative shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 ${
                active === img ? 'border-accent' : 'border-transparent'
              }`}
            >
              <Image src={img} alt={`${alt} ${i + 4}`} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}

      {/* Simple lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-white/10 hover:bg-white/20"
            onClick={() => setLightbox(false)}
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative w-full max-w-4xl h-[70vh]">
            <Image src={active} alt={alt} fill className="object-contain" unoptimized />
          </div>
        </div>
      )}
    </div>
  );
}
