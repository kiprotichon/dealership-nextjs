'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function VehicleGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(images[0] || '/placeholder-car.jpg');

  return (
    <div>
      <div className="relative h-80 w-full rounded-xl overflow-hidden mb-3 bg-gray-200">
        <Image src={active} alt={alt} fill className="object-cover" unoptimized />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <button key={i} onClick={() => setActive(img)} className="shrink-0">
            <div className="relative w-20 h-14 rounded-md overflow-hidden">
              <Image src={img} alt={`${alt} thumbnail ${i + 1}`} fill className="object-cover" unoptimized />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
