
'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';

export default function InventoryFilters({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const fieldClass =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20';

  const labelClass =
    'mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500';

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
    router.push('/inventory');
    setMobileOpen(false);
  }

  function updateSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    params.set('sort', value);
    params.delete('page');

    router.push(`/inventory?${params.toString()}`);
  }

  const filterForm = (
    <form onSubmit={applyFilters} className="space-y-5">

      {/* Make and model */}
      <div>
        <label className={labelClass}>Vehicle make</label>
        <input
          name="make"
          defaultValue={current.make}
          placeholder="e.g. Toyota"
          className={fieldClass}
        />
      </div>

      <div>
        <label className={labelClass}>Model</label>
        <input
          name="model"
          defaultValue={current.model}
          placeholder="e.g. Land Cruiser"
          className={fieldClass}
        />
      </div>

      {/* Price */}
      <div>
        <label className={labelClass}>Price range (KSh)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            name="minPrice"
            type="number"
            min="0"
            defaultValue={current.minPrice}
            placeholder="Minimum"
            className={fieldClass}
          />
          <input
            name="maxPrice"
            type="number"
            min="0"
            defaultValue={current.maxPrice}
            placeholder="Maximum"
            className={fieldClass}
          />
        </div>
      </div>

      {/* Year */}
      <div>
        <label className={labelClass}>Manufacturing year</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            name="minYear"
            type="number"
            min="1900"
            max="2100"
            defaultValue={current.minYear}
            placeholder="From"
            className={fieldClass}
          />
          <input
            name="maxYear"
            type="number"
            min="1900"
            max="2100"
            defaultValue={current.maxYear}
            placeholder="To"
            className={fieldClass}
          />
        </div>
      </div>

      {/* Fuel */}
      <div>
        <label className={labelClass}>Fuel type</label>
        <select
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
        <label className={labelClass}>Transmission</label>
        <select
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
        <label className={labelClass}>Condition</label>
        <select
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
        <label className={labelClass}>Availability</label>
        <select
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
    </form>
  );

  return (
    <>
      {/* Compact search bar */}
      <form
        onSubmit={updateSearch}
        className="mb-6 flex gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm"
      >
        <div className="flex flex-1 items-center gap-3 px-2">
          <Search className="h-5 w-5 shrink-0 text-gray-400" />

          <input
            name="q"
            type="search"
            defaultValue={current.q}
            placeholder="Search by make, model or keyword..."
            className="w-full bg-transparent py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
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
      <div className="mb-5 flex items-center justify-between lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-primary shadow-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>

        <span className="text-xs text-gray-500">
          Refine your search
        </span>
      </div>

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

          {filterForm}
        </aside>

        <section className="min-w-0">

          {/* Sorting */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ArrowUpDown className="h-4 w-4" />
              Sort vehicles
            </div>

            <select
              value={current.sort}
              onChange={(e) => updateSort(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-primary outline-none focus:border-yellow-500"
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

          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
                <SlidersHorizontal className="h-5 w-5 text-yellow-600" />
                Filter Vehicles
              </h2>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {filterForm}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
