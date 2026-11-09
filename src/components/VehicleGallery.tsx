
'use client';

import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import Image from 'next/image';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Images,
} from 'lucide-react';

export default function VehicleGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const galleryImages = images.length
    ? images
    : ['/placeholder-car.jpg'];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const total = galleryImages.length;
  const activeImage = galleryImages[activeIndex];

  const previousImage = useCallback(() => {
    setActiveIndex((current) => (current - 1 + total) % total);
  }, [total]);

  const nextImage = useCallback(() => {
    setActiveIndex((current) => (current + 1) % total);
  }, [total]);

  const selectImage = (index: number) => {
    setActiveIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!lightbox) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') previousImage();
      if (event.key === 'ArrowRight') nextImage();
      if (event.key === 'Escape') setLightbox(false);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox, previousImage, nextImage]);

  // Prevent background scrolling while fullscreen gallery is open
  useEffect(() => {
    if (!lightbox) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [lightbox]);

  // Swipe navigation for mobile and touch screens
  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX;
    touchStartY.current = event.touches[0].clientY;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = event.changedTouches[0].clientX - touchStartX.current;
    const deltaY = event.changedTouches[0].clientY - touchStartY.current;

    // Only treat a clear horizontal movement as a swipe
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        nextImage();
      } else {
        previousImage();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div className="w-full">
      {/* Main image */}
      <div
        className="relative mb-3 h-72 w-full overflow-hidden rounded-2xl bg-gray-100 sm:h-96 lg:h-[480px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={activeImage}
          alt={`${alt} - Photo ${activeIndex + 1}`}
          fill
          priority
          unoptimized
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />

        {/* Image counter */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-xs font-semibold text-white">
          <Images className="h-4 w-4" />
          {activeIndex + 1} / {total}
        </div>

        {/* Previous arrow */}
        {total > 1 && (
          <button
            type="button"
            onClick={previousImage}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition hover:bg-black"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
        )}

        {/* Next arrow */}
        {total > 1 && (
          <button
            type="button"
            onClick={nextImage}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition hover:bg-black"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        )}

        {/* Fullscreen button */}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="View fullscreen"
          className="absolute bottom-4 right-4 z-10 flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black"
        >
          <Maximize2 className="h-4 w-4" />
          View photos
        </button>

        {/* Swipe hint */}
        {total > 1 && (
          <div className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-2 text-xs text-white sm:hidden">
            Swipe to view photos
          </div>
        )}
      </div>

      {/* Thumbnail gallery */}
      <div className="flex gap-3 overflow-x-auto pb-3">
        {galleryImages.map((img, index) => (
          <button
            key={`${img}-${index}`}
            type="button"
            onClick={() => selectImage(index)}
            aria-label={`View image ${index + 1}`}
            aria-pressed={activeIndex === index}
            className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-36 ${
              activeIndex === index
                ? 'border-accent ring-2 ring-accent/20'
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <Image
              src={img}
              alt={`${alt} thumbnail ${index + 1}`}
              fill
              unoptimized
              sizes="144px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Fullscreen gallery */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightbox(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Vehicle photo gallery"
        >
          {/* Close */}
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close gallery"
            className="absolute right-5 top-5 z-30 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <X className="h-7 w-7" />
          </button>

          {/* Counter */}
          <div className="absolute left-1/2 top-6 z-30 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white">
            {activeIndex + 1} / {total}
          </div>

          {/* Previous */}
          {total > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                previousImage();
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30 sm:left-8"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Large image */}
          <div
            className="relative h-[75vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={alt}
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {/* Next */}
          {total > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/30 sm:right-8"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
