'use client';

import { useEffect, useState } from 'react';
import { useAdminAuth } from '@/lib/useAdminAuth';
import AdminSidebar from '@/components/AdminSidebar';

interface InquiryRow {
  id: number; customerName: string; phone: string | null; email: string | null;
  message: string | null; status: string;
  vehicle: { make: string; model: string; year: number } | null;
}

export default function InquiriesPage() {
  const { ready, authFetch, logout } = useAdminAuth();
  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);

  useEffect(() => {
    if (!ready) return;
    authFetch('/api/inquiries').then(r => r.json()).then(setInquiries);
  }, [ready]);

  async function updateStatus(id: number, statusVal: string) {
    await authFetch(`/api/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: statusVal })
    });
  }

  if (!ready) return null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar onLogout={logout} />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Customer Inquiries</h2>
        <table className="w-full bg-white rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-left text-sm">
            <tr><th className="p-3">Customer</th><th className="p-3">Contact</th><th className="p-3">Vehicle</th><th className="p-3">Message</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody>
            {inquiries.length ? inquiries.map(i => (
              <tr key={i.id} className="border-t text-sm">
                <td className="p-3">{i.customerName}</td>
                <td className="p-3">{i.phone}{i.email && <><br />{i.email}</>}</td>
                <td className="p-3">{i.vehicle ? `${i.vehicle.year} ${i.vehicle.make} ${i.vehicle.model}` : '—'}</td>
                <td className="p-3">{i.message}</td>
                <td className="p-3">
                  <select
                    defaultValue={i.status}
                    onChange={(e) => updateStatus(i.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="viewing_scheduled">Viewing Scheduled</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
              </tr>
            )) : <tr><td className="p-3" colSpan={5}>No inquiries yet.</td></tr>}
          </tbody>
        </table>
      </main>
    </div>
  );
}
