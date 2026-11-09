
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import VehicleGallery from '@/components/VehicleGallery';
import InquiryForm from '@/components/InquiryForm';
import {
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  Car,
  Shield,
  Building2,
  Truck,
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
    { icon: Car, label: 'Engine', value: vehicle.engine || '—' },
    {
      icon: Settings,
      label: 'Transmission',
      value: vehicle.transmission || '—',
    },
    {
      icon: Fuel,
      label: 'Fuel Type',
      value: vehicle.fuelType || '—',
    },
    { icon: Car, label: 'Drive', value: vehicle.bodyType || '—' },
    {
      icon: Shield,
      label: 'Condition',
      value: vehicle.condition || '—',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'VEHICLE IN SHOWROOM',
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Verified Stock',
      desc: 'Every car for sale in Kenya on our platform is inspected and listed with accurate mileage, condition and import history with no surprises.',
    },
    {
      icon: Building2,
      title: 'Flexible Financing',
      desc: 'We work with leading banks so you can finance your next vehicle with terms that fit your budget, up to 100% financing available.',
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      desc: 'Buy from anywhere in the country and we will deliver used and new cars for sale in Kenya right to your doorstep.',
    },
  ];

  const faqs = [
    {
      q: 'How do I buy a car in Kenya through Daily Bazaar?',
      a: 'Browse inventory, contact us via WhatsApp or the inquiry form, arrange a viewing, and complete the purchase with transparent paperwork.',
    },
    {
      q: 'Do you sell both new and used cars for sale in Kenya?',
      a: 'Yes. We list Foreign Used, Locally Used and Brand New vehicles depending on current stock.',
    },
    {
      q: 'What makes Daily Bazaar one of the top car dealers in Kenya?',
      a: 'Inspected stock, honest pricing, flexible financing options and friendly local support in Nairobi.',
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        {/* Gallery and vehicle information */}
        <div className="grid w-full min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-8">

          {/* Left: Vehicle gallery */}
          <section className="w-full min-w-0 overflow-hidden">
            <VehicleGallery
              images={imageUrls}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            />
          </section>

          {/* Right: Vehicle information */}
          <section className="w-full min-w-0 space-y-5">

            {/* Main vehicle card */}
            <div className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">

              <div className="min-w-0">
                <h1 className="break-words text-2xl font-bold leading-tight text-primary sm:text-3xl">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>

                {/* Status badges */}
                <div className="mt-3 flex flex-wrap gap-2">
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

                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
                    VEHICLE IN SHOWROOM
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mt-6 border-y border-gray-100 py-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Asking Price
                </p>

                <p className="mt-1 break-words text-2xl font-extrabold text-primary sm:text-3xl">
                  {formatPrice(vehicle.price.toString())}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Contact for negotiation
                </p>
              </div>

              {/* Quick specifications */}
              <div className="grid grid-cols-2 gap-x-3 gap-y-5 py-5 text-sm sm:gap-x-5">

                <div className="flex min-w-0 items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate">{vehicle.year}</span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-gray-600">
                  <Gauge className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate">
                    {vehicle.mileage
                      ? `${vehicle.mileage.toLocaleString()} km`
                      : '—'}
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-gray-600">
                  <Settings className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate">
                    {vehicle.transmission || '—'}
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-gray-600">
                  <Fuel className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate">
                    {vehicle.fuelType || '—'}
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-gray-600">
                  <Car className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate">
                    {vehicle.engine || '—'}
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 shrink-0 text-accent" />
                  <span className="truncate">Showroom</span>
                </div>

              </div>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/254715455098?text=${encodeURIComponent(
                  `I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn mt-2 block w-full text-center"
              >
                Ask on WhatsApp
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
          <h2 className="mb-5 text-lg font-bold text-primary">
            Vehicle Specifications
          </h2>

          <div className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {specifications.map((row) => (
              <div
                key={row.label}
                className="flex min-w-0 items-center justify-between gap-3 border-b border-gray-100 py-3"
              >
                <span className="flex shrink-0 items-center gap-2 text-sm text-gray-500">
                  <row.icon className="h-4 w-4 text-accent" />
                  {row.label}
                </span>

                <span className="break-words text-right text-sm font-medium text-primary">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Description and features */}
        <section className="mt-8 grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2">

          <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="mb-3 text-lg font-semibold text-primary">
              Description
            </h3>

            <p className="break-words text-sm leading-relaxed text-gray-600">
              {vehicle.description || 'No description provided.'}
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="mb-3 text-lg font-semibold text-primary">
              Features
            </h3>

            {vehicle.features.length ? (
              <ul className="grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
                {vehicle.features.map((feature) => (
                  <li
                    key={feature.id}
                    className="flex min-w-0 items-start gap-2"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="break-words">
                      {feature.featureName}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">None listed</p>
            )}
          </div>

        </section>

        {/* Why buy with Daily Bazaar */}
        <section className="mt-14">
          <h2 className="mb-8 text-center text-2xl font-bold text-primary">
            Why Buy Vehicles for Sale in Kenya With Us
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
                  <item.icon className="h-6 w-6" />
                </div>

                <h3 className="mb-2 font-bold text-primary">
                  {item.title}
                </h3>

                <p className="text-sm leading-relaxed text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Frequently asked questions */}
        <section className="mx-auto mt-14 max-w-3xl">
          <h2 className="mb-6 text-center text-2xl font-bold text-primary">
            Common Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((item, index) => (
              <details
                key={index}
                className="group rounded-xl border border-gray-200 bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium text-primary">
                  <span>{item.q}</span>
                  <span className="shrink-0 text-xl text-accent transition group-open:rotate-45">
                    +
                  </span>
                </summary>

                <div className="px-5 pb-4 text-sm leading-relaxed text-gray-600">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Back to inventory */}
        <div className="mt-10 text-center">
          <Link
            href="/inventory"
            className="text-sm font-semibold text-primary underline decoration-accent decoration-2 underline-offset-4"
          >
            ← Back to inventory
          </Link>
        </div>

      </div>
    </main>
  );
}
