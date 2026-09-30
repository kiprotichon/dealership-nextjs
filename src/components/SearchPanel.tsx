'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';

type QuickFilterParams = {
  make?: string;
  maxPrice?: string;
  sort?: string;
};

export default function SearchPanel({
  models,
  years
}: {
  models: Record<string, string[]>;
  years: number[];
}) {
  const router = useRouter();

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [q, setQ] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [error, setError] = useState('');

  const makes = Object.keys(models).sort();
  const modelOptions = make ? models[make] || [] : [];
  const currentYear = new Date().getFullYear();

  function handleMakeChange(value: string) {
    setMake(value);
    setModel('');
  }

  /** Guard: price must be empty or a positive number */
  function sanitizePrice(raw: string): string {
    if (raw === '') return '';

    const n = Number(raw);

    if (!Number.isFinite(n) || n < 0) return '';

    // Block pure zero
    if (n === 0) return '';

    return String(Math.floor(n));
  }

  /** Guard: year must be empty or between 1990 and currentYear+1 */
  function sanitizeYear(raw: string): string {
    if (raw === '') return '';

    const n = Number(raw);

    if (
      !Number.isFinite(n) ||
      n < 1990 ||
      n > currentYear + 1
    ) {
      return '';
    }

    return String(Math.floor(n));
  }

  function buildParams(extra: QuickFilterParams = {}) {
    const params = new URLSearchParams();

    if (q) params.set('q', q);
    if (make) params.set('make', make);
    if (model) params.set('model', model);

    const pMin = sanitizePrice(minPrice);
    const pMax = sanitizePrice(maxPrice);
    const yMin = sanitizeYear(minYear);
    const yMax = sanitizeYear(maxYear);

    if (pMin) params.set('minPrice', pMin);
    if (pMax) params.set('maxPrice', pMax);
    if (yMin) params.set('minYear', yMin);
    if (yMax) params.set('maxYear', yMax);

    Object.entries(extra).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, value);
      }
    });

    return params.toString();
  }

  function validate(): string | null {
    const pMin = minPrice ? Number(minPrice) : null;
    const pMax = maxPrice ? Number(maxPrice) : null;
    const yMin = minYear ? Number(minYear) : null;
    const yMax = maxYear ? Number(maxYear) : null;

    if (pMin !== null && (pMin <= 0 || pMin < 50000)) {
      return 'Min price must be at least KSh 50,000';
    }

    if (pMax !== null && pMax <= 0) {
      return 'Max price must be greater than 0';
    }

    if (pMin !== null && pMax !== null && pMin > pMax) {
      return 'Min price cannot be higher than max price';
    }

    if (
      yMin !== null &&
      (yMin < 1990 || yMin > currentYear + 1)
    ) {
      return `Min year must be between 1990 and ${currentYear + 1}`;
    }

    if (
      yMax !== null &&
      (yMax < 1990 || yMax > currentYear + 1)
    ) {
      return `Max year must be between 1990 and ${currentYear + 1}`;
    }

    if (yMin !== null && yMax !== null && yMin > yMax) {
      return 'Min year cannot be higher than max year';
    }

    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const err = validate();

    if (err) {
      setError(err);
      return;
    }

    setError('');

    const query = buildParams();

    router.push(
      query ? `/inventory?${query}` : '/inventory'
    );
  }

  function quickFilter(extra: QuickFilterParams) {
    setError('');

    const query = buildParams(extra);

    router.push(
      query ? `/inventory?${query}` : '/inventory'
    );
  }

  const field =
    'h-11 w-full rounded-full border border-gray-200 bg-white px-4 text-sm text-gray-700 outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:bg-gray-50 disabled:text-gray-400';

  return (
    <div className="rounded-3xl bg-white p-4 shadow-xl sm:p-5">
      <form onSubmit={handleSubmit}>
        {/* Main search row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:flex-nowrap">

          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search keyword..."
            className={`${field} sm:flex-1 sm:min-w-[140px]`}
          />

          <div className="relative sm:w-36">
            <select
              value={make}
              onChange={e => handleMakeChange(e.target.value)}
              className={`${field} appearance-none pr-8`}
            >
              <option value="">Make</option>

              {makes.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative sm:w-36">
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              disabled={!make}
              className={`${field} appearance-none pr-8`}
            >
              <option value="">Model</option>

              {modelOptions.map(m => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="whitespace-nowrap px-1 text-sm font-semibold text-primary/70 hover:text-accent"
          >
            {showMore ? 'Less options' : 'More options'}
          </button>

          <button
            type="submit"
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-primary transition hover:brightness-95"
          >
            <Search className="h-4 w-4" />
            Search cars
          </button>
        </div>

        {showMore && (
          <div className="mt-3 flex flex-wrap gap-3">

            <input
              type="number"
              placeholder="Min Price"
              min={50000}
              step={50000}
              value={minPrice}
              onChange={e => {
                const v = e.target.value;

                if (v === '0') return;

                setMinPrice(v);
              }}
              onBlur={() =>
                setMinPrice(sanitizePrice(minPrice))
              }
              className={`${field} w-36`}
            />

            <input
              type="number"
              placeholder="Max Price"
              min={50000}
              step={50000}
              value={maxPrice}
              onChange={e => {
                const v = e.target.value;

                if (v === '0') return;

                setMaxPrice(v);
              }}
              onBlur={() =>
                setMaxPrice(sanitizePrice(maxPrice))
              }
              className={`${field} w-36`}
            />

            <input
              type="number"
              placeholder="Min Year"
              min={1990}
              max={currentYear + 1}
              value={minYear}
              onChange={e => {
                const v = e.target.value;

                if (v === '0') return;

                setMinYear(v);
              }}
              onBlur={() =>
                setMinYear(sanitizeYear(minYear))
              }
              className={`${field} w-28`}
            />

            <input
              type="number"
              placeholder="Max Year"
              min={1990}
              max={currentYear + 1}
              value={maxYear}
              onChange={e => {
                const v = e.target.value;

                if (v === '0') return;

                setMaxYear(v);
              }}
              onBlur={() =>
                setMaxYear(sanitizeYear(maxYear))
              }
              className={`${field} w-28`}
            />

          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </form>

      {/* Quick chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          {
            label: 'Toyota',
            params: { make: 'Toyota' }
          },
          {
            label: 'BMW',
            params: { make: 'BMW' }
          },
          {
            label: 'Mercedes',
            params: { make: 'Mercedes-Benz' }
          },
          {
            label: 'Nissan',
            params: { make: 'Nissan' }
          },
          {
            label: 'Under 2M',
            params: { maxPrice: '2000000' }
          },
          {
            label: 'Recently Added',
            params: { sort: 'newest' }
          }
        ].map(chip => (
          <button
            key={chip.label}
            type="button"
            onClick={() => quickFilter(chip.params)}
            className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 transition hover:border-accent hover:text-primary"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}