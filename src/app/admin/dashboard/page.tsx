'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/lib/useAdminAuth';
import AdminSidebar from '@/components/AdminSidebar';

interface Stats { total: number; available: number; sold: number; newInquiries: number; }
interface VehicleRow { id: number; make: string; model: string; year: number; price: string; status: string; createdAt: string; }

function formatPrice(price: string) { return 'KSh ' + Number(price).toLocaleString(); }

export default function DashboardPage() {
  const { ready, authFetch, logout } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<VehicleRow[]>([]);

  useEffect(() => {
    if (!ready) return;
    authFetch('/api/vehicles/admin/stats').then(r => r.json()).then(setStats);
    authFetch('/api/vehicles/admin/all').then(r => r.json()).then(data => setRecent(data.slice(0, 8)));
  }, [ready]);

  if (!ready) return null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar onLogout={logout} />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-8">
          {stats ? (
            <>
              <div className="bg-white rounded-xl p-5 shadow"><div className="text-2xl font-bold text-primary">{stats.total}</div><div>Total Vehicles</div></div>
              <div className="bg-white rounded-xl p-5 shadow"><div className="text-2xl font-bold text-primary">{stats.available}</div><div>Available</div></div>
              <div className="bg-white rounded-xl p-5 shadow"><div className="text-2xl font-bold text-primary">{stats.sold}</div><div>Sold</div></div>
              <div className="bg-white rounded-xl p-5 shadow"><div className="text-2xl font-bold text-primary">{stats.newInquiries}</div><div>New Inquiries</div></div>
            </>
          ) : <p>Loading stats...</p>}
        </div>

        <h3 className="font-semibold mb-3">Recently Added</h3>
        <table className="w-full bg-white rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-left text-sm">
            <tr><th className="p-3">Vehicle</th><th className="p-3">Price</th><th className="p-3">Status</th><th className="p-3">Added</th></tr>
          </thead>
          <tbody>
            {recent.length ? recent.map(v => (
              <tr key={v.id} className="border-t text-sm">
                <td className="p-3">{v.year} {v.make} {v.model}</td>
                <td className="p-3">{formatPrice(v.price)}</td>
                <td className="p-3 capitalize">{v.status}</td>
                <td className="p-3">{new Date(v.createdAt).toLocaleDateString()}</td>
              </tr>
            )) : <tr><td className="p-3" colSpan={4}>No vehicles yet.</td></tr>}
          </tbody>
        </table>
      </main>
    </div>
  );
}
