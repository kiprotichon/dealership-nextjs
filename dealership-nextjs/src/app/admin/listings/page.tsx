'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/lib/useAdminAuth';
import AdminSidebar from '@/components/AdminSidebar';

interface VehicleRow {
  id: number; make: string; model: string; year: number;
  price: string; status: string; featured: boolean;
}

function formatPrice(price: string) { return 'KSh ' + Number(price).toLocaleString(); }

export default function ListingsPage() {
  const { ready, authFetch, logout } = useAdminAuth();
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);

  useEffect(() => {
    if (!ready) return;
    load();
  }, [ready]);

  function load() {
    authFetch('/api/vehicles/admin/all').then(r => r.json()).then(setVehicles);
  }

  async function updateStatus(id: number, status: string) {
    await authFetch(`/api/vehicles/id/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  }

  async function toggleFeatured(id: number, featured: boolean) {
    await authFetch(`/api/vehicles/id/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured })
    });
  }

  async function deleteVehicle(id: number) {
    if (!confirm('Delete this vehicle permanently?')) return;
    await authFetch(`/api/vehicles/id/${id}`, { method: 'DELETE' });
    setVehicles(v => v.filter(x => x.id !== id));
  }

  if (!ready) return null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar onLogout={logout} />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Manage Listings</h2>
        <table className="w-full bg-white rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-left text-sm">
            <tr><th className="p-3">Vehicle</th><th className="p-3">Price</th><th className="p-3">Status</th><th className="p-3">Featured</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {vehicles.length ? vehicles.map(v => (
              <tr key={v.id} className="border-t text-sm">
                <td className="p-3">{v.year} {v.make} {v.model}</td>
                <td className="p-3">{formatPrice(v.price)}</td>
                <td className="p-3">
                  <select
                    defaultValue={v.status}
                    onChange={(e) => updateStatus(v.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </td>
                <td className="p-3">
                  <input
                    type="checkbox"
                    defaultChecked={v.featured}
                    onChange={(e) => toggleFeatured(v.id, e.target.checked)}
                  />
                </td>
                <td className="p-3">
                  <button onClick={() => deleteVehicle(v.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            )) : <tr><td className="p-3" colSpan={5}>No vehicles yet.</td></tr>}
          </tbody>
        </table>
      </main>
    </div>
  );
}
