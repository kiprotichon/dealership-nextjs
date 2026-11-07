import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import VehicleCard from '@/components/VehicleCard';
import InventoryFilters from '@/components/InventoryFilters';

export const dynamic = 'force-dynamic';

const SORT_MAP: Record<string, any> = {
  newest: { createdAt: 'desc' },
  price_low: { price: 'asc' },
  price_high: { price: 'desc' },
  year: { year: 'desc' },
};

const BRAND_ALIASES: Record<string, string[]> = {
  mercedes: ['Mercedes', 'Mercedes-Benz'],
  volkswagen: ['Volkswagen', 'VW'],
  mini: ['Mini', 'Mini Cooper'],
};

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    make?: string;
    model?: string;
    year?: string;
    minYear?: string;
    maxYear?: string;
    minPrice?: string;
    maxPrice?: string;
    status?: string;
    sort?: string;
  };
}) {
  const {
    q,
    make,
    model,
    year,
    minYear,
    maxYear,
    minPrice,
    maxPrice,
    status = 'available',
    sort = 'newest',
  } = searchParams;

  const conditions: any[] = [];

  if (status !== 'any') {
    conditions.push({ status });
  }

  if (make) {
    const normalizedMake = make.toLowerCase().replace(/[^a-z0-9]/g, '');
    const aliases = BRAND_ALIASES[normalizedMake];

    if (aliases) {
      conditions.push({
        OR: aliases.map((brand) => ({
          make: {
            equals: brand,
            mode: 'insensitive',
          },
        })),
      });
    } else {
      conditions.push({
        make: {
          equals: make,
          mode: 'insensitive',
        },
      });
    }
  }

  if (model) {
    conditions.push({
      model: {
        equals: model,
        mode: 'insensitive',
      },
    });
  }

  if (year && !isNaN(Number(year))) {
    conditions.push({ year: Number(year) });
  }

  if (minYear || maxYear) {
    conditions.push({
      year: {
        ...(minYear && !isNaN(Number(minYear))
          ? { gte: Number(minYear) }
          : {}),
        ...(maxYear && !isNaN(Number(maxYear))
          ? { lte: Number(maxYear) }
          : {}),
      },
    });
  }

  if (minPrice || maxPrice) {
    conditions.push({
      price: {
        ...(minPrice && !isNaN(Number(minPrice))
          ? { gte: Number(minPrice) }
          : {}),
        ...(maxPrice && !isNaN(Number(maxPrice))
          ? { lte: Number(maxPrice) }
          : {}),
      },
    });
  }

  if (q) {
    conditions.push({
      OR: ['make', 'model', 'description'].map((field) => ({
        [field]: {
          contains: q,
          mode: 'insensitive',
        },
      })),
    });
  }

  const where = conditions.length ? { AND: conditions } : {};

  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: SORT_MAP[sort] || SORT_MAP.newest,
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
  });

  const filtered = Boolean(
    q ||
    make ||
    model ||
    year ||
    minYear ||
    maxYear ||
    minPrice ||
    maxPrice
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">
            {make ? `${make} ${model || ''}`.trim() : 'Our inventory'}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            {vehicles.length}{' '}
            {vehicles.length === 1 ? 'vehicle' : 'vehicles'} found
          </p>
        </div>

        {filtered && (
          <Link
            href="/inventory"
            className="text-sm font-semibold text-primary underline decoration-accent decoration-2 underline-offset-4"
          >
            Clear filters
          </Link>
        )}
      </div>

      <InventoryFilters />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.length ? (
          vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.slug} v={vehicle as any} />
          ))
        ) : (
          <p className="text-gray-500">
            No vehicles match your search.
          </p>
        )}
      </div>
    </main>
  );
}