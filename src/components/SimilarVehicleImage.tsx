
'use client';

import { useState } from 'react';

interface SimilarVehicleImageProps {
  src: string;
  alt: string;
}

export default function SimilarVehicleImage({
  src,
  alt,
}: SimilarVehicleImageProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <img
      src={imageError ? '/placeholder-car.jpg' : src}
      alt={alt}
      loading="lazy"
      onError={() => setImageError(true)}
      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
    />
  );
}
