'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function InventoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'newest';

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`/inventory?${params.toString()}`);
  }

  return (
    <div className="flex gap-4 flex-wrap mb-8">
      <select value={sort} onChange={handleSortChange} className="border rounded-lg p-2">
        <option value="newest">Newest First</option>
        <option value="price_low">Price: Low to High</option>
        <option value="price_high">Price: High to Low</option>
        <option value="year">Year: Newest</option>
      </select>
    </div>
  );
}
