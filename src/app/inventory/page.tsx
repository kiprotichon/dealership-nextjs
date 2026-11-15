import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import VehicleCard from '@/components/VehicleCard';
import InventoryFilters from '@/components/InventoryFilters';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 9;

const SORT_MAP: Record<string, any> = {
  newest: { createdAt: 'desc' },
  price_low: { price: 'asc' },
  price_high: { price: 'desc' },
  year: { year: 'desc' },
};

const VALID_STATUSES = ['available', 'reserved', 'sold', 'any'];

const BRAND_ALIASES: Record<string, string[]> = {
  mercedes: ['Mercedes', 'Mercedes-Benz'],
  volkswagen: ['Volkswagen', 'VW'],
  mini: ['Mini', 'Mini Cooper'],
};

type InventorySearchParams = {
  q?: string;
  make?: string;
  model?: string;
  year?: string;
  minYear?: string;
  maxYear?: string;
  minPrice?: string;
  maxPrice?: string;
  fuelType?: string;
  transmission?: string;
  condition?: string;
  status?: string;
  sort?: string;
  page?: string;
};

function validNumber(value?: string) {
  if (!value) return undefined;

  const number = Number(value);

  return Number.isFinite(number) ? number : undefined;
}

function buildPageUrl(
  params: InventorySearchParams,
  page: number
) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value && key !== 'page') {
      query.set(key, value);
    }
  });

  if (page > 1) {
    query.set('page', String(page));
  }

  const queryString = query.toString();

  return queryString
    ? `/inventory?${queryString}`
    : '/inventory';
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: InventorySearchParams;
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
    fuelType,
    transmission,
    condition,
    sort = 'newest',
  } = searchParams;

  // Only accept known statuses so a bad URL can never break the query
  const status = VALID_STATUSES.includes(searchParams.status ?? '')
    ? (searchParams.status as string)
    : 'available';

  const currentPage = Math.max(
    1,
    validNumber(searchParams.page) || 1
  );

  const conditions: any[] = [];

  // Vehicle availability
  if (status !== 'any') {
    conditions.push({ status });
  }

  // Make / brand filter
  if (make) {
    const normalizedMake = make
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

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

  // Model filter
  if (model) {
    conditions.push({
      model: {
        contains: model,
        mode: 'insensitive',
      },
    });
  }

  // Exact year
  if (year && validNumber(year)) {
    conditions.push({
      year: Number(year),
    });
  }

  // Year range
  const minimumYear = validNumber(minYear);
  const maximumYear = validNumber(maxYear);

  if (minimumYear !== undefined || maximumYear !== undefined) {
    conditions.push({
      year: {
        ...(minimumYear !== undefined
          ? { gte: minimumYear }
          : {}),
        ...(maximumYear !== undefined
          ? { lte: maximumYear }
          : {}),
      },
    });
  }

  // Price range
  const minimumPrice = validNumber(minPrice);
  const maximumPrice = validNumber(maxPrice);

  if (minimumPrice !== undefined || maximumPrice !== undefined) {
    conditions.push({
      price: {
        ...(minimumPrice !== undefined
          ? { gte: minimumPrice }
          : {}),
        ...(maximumPrice !== undefined
          ? { lte: maximumPrice }
          : {}),
      },
    });
  }

  // Fuel type
  if (fuelType) {
    conditions.push({
      fuelType: {
        equals: fuelType,
        mode: 'insensitive',
      },
    });
  }

  // Transmission
  if (transmission) {
    conditions.push({
      transmission: {
        equals: transmission,
        mode: 'insensitive',
      },
    });
  }

  // Condition
  if (condition) {
    conditions.push({
      condition: {
        equals: condition,
        mode: 'insensitive',
      },
    });
  }

  // General search
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

  const where = conditions.length
    ? { AND: conditions }
    : {};

  // Total matching vehicles + makes currently in stock (for filter suggestions)
  const [totalVehicles, makeRows] = await Promise.all([
    prisma.vehicle.count({ where }),
    prisma.vehicle.findMany({
      where: { status: 'available' },
      distinct: ['make'],
      select: { make: true },
      orderBy: { make: 'asc' },
    }),
  ]);

  const makes = makeRows.map((row) => row.make).filter(Boolean);

  const totalPages = Math.ceil(totalVehicles / PAGE_SIZE);
  const safePage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  // Fetch vehicles for current page
  const vehicles = await prisma.vehicle.findMany({
    where,
    orderBy: SORT_MAP[sort] || SORT_MAP.newest,
    skip: (safePage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      // Prefer the primary photo, but fall back to any photo so a car
      // without a flagged primary image still shows a picture
      images: {
        orderBy: { isPrimary: 'desc' },
        take: 1,
      },
    },
  });

  const rangeStart = (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, totalVehicles);

  const heading = make
    ? `${make} ${model || ''}`.trim()
    : 'Our inventory';

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

        {/* Page heading */}
        <div className="mb-5 sm:mb-7">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-yellow-700">
            Daily Bazaar
          </p>

          <h1 className="text-2xl font-bold text-primary sm:text-3xl">
            {heading}
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Browse our available vehicles and find the right one for you.
          </p>
        </div>

        {/* InventoryFilters renders the search bar, the filter sidebar / mobile
            drawer, the sort dropdown AND the results below (as children). */}
        <InventoryFilters makes={makes}>
          {/* Results summary */}
          <p className="mb-4 text-sm text-gray-600">
            <span className="font-semibold text-primary">
              {totalVehicles}{' '}
              {totalVehicles === 1 ? 'vehicle' : 'vehicles'} found
            </span>
            {totalPages > 1 && (
              <span className="ml-2 text-xs text-gray-500">
                Showing {rangeStart}–{rangeEnd}
              </span>
            )}
          </p>

          {/* Vehicle cards */}
          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
              {vehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.slug}
                  v={vehicle as any}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
              <h2 className="text-lg font-bold text-primary">
                No vehicles found
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                We could not find any vehicles matching your search.
                Try changing or clearing your filters.
              </p>

              <Link
                href="/inventory"
                className="mt-5 inline-flex min-h-[44px] items-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Clear all filters
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600">
                Page {safePage} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                {safePage > 1 && (
                  <Link
                    href={buildPageUrl(searchParams, safePage - 1)}
                    className="flex min-h-[44px] items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-yellow-500"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Link>
                )}

                {safePage < totalPages && (
                  <Link
                    href={buildPageUrl(searchParams, safePage + 1)}
                    className="flex min-h-[44px] items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Next
                    <ChevronRight size={16} />
                  </Link>
                )}
              </div>
            </div>
          )}
        </InventoryFilters>
      </div>
    </main>
  );
}