'use client';

import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

export default function SearchPanel({ models, years }: { models: Record<string, string[]>; years: number[] }) {
  const [make, setMake] = useState('');
  const makes = Object.keys(models).sort();
  const field = 'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:bg-gray-50 disabled:text-gray-400';

  return (
    <form action="/inventory" className="rounded-3xl bg-white p-5 shadow-xl sm:p-7">
      <h2 className="mb-4 text-lg font-bold text-primary">Find your next car</h2>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input name="q" placeholder="Try Prado, hybrid, 4WD, automatic..." className={`${field} pl-12`} />
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <select name="make" value={make} onChange={e => setMake(e.target.value)} className={field} aria-label="Make">
          <option value="">All makes</option>
          {makes.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select name="model" key={make} disabled={!make} className={field} aria-label="Model">
          <option value="">{make ? 'All models' : 'Choose a make first'}</option>
          {(models[make] || []).map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <select name="year" className={field} aria-label="Year">
          <option value="">All years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select name="status" defaultValue="available" className={field} aria-label="Stock status">
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
          <option value="any">Any status</option>
        </select>
        <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-primary hover:brightness-95">
          Find my car <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
