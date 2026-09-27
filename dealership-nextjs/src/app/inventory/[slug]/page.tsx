import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import VehicleGallery from '@/components/VehicleGallery';
import InquiryForm from '@/components/InquiryForm';

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

  const imageUrls = vehicle.images.length ? vehicle.images.map(i => i.imageUrl) : ['/placeholder-car.jpg'];

  return (
    <main className="py-12 px-[5%]">
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10">
        <div>
          <VehicleGallery images={imageUrls} alt={`${vehicle.make} ${vehicle.model}`} />

          <h3 className="text-lg font-semibold mt-6 mb-2">Description</h3>
          <p className="text-gray-600">{vehicle.description || 'No description provided.'}</p>

          <h3 className="text-lg font-semibold mt-6 mb-2">Features</h3>
          <ul className="list-disc pl-5 text-gray-600">
            {vehicle.features.length
              ? vehicle.features.map(f => <li key={f.id}>{f.featureName}</li>)
              : <li>None listed</li>}
          </ul>
        </div>

        <div>
          <h1 className="text-2xl font-bold">{vehicle.year} {vehicle.make} {vehicle.model}</h1>
          <div className="text-accent font-bold text-2xl my-2">{formatPrice(vehicle.price.toString())}</div>

          <ul className="mb-4">
            {[
              ['Mileage', vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : '—'],
              ['Transmission', vehicle.transmission || '—'],
              ['Fuel Type', vehicle.fuelType || '—'],
              ['Body Type', vehicle.bodyType || '—'],
              ['Engine', vehicle.engine || '—'],
              ['Condition', vehicle.condition || '—']
            ].map(([label, value]) => (
              <li key={label} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">{label}</span><span className="font-medium">{value}</span>
              </li>
            ))}
          </ul>

          <a
            href={`https://wa.me/254700000000?text=I'm%20interested%20in%20the%20${vehicle.year}%20${vehicle.make}%20${vehicle.model}`}
            target="_blank"
            rel="noreferrer"
            className="btn w-full text-center block mb-3"
          >
            Ask on WhatsApp
          </a>

          <InquiryForm vehicleId={vehicle.id} />
        </div>
      </div>
    </main>
  );
}
