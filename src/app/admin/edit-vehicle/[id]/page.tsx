'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/lib/useAdminAuth';
import AdminSidebar from '@/components/AdminSidebar';

const BODY_TYPES = ['SUV', 'Pickup', 'Sedan', 'Hatchback', 'Van', 'Wagon', 'Coupe', 'Truck', 'Convertible'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Petrol/Hybrid'];
const CONDITIONS = ['Foreign Used', 'Locally Used', 'Brand New'];
const STATUSES = ['available', 'reserved', 'sold'];

export default function EditVehiclePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { ready, authFetch, logout } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [form, setForm] = useState({
    make: '', model: '', year: '', price: '', mileage: '',
    transmission: 'Automatic', fuelType: 'Petrol', bodyType: '',
    engine: '', condition: 'Foreign Used', description: '',
    status: 'available', featured: false
  });

  useEffect(() => {
    if (!ready || !id) return;
    authFetch(`/api/vehicles/admin/all`)
      .then(r => r.json())
      .then((list: any[]) => {
        const v = list.find(x => String(x.id) === String(id));
        if (!v) {
          setStatus({ ok: false, msg: 'Vehicle not found' });
          setLoading(false);
          return;
        }
        setForm({
          make: v.make || '',
          model: v.model || '',
          year: String(v.year || ''),
          price: String(v.price || ''),
          mileage: v.mileage != null ? String(v.mileage) : '',
          transmission: v.transmission || 'Automatic',
          fuelType: v.fuelType || 'Petrol',
          bodyType: v.bodyType || '',
          engine: v.engine || '',
          condition: v.condition || 'Foreign Used',
          description: v.description || '',
          status: v.status || 'available',
          featured: !!v.featured
        });
        setLoading(false);
      })
      .catch(() => {
        setStatus({ ok: false, msg: 'Failed to load vehicle' });
        setLoading(false);
      });
  }, [ready, id]);

  function update(field: string, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const payload = {
        make: form.make,
        model: form.model,
        year: Number(form.year),
        price: Number(form.price),
        mileage: form.mileage ? Number(form.mileage) : null,
        transmission: form.transmission,
        fuelType: form.fuelType,
        bodyType: form.bodyType || null,
        engine: form.engine || null,
        condition: form.condition,
        description: form.description || null,
        status: form.status,
        featured: form.featured
      };
      const res = await authFetch(`/api/vehicles/id/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setStatus({ ok: true, msg: 'Vehicle updated successfully!' });
      setTimeout(() => router.push('/admin/listings'), 1200);
    } catch (err: any) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  if (!ready) return null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar onLogout={logout} />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Edit Vehicle</h2>
          <button onClick={() => router.push('/admin/listings')} className="text-sm text-gray-500 hover:text-primary underline">
            Back to listings
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            <Field label="Make">
              <input value={form.make} onChange={e => update('make', e.target.value)} required className="input" />
            </Field>
            <Field label="Model">
              <input value={form.model} onChange={e => update('model', e.target.value)} required className="input" />
            </Field>
            <Field label="Year">
              <input type="number" value={form.year} onChange={e => update('year', e.target.value)} required className="input" />
            </Field>
            <Field label="Price (KSh)">
              <input type="number" value={form.price} onChange={e => update('price', e.target.value)} required className="input" />
            </Field>
            <Field label="Mileage (km)">
              <input type="number" value={form.mileage} onChange={e => update('mileage', e.target.value)} className="input" />
            </Field>
            <Field label="Transmission">
              <select value={form.transmission} onChange={e => update('transmission', e.target.value)} className="input">
                {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Fuel Type">
              <select value={form.fuelType} onChange={e => update('fuelType', e.target.value)} className="input">
                {FUEL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Body Type">
              <select value={form.bodyType} onChange={e => update('bodyType', e.target.value)} className="input">
                <option value="">Select</option>
                {BODY_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Engine">
              <input value={form.engine} onChange={e => update('engine', e.target.value)} className="input" />
            </Field>
            <Field label="Condition">
              <select value={form.condition} onChange={e => update('condition', e.target.value)} className="input">
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => update('status', e.target.value)} className="input">
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <div className="flex items-end pb-2">
              <label className="text-sm">
                <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} className="mr-2 w-auto" />
                Feature on homepage
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold block mb-1">Description</label>
              <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} className="input" />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting} className="btn">
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => router.push('/admin/listings')} className="px-5 py-3 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50">
                Cancel
              </button>
            </div>
            {status && (
              <p className={`md:col-span-2 ${status.ok ? 'text-green-600' : 'text-red-600'}`}>{status.msg}</p>
            )}
          </form>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-semibold block mb-1">{label}</label>
      {children}
    </div>
  );
}
