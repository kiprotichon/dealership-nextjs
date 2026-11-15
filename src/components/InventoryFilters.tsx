'use client';

import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  ArrowUpDown,
} from 'lucide-react';

// Price steps shown in the Min / Max dropdowns (KSh)
const PRICE_STEPS = [
  500_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000, 4_000_000, 5_000_000,
  7_500_000, 10_000_000, 15_000_000, 20_000_000,
];

// Oldest model year offered in the Year dropdowns
const FIRST_YEAR = 1995;

function formatKsh(value: string | number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Make sure a value that came from the URL is always present in a dropdown,
// even if it is not one of the preset steps.
function withSelected(options: number[], selected: string) {
  const n = Number(selected);
  if (!selected || !Number.isFinite(n) || options.includes(n)) return options;
  return [...options, n].sort((a, b) => a - b);
}

export default function InventoryFilters({
  children,
  makes,
}: {
  children: ReactNode;
  /** Optional: pass the makes you actually have in stock to power suggestions */
  makes?: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [error, setError] = useState('');

  const current = {
    q: searchParams.get('q') || '',
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    fuelType: searchParams.get('fuelType') || '',
    transmission: searchParams.get('transmission') || '',
    condition: searchParams.get('condition') || '',
    status: searchParams.get('status') || 'available',
    sort: searchParams.get('sort') || 'newest',
  };

  // text-base on mobile stops iOS Safari from zooming the page when a field is focused
  const fieldClass =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base text-gray-800 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 sm:text-sm';

  const labelClass =
    'mb-2 block text-xs font-bold uppercase tracking-wide text-gray-600';

  // ---------- Year options (newest first) ----------
  const nextYear = new Date().getFullYear() + 1;
  const baseYears = Array.from(
    { length: nextYear - FIRST_YEAR + 1 },
    (_, i) => nextYear - i
  );
  const yearOptions = (selected: string) => {
    const n = Number(selected);
    if (!selected || !Number.isFinite(n) || baseYears.includes(n)) {
      return baseYears;
    }
    return [...baseYears, n].sort((a, b) => b - a);
  };

  // ---------- Active filters (chips + count) ----------
  const activeFilters: { label: string; keys: string[] }[] = [];

  if (current.make) {
    activeFilters.push({ label: `Make: ${current.make}`, keys: ['make'] });
  }
  if (current.model) {
    activeFilters.push({ label: `Model: ${current.model}`, keys: ['model'] });
  }
  if (current.minPrice || current.maxPrice) {
    const label =
      current.minPrice && current.maxPrice
        ? `KSh ${formatKsh(current.minPrice)} - ${formatKsh(current.maxPrice)}`
        : current.minPrice
        ? `From KSh ${formatKsh(current.minPrice)}`
        : `Up to KSh ${formatKsh(current.maxPrice)}`;
    activeFilters.push({ label, keys: ['minPrice', 'maxPrice'] });
  }
  if (current.minYear || current.maxYear) {
    const label =
      current.minYear && current.maxYear
        ? `${current.minYear} - ${current.maxYear}`
        : current.minYear
        ? `From ${current.minYear}`
        : `Up to ${current.maxYear}`;
    activeFilters.push({ label, keys: ['minYear', 'maxYear'] });
  }
  if (current.fuelType) {
    activeFilters.push({ label: current.fuelType, keys: ['fuelType'] });
  }
  if (current.transmission) {
    activeFilters.push({ label: current.transmission, keys: ['transmission'] });
  }
  if (current.condition) {
    activeFilters.push({ label: current.condition, keys: ['condition'] });
  }
  if (current.status !== 'available') {
    activeFilters.push({
      label: current.status === 'any' ? 'All vehicles' : capitalize(current.status),
      keys: ['status'],
    });
  }

  // ---------- Drawer behaviour: lock page scroll + close on Escape ----------
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  // ---------- Actions ----------
  function updateSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams(searchParams.toString());
    const value = String(formData.get('q') || '').trim();

    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }

    params.delete('page');
    router.push(`/inventory?${params.toString()}`);
  }

  function applyFilters(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Validate ranges before searching
    const minPrice = Number(formData.get('minPrice') || 0);
    const maxPrice = Number(formData.get('maxPrice') || 0);
    const minYear = Number(formData.get('minYear') || 0);
    const maxYear = Number(formData.get('maxYear') || 0);

    if (minPrice && maxPrice && minPrice > maxPrice) {
      setError('Minimum price must not be higher than maximum price.');
      return;
    }
    if (minYear && maxYear && minYear > maxYear) {
      setError('The "From" year must not be later than the "To" year.');
      return;
    }

    setError('');

    const params = new URLSearchParams();

    // Preserve the current search and sorting
    if (current.q) params.set('q', current.q);
    if (current.sort) params.set('sort', current.sort);

    formData.forEach((value, key) => {
      const cleanValue = String(value).trim();

      if (cleanValue) {
        params.set(key, cleanValue);
      }
    });

    params.delete('page');

    router.push(`/inventory?${params.toString()}`);
    setMobileOpen(false);
  }

  function clearFilters() {
    setError('');
    router.push('/inventory');
    setMobileOpen(false);
  }

  function removeFilter(keys: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    keys.forEach((key) => params.delete(key));
    params.delete('page');
    router.push(`/inventory?${params.toString()}`);
  }

  function updateSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set('sort', value);
    params.delete('page');

    router.push(`/inventory?${params.toString()}`);
  }

  // ---------- Filter form (rendered once for desktop, once for the mobile drawer) ----------
  function renderForm(idPrefix: 'desktop' | 'mobile') {
    const id = (name: string) => `${idPrefix}-${name}`;
    const inlineActions = idPrefix === 'desktop';

    return (
      <form
        // remount when the URL changes so the fields always match the active filters
        key={searchParams.toString()}
        id={id('filters')}
        onSubmit={applyFilters}
        onChange={() => error && setError('')}
        className="space-y-5"
      >
        {/* Make and model */}
        <div>
          <label htmlFor={id('make')} className={labelClass}>
            Vehicle make
          </label>
          <input
            id={id('make')}
            name="make"
            defaultValue={current.make}
            placeholder="e.g. Toyota"
            autoComplete="off"
            list={makes?.length ? id('makes') : undefined}
            className={fieldClass}
          />
          {makes?.length ? (
            <datalist id={id('makes')}>
              {makes.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          ) : null}
        </div>

        <div>
          <label htmlFor={id('model')} className={labelClass}>
            Model
          </label>
          <input
            id={id('model')}
            name="model"
            defaultValue={current.model}
            placeholder="e.g. Land Cruiser"
            autoComplete="off"
            className={fieldClass}
          />
        </div>

        {/* Price */}
        <div>
          <span className={labelClass}>Price range (KSh)</span>
          <div className="grid grid-cols-2 gap-2">
            <select
              aria-label="Minimum price"
              name="minPrice"
              defaultValue={current.minPrice}
              className={fieldClass}
            >
              <option value="">No minimum</option>
              {withSelected(PRICE_STEPS, current.minPrice).map((p) => (
                <option key={p} value={p}>
                  {formatKsh(p)}
                </option>
              ))}
            </select>
            <select
              aria-label="Maximum price"
              name="maxPrice"
              defaultValue={current.maxPrice}
              className={fieldClass}
            >
              <option value="">No maximum</option>
              {withSelected(PRICE_STEPS, current.maxPrice).map((p) => (
                <option key={p} value={p}>
                  {formatKsh(p)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Year */}
        <div>
          <span className={labelClass}>Manufacturing year</span>
          <div className="grid grid-cols-2 gap-2">
            <select
              aria-label="From year"
              name="minYear"
              defaultValue={current.minYear}
              className={fieldClass}
            >
              <option value="">From</option>
              {yearOptions(current.minYear).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <select
              aria-label="To year"
              name="maxYear"
              defaultValue={current.maxYear}
              className={fieldClass}
            >
              <option value="">To</option>
              {yearOptions(current.maxYear).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fuel */}
        <div>
          <label htmlFor={id('fuel')} className={labelClass}>
            Fuel type
          </label>
          <select
            id={id('fuel')}
            name="fuelType"
            defaultValue={current.fuelType}
            className={fieldClass}
          >
            <option value="">All fuel types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        {/* Transmission */}
        <div>
          <label htmlFor={id('transmission')} className={labelClass}>
            Transmission
          </label>
          <select
            id={id('transmission')}
            name="transmission"
            defaultValue={current.transmission}
            className={fieldClass}
          >
            <option value="">All transmissions</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        {/* Condition */}
        <div>
          <label htmlFor={id('condition')} className={labelClass}>
            Condition
          </label>
          <select
            id={id('condition')}
            name="condition"
            defaultValue={current.condition}
            className={fieldClass}
          >
            <option value="">All conditions</option>
            <option value="Foreign Used">Foreign Used</option>
            <option value="Locally Used">Locally Used</option>
            <option value="Brand New">Brand New</option>
          </select>
        </div>

        {/* Availability */}
        <div>
          <label htmlFor={id('status')} className={labelClass}>
            Availability
          </label>
          <select
            id={id('status')}
            name="status"
            defaultValue={current.status}
            className={fieldClass}
          >
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="any">All vehicles</option>
          </select>
        </div>

        {/* Desktop: buttons sit in the form. Mobile: they live in the sticky footer. */}
        {inlineActions && (
          <>
            {error && (
              <p role="alert" className="text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-yellow-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-yellow-500"
            >
              Apply Filters
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
              Clear all filters
            </button>
          </>
        )}
      </form>
    );
  }

  return (
    <>
      {/* Compact search bar */}
      <form
        key={`search-${current.q}`}
        onSubmit={updateSearch}
        className="mb-4 flex gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm"
      >
        <div className="flex flex-1 items-center gap-3 px-2">
          <Search className="h-5 w-5 shrink-0 text-gray-400" />

          <input
            name="q"
            type="search"
            defaultValue={current.q}
            placeholder="Search by make, model or keyword..."
            className="w-full bg-transparent py-2 text-base text-gray-800 outline-none placeholder:text-gray-400 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-yellow-400 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-yellow-500"
        >
          Search
        </button>
      </form>

      {/* Mobile filter button */}
      <div className="mb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex min-h-[44px] items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-primary shadow-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilters.length > 0 && (
            <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-black text-black">
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      {/* Active filter chips (tap a chip to remove it) */}
      {activeFilters.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {activeFilters.map((filter) => (
            <button
              key={filter.keys.join('-')}
              type="button"
              onClick={() => removeFilter(filter.keys)}
              aria-label={`Remove filter: ${filter.label}`}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-yellow-300 bg-yellow-50 px-3 text-xs font-semibold text-gray-800 transition hover:bg-yellow-100"
            >
              {filter.label}
              <X className="h-3.5 w-3.5" />
            </button>
          ))}

          <button
            type="button"
            onClick={clearFilters}
            className="min-h-[36px] px-2 text-xs font-semibold text-gray-600 underline hover:text-yellow-700"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Desktop sidebar and inventory */}
      <div className="grid items-start gap-7 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside className="sticky top-24 hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:block">
          <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="flex items-center gap-2 font-bold text-primary">
              <SlidersHorizontal className="h-4 w-4 text-yellow-600" />
              Filters
            </h2>

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-gray-500 hover:text-yellow-700"
            >
              Reset
            </button>
          </div>

          {renderForm('desktop')}
        </aside>

        <section className="min-w-0">
          {/* Sorting */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ArrowUpDown className="h-4 w-4" />
              Sort vehicles
            </div>

            <select
              aria-label="Sort vehicles"
              value={current.sort}
              onChange={(e) => updateSort(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base font-medium text-primary outline-none focus:border-yellow-500 sm:text-sm"
            >
              <option value="newest">Newest first</option>
              <option value="year">Newest model year</option>
              <option value="price_low">Price: Low to high</option>
              <option value="price_high">Price: High to low</option>
            </select>
          </div>

          {children}
        </section>
      </div>

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter vehicles"
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
                <SlidersHorizontal className="h-5 w-5 text-yellow-600" />
                Filter Vehicles
              </h2>

              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2.5 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {renderForm('mobile')}
            </div>

            {/* Sticky action bar - always visible, no scrolling to reach Apply */}
            <div className="space-y-2 border-t border-gray-100 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              {error && (
                <p role="alert" className="text-sm font-medium text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                form="mobile-filters"
                className="min-h-[48px] w-full rounded-lg bg-yellow-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-yellow-500"
              >
                Apply Filters
              </button>

              <button
                type="button"
                onClick={clearFilters}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4" />
                Clear all filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}