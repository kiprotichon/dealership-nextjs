import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import VehicleGallery from '@/components/VehicleGallery';
import InquiryForm from '@/components/InquiryForm';
import SimilarVehicleImage from '@/components/SimilarVehicleImage';
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  Car,
  Shield,
  ChevronRight,
  MessageCircle,
  ArrowUpRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatPrice(price: number | string) {
  return 'KSh ' + Number(price).toLocaleString('en-KE');
}

export default async function VehicleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { slug: params.slug },
    include: {
      images: true,
      features: true,
    },
  });

  if (!vehicle) notFound();

  const currentVehicle = vehicle;

  // Find available vehicles and rank them by similarity.
  const candidates = await prisma.vehicle.findMany({
    where: {
      status: 'available',
      id: { not: vehicle.id },
    },
    include: {
      images: true,
    },
  });

  const currentPrice = Number(vehicle.price);

  function getSimilarityScore(item: (typeof candidates)[number]) {
    let score = 0;

    const sameMake =
      item.make.trim().toLowerCase() ===
      currentVehicle.make.trim().toLowerCase();

    const sameModel =
      item.model.trim().toLowerCase() ===
      currentVehicle.model.trim().toLowerCase();

    const sameBodyType =
      !!currentVehicle.bodyType &&
      !!item.bodyType &&
      item.bodyType.trim().toLowerCase() ===
        currentVehicle.bodyType.trim().toLowerCase();

    const itemPrice = Number(item.price);

    const priceDifference =
      currentPrice > 0
        ? Math.abs(itemPrice - currentPrice) / currentPrice
        : 1;

    const yearDifference = Math.abs(
      item.year - currentVehicle.year
    );

    // Same make and model.
    if (sameMake && sameModel) {
      score += 100;
    } else if (sameMake) {
      score += 45;
    }

    // Similar body type.
    if (sameBodyType) {
      score += 35;
    }

    // Similar asking price.
    if (priceDifference <= 0.15) {
      score += 25;
    } else if (priceDifference <= 0.25) {
      score += 20;
    } else if (priceDifference <= 0.35) {
      score += 12;
    } else if (priceDifference <= 0.5) {
      score += 5;
    }

    // Similar manufacturing year.
    if (yearDifference <= 2) {
      score += 15;
    } else if (yearDifference <= 5) {
      score += 8;
    }

    // Similar transmission.
    if (
      currentVehicle.transmission &&
      item.transmission &&
      currentVehicle.transmission.toLowerCase() ===
        item.transmission.toLowerCase()
    ) {
      score += 5;
    }

    // Similar fuel type.
    if (
      currentVehicle.fuelType &&
      item.fuelType &&
      currentVehicle.fuelType.toLowerCase() ===
        item.fuelType.toLowerCase()
    ) {
      score += 5;
    }

    return score;
  }

  const similarVehicles = candidates
    .map((item) => ({
      ...item,
      similarityScore: getSimilarityScore(item),
    }))
    .filter((item) => item.similarityScore >= 35)
    .sort((a, b) => {
      if (b.similarityScore !== a.similarityScore) {
        return b.similarityScore - a.similarityScore;
      }

      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }

      return b.createdAt.getTime() - a.createdAt.getTime();
    })
    .slice(0, 4);

  const imageUrls = vehicle.images.length
    ? vehicle.images.map((image) => image.imageUrl)
    : ['/placeholder-car.jpg'];

  const statusBadge =
    vehicle.status === 'available'
      ? 'bg-green-100 text-green-800'
      : vehicle.status === 'reserved'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-gray-100 text-gray-700';

  const specifications = [
    { icon: Calendar, label: 'Year', value: vehicle.year },
    {
      icon: Gauge,
      label: 'Mileage',
      value: vehicle.mileage
        ? `${vehicle.mileage.toLocaleString()} km`
        : '—',
    },
    {
      icon: Car,
      label: 'Engine',
      value: vehicle.engine || '—',
    },
    {
      icon: Settings,
      label: 'Transmission',
      value: vehicle.transmission || '—',
    },
    {
      icon: Car,
      label: 'Drivetrain',
      value: vehicle.drivetrain || '—',
    },
    {
      icon: Fuel,
      label: 'Fuel Type',
      value: vehicle.fuelType || '—',
    },
    {
      icon: Car,
      label: 'Body Type',
      value: vehicle.bodyType || '—',
    },
    {
      icon: Car,
      label: 'Seating Capacity',
      value: vehicle.seats
        ? vehicle.seats === 11
          ? '11+ Seats'
          : `${vehicle.seats} Seats`
        : '—',
    },
    {
      icon: Shield,
      label: 'Condition',
      value: vehicle.condition || '—',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Vehicle in showroom',
    },
  ];

  const whatsappMessage = encodeURIComponent(
    `Hello Daily Bazaar, I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}, listed at ${formatPrice(vehicle.price.toString())}. Please share more details.`
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8 lg:py-8">

        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <Link
            href="/"
            className="transition hover:text-[#b58b00]"
          >
            Home
          </Link>

          <ChevronRight className="h-4 w-4" />

          <Link
            href="/inventory"
            className="transition hover:text-[#b58b00]"
          >
            Inventory
          </Link>

          <ChevronRight className="h-4 w-4" />

          <span className="font-semibold text-gray-900">
            {vehicle.make} {vehicle.model}
          </span>
        </nav>

        {/* Gallery and vehicle information */}
        <div className="grid w-full min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-8">

          {/* Vehicle gallery */}
          <section className="w-full min-w-0 overflow-hidden">
            <VehicleGallery
              images={imageUrls}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            />
          </section>

          {/* Vehicle information */}
          <section className="w-full min-w-0 space-y-5">
            <div className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">

              <div className="min-w-0">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#b58b00]">
                  Daily Bazaar Collection
                </p>

                <h1 className="break-words text-2xl font-extrabold leading-tight text-primary sm:text-3xl">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusBadge}`}
                  >
                    {vehicle.status}
                  </span>

                  {vehicle.condition && (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                      {vehicle.condition}
                    </span>
                  )}

                  {vehicle.featured && (
                    <span className="inline-flex items-center rounded-full bg-[#f0bc00]/20 px-3 py-1 text-xs font-semibold text-amber-900">
                      Featured Vehicle
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="mt-6 border-y border-gray-100 py-5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Asking Price
                </p>

                <p className="mt-1 break-words text-2xl font-extrabold text-primary sm:text-3xl">
                  {formatPrice(vehicle.price.toString())}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Contact us for more information.
                </p>
              </div>

              {/* Quick specifications */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-5 py-5 text-sm sm:gap-x-5">
                <div className="flex min-w-0 items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 shrink-0 text-[#b58b00]" />
                  <span className="truncate">{vehicle.year}</span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-gray-600">
                  <Gauge className="h-4 w-4 shrink-0 text-[#b58b00]" />
                  <span className="truncate">
                    {vehicle.mileage
                      ? `${vehicle.mileage.toLocaleString()} km`
                      : '—'}
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-gray-600">
                  <Settings className="h-4 w-4 shrink-0 text-[#b58b00]" />
                  <span className="truncate">
                    {vehicle.transmission || '—'}
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-gray-600">
                  <Car className="h-4 w-4 shrink-0 text-[#b58b00]" />
                  <span className="truncate">
                    {vehicle.drivetrain || '—'}
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-gray-600">
                  <Car className="h-4 w-4 shrink-0 text-[#b58b00]" />
                  <span className="truncate">
                    {vehicle.seats
                      ? vehicle.seats === 11
                        ? '11+ Seats'
                        : `${vehicle.seats} Seats`
                      : '—'}
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-gray-600">
                  <Fuel className="h-4 w-4 shrink-0 text-[#b58b00]" />
                  <span className="truncate">
                    {vehicle.fuelType || '—'}
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-gray-600">
                  <Car className="h-4 w-4 shrink-0 text-[#b58b00]" />
                  <span className="truncate">
                    {vehicle.engine || '—'}
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 shrink-0 text-[#b58b00]" />
                  <span className="truncate">Showroom</span>
                </div>
              </div>

              {/* WhatsApp enquiry */}
              <a
                href={`https://wa.me/254715455098?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-5 py-3.5 font-bold text-white transition hover:bg-green-600"
              >
                <MessageCircle className="h-5 w-5" />
                Ask about this vehicle on WhatsApp
              </a>
            </div>

            {/* Inquiry form */}
            <div className="w-full min-w-0">
              <InquiryForm
                vehicleId={vehicle.id}
                buttonLabel="Inquire about this car"
              />
            </div>
          </section>
        </div>

        {/* Full vehicle specifications */}
        <section className="mt-8 w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:mt-10 sm:p-6">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[#b58b00]">
              Vehicle details
            </p>

            <h2 className="mt-1 text-xl font-bold text-primary">
              Specifications
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {specifications.map((row) => (
              <div
                key={row.label}
                className="flex min-w-0 items-center justify-between gap-3 border-b border-gray-100 py-3"
              >
                <span className="flex shrink-0 items-center gap-2 text-sm text-gray-500">
                  <row.icon className="h-4 w-4 text-[#b58b00]" />
                  {row.label}
                </span>

                <span className="break-words text-right text-sm font-semibold text-primary">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Description and features */}
        <section className="mt-8 grid min-w-0 grid-cols-1 gap-6">

          <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#b58b00]">
              About this vehicle
            </p>

            <h2 className="mb-3 mt-1 text-xl font-bold text-primary">
              Description
            </h2>

            <p className="break-words text-sm leading-relaxed text-gray-600">
              {vehicle.description ||
                'Contact our team for more information about this vehicle.'}
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#b58b00]">
              Vehicle equipment
            </p>

            <h2 className="mb-3 mt-1 text-xl font-bold text-primary">
              Features
            </h2>

            {vehicle.features.length ? (
              <ul className="grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2">
                {vehicle.features.map((feature) => (
                  <li
                    key={feature.id}
                    className="flex min-w-0 items-start gap-2"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#f0bc00]" />

                    <span className="break-words">
                      {feature.featureName}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                Contact us to confirm the available features.
              </p>
            )}
          </div>
        </section>

        {/* Similar vehicles */}
        {similarVehicles.length > 0 && (
          <section className="mt-14">
            <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b58b00]">
                  Explore more
                </p>

                <h2 className="mt-1 text-2xl font-extrabold text-primary sm:text-3xl">
                  Similar Vehicles
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Vehicles selected based on make, body type, year and price.
                </p>
              </div>

              <Link
                href="/inventory"
                className="inline-flex items-center gap-2 text-sm font-bold text-primary transition hover:text-[#b58b00]"
              >
                View all inventory
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {similarVehicles.map((item) => {
                const itemImage =
                  item.images[0]?.imageUrl || '/placeholder-car.jpg';

                return (
                  <article
                    key={item.id}
                    className="group min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#f0bc00] hover:shadow-lg"
                  >
                    <Link
                      href={`/inventory/${item.slug}`}
                      className="block"
                    >
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <SimilarVehicleImage
                          src={itemImage}
                          alt={`${item.year} ${item.make} ${item.model}`}
                        />

                        {item.featured && (
                          <span className="absolute left-3 top-3 rounded-full bg-[#f0bc00] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-black">
                            Featured
                          </span>
                        )}

                        <span className="absolute bottom-3 left-3 rounded-md bg-black/75 px-2.5 py-1 text-xs font-semibold text-white">
                          {item.year} · {item.make}
                        </span>
                      </div>

                      <div className="p-4">
                        <h3 className="line-clamp-1 text-base font-bold text-primary transition group-hover:text-[#b58b00]">
                          {item.make} {item.model}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {item.mileage
                            ? `${item.mileage.toLocaleString()} km`
                            : 'Mileage not specified'}
                        </p>

                        <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-4">
                          <span className="text-base font-extrabold text-primary">
                            {formatPrice(item.price.toString())}
                          </span>

                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f0bc00]/20 text-primary transition group-hover:bg-[#f0bc00]">
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* Final enquiry banner */}
        <section className="mt-14 overflow-hidden rounded-2xl bg-[#0b0b0b] px-5 py-9 text-center shadow-lg sm:px-10 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f0bc00]">
            Daily Bazaar
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl text-2xl font-extrabold text-white sm:text-3xl">
            Ready to make this vehicle yours?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-300">
            Talk to our team about availability, viewing arrangements and the next steps towards owning your vehicle.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={`https://wa.me/254715455098?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-bold text-white transition hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </a>

            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-bold text-white transition hover:border-[#f0bc00] hover:bg-[#f0bc00] hover:text-black"
            >
              Contact Daily Bazaar
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Bottom navigation */}
        <div className="mt-8 pb-4 text-center">
          <Link
            href="/inventory"
            className="text-sm font-semibold text-primary underline decoration-[#f0bc00] decoration-2 underline-offset-4 transition hover:text-[#b58b00]"
          >
            ← Back to all vehicles
          </Link>
        </div>

      </div>
    </main>
  );
}
