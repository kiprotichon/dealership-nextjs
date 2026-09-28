'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface VehicleLite {
  make: string;
  model: string;
  year: number;
  fuelType: string | null;
}

export default function HomeSearchFilters({ vehicles }: { vehicles: VehicleLite[] }) {
  const router = useRouter();

  const [q, setQ] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [fuel, setFuel] = useState('');

  const makeModels = useMemo(() => {
    const map: Record<string, string[]> = {};
    vehicles.forEach(v => {
      if (!map[v.make]) map[v.make] = [];
      if (!map[v.make].includes(v.model)) map[v.make].push(v.model);
    });
    Object.keys(map).forEach(k => map[k].sort());
    return map;
  }, [vehicles]);

  const makes = Object.keys(makeModels).sort();
  const years = [...new Set(vehicles.map(v => v.year))].sort((a, b) => b - a);
  const models = make ? makeModels[make] || [] : [];

  function handleMakeChange(value: string) {
    setMake(value);
    setModel('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    if (year) params.set('year', year);
    if (fuel) params.set('fuel', fuel);
    router.push(`/inventory?${params.toString()}`);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Try Prado, hybrid, automatic..."
            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Make</label>
            <select
              value={make}
              onChange={(e) => handleMakeChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="">All makes</option>
              {makes.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!make}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">{make ? 'All models' : 'Choose a make first'}</option>
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="">All years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">Fuel type</label>
            <select
              value={fuel}
              onChange={(e) => setFuel(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <option value="">Any fuel</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-black transition hover:opacity-90"
            >
              <Search className="h-4 w-4" />
              Find my car
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
