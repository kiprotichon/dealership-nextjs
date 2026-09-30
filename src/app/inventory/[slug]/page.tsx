import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import VehicleGallery from '@/components/VehicleGallery';
import InquiryForm from '@/components/InquiryForm';
import FinancingCalculator from '@/components/FinancingCalculator';
import {
  Calendar, Gauge, Fuel, Settings, MapPin, Car, Shield, Building2, Truck
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatPrice(price: number | string) {
  return 'KSh ' + Number(price).toLocaleString();
}

export default async function VehicleDetailPage({ params }: { params: { slug: string } }) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { slug: params.slug },
    include: { images: true, features: true }
  });

  if (!vehicle) notFound();

  const imageUrls = vehicle.images.length
    ? vehicle.images.map(i => i.imageUrl)
    : ['/placeholder-car.jpg'];

  const statusBadge =
    vehicle.status === 'available'
      ? 'bg-green-100 text-green-800'
      : vehicle.status === 'reserved'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-gray-100 text-gray-700';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Gallery + Title row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* Left – Gallery */}
          <div>
            <VehicleGallery images={imageUrls} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
          </div>

          {/* Right – Key info */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h1>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusBadge}`}>
                      {vehicle.status}
                    </span>
                    {vehicle.condition && (
                      <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-800 px-3 py-1 text-xs font-semibold">
                        {vehicle.condition}
                      </span>
                    )}
                    <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-800 px-3 py-1 text-xs font-semibold">
                      VEHICLE IN SHOWROOM
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-primary">{formatPrice(vehicle.price.toString())}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Contact for negotiation</p>
                </div>
              </div>

              {/* Quick specs row */}
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span>{vehicle.year}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Gauge className="h-4 w-4 text-accent" />
                  <span>{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Settings className="h-4 w-4 text-accent" />
                  <span>{vehicle.transmission || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Fuel className="h-4 w-4 text-accent" />
                  <span>{vehicle.fuelType || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Car className="h-4 w-4 text-accent" />
                  <span>{vehicle.engine || '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-accent" />
                  <span>Showroom</span>
                </div>
              </div>

              <a
                href={`https://wa.me/254715455098?text=I'm%20interested%20in%20the%20${vehicle.year}%20${vehicle.make}%20${vehicle.model}`}
                target="_blank"
                rel="noreferrer"
                className="btn w-full text-center block mt-6"
              >
                Ask on WhatsApp
              </a>
            </div>

            {/* Inquiry – button that opens modal form */}
            <InquiryForm vehicleId={vehicle.id} buttonLabel="Inquire about this car" />

            {/* Financing calculator – pre-filled with this vehicle’s price */}
            <FinancingCalculator defaultPrice={Number(vehicle.price)} />
          </div>
        </div>

        {/* Vehicle Specifications card */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-primary mb-5">Vehicle Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-0">
            {[
              { icon: Calendar, label: 'Year', value: vehicle.year },
              { icon: Gauge, label: 'Mileage', value: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : '—' },
              { icon: Car, label: 'Engine', value: vehicle.engine || '—' },
              { icon: Settings, label: 'Transmission', value: vehicle.transmission || '—' },
              { icon: Fuel, label: 'Fuel Type', value: vehicle.fuelType || '—' },
              { icon: Car, label: 'Drive', value: vehicle.bodyType || '—' },
              { icon: Shield, label: 'Condition', value: vehicle.condition || '—' },
              { icon: MapPin, label: 'Location', value: 'VEHICLE IN SHOWROOM' }
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <span className="flex items-center gap-2 text-gray-500 text-sm">
                  <row.icon className="h-4 w-4 text-accent" />
                  {row.label}
                </span>
                <span className="font-medium text-sm text-primary">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description & Features */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-3">Description</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {vehicle.description || 'No description provided.'}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-lg mb-3">Features</h3>
            {vehicle.features.length ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                {vehicle.features.map(f => (
                  <li key={f.id} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {f.featureName}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">None listed</p>
            )}
          </div>
        </div>

        {/* Why buy with us */}
        <section className="mt-14">
          <h2 className="text-2xl font-bold text-primary text-center mb-8">
            Why Buy Vehicles for Sale in Kenya With Us
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Shield,
                title: 'Verified Stock',
                desc: 'Every car for sale in Kenya on our platform is inspected and listed with accurate mileage, condition and import history with no surprises.'
              },
              {
                icon: Building2,
                title: 'Flexible Financing',
                desc: 'We work with leading banks so you can finance your next vehicle with terms that fit your budget, up to 100% financing available.'
              },
              {
                icon: Truck,
                title: 'Nationwide Delivery',
                desc: 'Buy from anywhere in the country and we will deliver used and new cars for sale in Kenya right to your doorstep.'
              }
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Simple FAQ */}
        <section className="mt-14 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-primary text-center mb-6">Common Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'How do I buy a car in Kenya through Daily Bazaar?',
                a: 'Browse inventory, contact us via WhatsApp or the inquiry form, arrange a viewing, and complete the purchase with transparent paperwork.'
              },
              {
                q: 'Do you sell both new and used cars for sale in Kenya?',
                a: 'Yes. We list Foreign Used, Locally Used and Brand New vehicles depending on current stock.'
              },
              {
                q: 'What makes Daily Bazaar one of the top car dealers in Kenya?',
                a: 'Inspected stock, honest pricing, flexible financing options and friendly local support in Nairobi.'
              }
            ].map((item, i) => (
              <details key={i} className="group bg-white rounded-xl border border-gray-200">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 font-medium text-primary list-none">
                  {item.q}
                  <span className="text-accent text-xl group-open:rotate-45 transition">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-600">{item.a}</div>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-10 text-center">
          <Link href="/inventory" className="text-sm font-semibold text-primary underline decoration-accent decoration-2 underline-offset-4">
            ← Back to inventory
          </Link>
        </div>
      </div>
    </main>
  );
}
