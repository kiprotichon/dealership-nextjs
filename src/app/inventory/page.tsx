
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
    status = 'available',
    sort = 'newest',
  } = searchParams;

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

  // Get total matching vehicles
  const totalVehicles = await prisma.vehicle.count({
    where,
  });

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
    maxPrice ||
    fuelType ||
    transmission ||
    condition ||
    status !== 'available'
  );

  const heading = make
    ? `${make} ${model || ''}`.trim()
    : 'Our inventory';

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page heading */}
        <div className="mb-7">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-yellow-600">
            Daily Bazaar
          </p>

          <h1 className="text-2xl font-bold text-primary sm:text-3xl">
            {heading}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Browse our available vehicles and find the right one for you.
          </p>
        </div>

        {/* Search and filters layout */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[250px_minmax(0,1fr)]">

          {/* Left filter sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <InventoryFilters>{null}</InventoryFilters>
          </aside>

          {/* Vehicle results */}
          <section className="min-w-0">

            {/* Results toolbar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">

              <div>
                <p className="font-semibold text-primary">
                  {totalVehicles}{' '}
                  {totalVehicles === 1 ? 'vehicle' : 'vehicles'} found
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {totalVehicles > 0
                    ? `Showing ${
                        (safePage - 1) * PAGE_SIZE + 1
                      }–${Math.min(
                        safePage * PAGE_SIZE,
                        totalVehicles
                      )} of ${totalVehicles}`
                    : 'Try adjusting your filters'}
                </p>
              </div>

              {/* Sorting */}
              <form
                action="/inventory"
                method="GET"
                className="flex items-center gap-2"
              >
                {Object.entries(searchParams).map(([key, value]) => {
                  if (!value || key === 'sort' || key === 'page') {
                    return null;
                  }

                  return (
                    <input
                      key={key}
                      type="hidden"
                      name={key}
                      value={value}
                    />
                  );
                })}

                <label
                  htmlFor="inventory-sort"
                  className="hidden text-sm text-gray-500 sm:block"
                >
                  Sort:
                </label>

                <select
                  id="inventory-sort"
                  name="sort"
                  defaultValue={sort}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-primary outline-none focus:border-yellow-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="year">Year: Newest</option>
                </select>

                <button
                  type="submit"
                  className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Apply
                </button>
              </form>
            </div>

            {/* Vehicle cards */}
            {vehicles.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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

                <p className="mt-2 text-sm text-gray-500">
                  We couldn't find vehicles matching your search.
                  Try changing or clearing your filters.
                </p>

                <Link
                  href="/inventory"
                  className="mt-5 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Clear all filters
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-6">

                <p className="text-sm text-gray-500">
                  Page {safePage} of {totalPages}
                </p>

                <div className="flex items-center gap-2">
                  {safePage > 1 && (
                    <Link
                      href={buildPageUrl(searchParams, safePage - 1)}
                      className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-primary transition hover:border-yellow-500"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </Link>
                  )}

                  {safePage < totalPages && (
                    <Link
                      href={buildPageUrl(searchParams, safePage + 1)}
                      className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                    >
                      Next
                      <ChevronRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Clear filters */}
            {filtered && (
              <div className="mt-6 text-center">
                <Link
                  href="/inventory"
                  className="text-sm font-semibold text-primary underline decoration-yellow-500 decoration-2 underline-offset-4 hover:text-yellow-600"
                >
                  Clear all filters
                </Link>
              </div>
            )}

          </section>
        </div>
      </div>
    </main>
  );
}
