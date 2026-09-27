'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/lib/useAdminAuth';
import AdminSidebar from '@/components/AdminSidebar';

export default function AddVehiclePage() {
  const { ready, authFetch, logout } = useAdminAuth();
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      // Step 1: upload any selected images to Cloudinary
      const fileInput = form.elements.namedItem('images') as HTMLInputElement;
      let imageUrls: string[] = [];
      if (fileInput.files && fileInput.files.length) {
        const uploadFd = new FormData();
        Array.from(fileInput.files).forEach(f => uploadFd.append('images', f));
        const uploadRes = await authFetch('/api/upload', { method: 'POST', body: uploadFd });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Image upload failed');
        imageUrls = uploadData.urls;
      }

      // Step 2: create the vehicle with the resulting image URLs
      const features = (fd.get('features') as string || '').split(',').map(f => f.trim()).filter(Boolean);
      const payload = {
        make: fd.get('make'),
        model: fd.get('model'),
        year: fd.get('year'),
        price: fd.get('price'),
        mileage: fd.get('mileage'),
        transmission: fd.get('transmission'),
        fuelType: fd.get('fuel_type'),
        bodyType: fd.get('body_type'),
        engine: fd.get('engine'),
        condition: fd.get('condition'),
        description: fd.get('description'),
        featured: fd.get('featured') === 'on',
        features,
        imageUrls
      };

      const res = await authFetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish');

      setStatus({ ok: true, msg: 'Vehicle published successfully!' });
      form.reset();
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
        <h2 className="text-2xl font-bold mb-6">Add New Vehicle</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Make"><input name="make" required className="input" /></Field>
          <Field label="Model"><input name="model" required className="input" /></Field>
          <Field label="Year"><input name="year" type="number" required className="input" /></Field>
          <Field label="Price (KSh)"><input name="price" type="number" required className="input" /></Field>
          <Field label="Mileage (km)"><input name="mileage" type="number" className="input" /></Field>
          <Field label="Transmission">
            <select name="transmission" className="input"><option>Automatic</option><option>Manual</option></select>
          </Field>
          <Field label="Fuel Type">
            <select name="fuel_type" className="input"><option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option></select>
          </Field>
          <Field label="Body Type"><input name="body_type" placeholder="SUV, Sedan, Truck..." className="input" /></Field>
          <Field label="Engine"><input name="engine" placeholder="2.0L" className="input" /></Field>
          <Field label="Condition">
            <select name="condition" className="input"><option>Foreign Used</option><option>Locally Used</option><option>Brand New</option></select>
          </Field>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold block mb-1">Description</label>
            <textarea name="description" rows={4} className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold block mb-1">Features (comma-separated)</label>
            <input name="features" placeholder="Sunroof, Leather seats, Reverse camera" className="input" />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold block mb-1">Photos (multiple)</label>
            <input name="images" type="file" multiple accept="image/*" className="input" />
          </div>
          <div>
            <label className="text-sm"><input name="featured" type="checkbox" className="mr-2 w-auto" />Feature on homepage</label>
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={submitting} className="btn">
              {submitting ? 'Publishing...' : 'Publish Listing'}
            </button>
            {status && <p className={`mt-2 ${status.ok ? 'text-green-600' : 'text-red-600'}`}>{status.msg}</p>}
          </div>
        </form>
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
