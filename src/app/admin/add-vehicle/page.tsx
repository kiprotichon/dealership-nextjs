'use client';

import { useState, useRef } from 'react';
import { useAdminAuth } from '@/lib/useAdminAuth';
import AdminSidebar from '@/components/AdminSidebar';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

const MAKE_MODELS: Record<string, string[]> = {
  Toyota: ['Hilux', 'Land Cruiser', 'Prado', 'Fortuner', 'Rav4', 'Harrier', 'Corolla', 'Camry', 'Vitz', 'Fielder', 'Noah', 'Voxy', 'Alphard', 'Hiace', 'Premio', 'Mark X', 'Axio', 'Wish'],
  Nissan: ['X-Trail', 'Note', 'Tiida', 'March', 'Navara', 'Patrol', 'Juke', 'Qashqai', 'Serena', 'Sylphy'],
  Mazda: ['CX-5', 'CX-3', 'Demio', 'Axela', 'Atenza', 'BT-50', 'CX-8', 'CX-9'],
  Subaru: ['Forester', 'Outback', 'Impreza', 'XV', 'Legacy', 'WRX'],
  Honda: ['Fit', 'Vezel', 'CR-V', 'Civic', 'Accord', 'Freed', 'Stream'],
  Mitsubishi: ['Outlander', 'Pajero', 'Lancer', 'ASX', 'Triton', 'RVR'],
  Isuzu: ['D-Max', 'MUX', 'NQR', 'FRR'],
  BMW: ['X3', 'X5', 'X1', 'X6', '3 Series', '5 Series', '7 Series', 'X4'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'GLA', 'A-Class', 'ML', 'G-Class'],
  Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'A5'],
  Volkswagen: ['Golf', 'Polo', 'Tiguan', 'Passat', 'Touareg', 'Amarok'],
  Ford: ['Ranger', 'Everest', 'Focus', 'Escape', 'Mustang'],
  Hyundai: ['Tucson', 'Santa Fe', 'i10', 'i20', 'Creta', 'Elantra'],
  Kia: ['Sportage', 'Sorento', 'Picanto', 'Rio', 'Seltos'],
  Suzuki: ['Swift', 'Vitara', 'Jimny', 'Ertiga', 'Alto'],
  'Land Rover': ['Discovery', 'Range Rover', 'Range Rover Sport', 'Defender', 'Freelander', 'Evoque'],
  Lexus: ['RX', 'NX', 'LX', 'IS', 'ES', 'GX'],
  Peugeot: ['3008', '2008', '508', '5008'],
  Volvo: ['XC60', 'XC90', 'S60', 'V40'],
  Jeep: ['Wrangler', 'Cherokee', 'Grand Cherokee', 'Compass'],
  Chevrolet: ['Trailblazer', 'Captiva', 'Cruze'],
  Hino: ['300', '500', '700'],
  Other: []
};

const BODY_TYPES = ['SUV', 'Pickup', 'Sedan', 'Hatchback', 'Van', 'Wagon', 'Coupe', 'Truck', 'Convertible'];
const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Petrol/Hybrid'];
const CONDITIONS = ['Foreign Used', 'Locally Used', 'Brand New'];

export default function AddVehiclePage() {
  const { ready, authFetch, logout } = useAdminAuth();
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [customModel, setCustomModel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modelOptions = make && MAKE_MODELS[make] ? MAKE_MODELS[make] : [];

  function handleMakeChange(value: string) {
    setMake(value);
    setModel('');
    setCustomModel(value === 'Other' || (MAKE_MODELS[value] && MAKE_MODELS[value].length === 0));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setSelectedFiles(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(previews[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    try {
      let imageUrls: string[] = [];
      if (selectedFiles.length) {
        const uploadFd = new FormData();
        selectedFiles.forEach(f => uploadFd.append('images', f));
        const uploadRes = await authFetch('/api/upload', { method: 'POST', body: uploadFd });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Image upload failed');
        imageUrls = uploadData.urls;
      }

      const features = ((fd.get('features') as string) || '').split(',').map(f => f.trim()).filter(Boolean);
      const finalModel = customModel ? (fd.get('model_custom') as string) : model;

      const payload = {
        make: make === 'Other' ? (fd.get('make_custom') as string) : make,
        model: finalModel,
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
      previews.forEach(url => URL.revokeObjectURL(url));
      setSelectedFiles([]);
      setPreviews([]);
      setMake('');
      setModel('');
      setCustomModel(false);
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
          <Field label="Make">
            <select value={make} onChange={e => handleMakeChange(e.target.value)} required className="input">
              <option value="">Select make</option>
              {Object.keys(MAKE_MODELS).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {make === 'Other' && (
              <input name="make_custom" required placeholder="Enter make" className="input mt-2" />
            )}
          </Field>

          <Field label="Model">
            {!customModel && modelOptions.length > 0 ? (
              <select
                value={model}
                onChange={e => {
                  if (e.target.value === '__other__') {
                    setCustomModel(true);
                    setModel('');
                  } else {
                    setModel(e.target.value);
                  }
                }}
                required
                className="input"
              >
                <option value="">Select model</option>
                {modelOptions.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
                <option value="__other__">Other (type manually)</option>
              </select>
            ) : (
              <input name="model_custom" required placeholder="Enter model" className="input" defaultValue={model} />
            )}
            {customModel && modelOptions.length > 0 && (
              <button type="button" onClick={() => { setCustomModel(false); setModel(''); }} className="text-xs text-accent mt-1 underline">
                Back to list
              </button>
            )}
          </Field>

          <Field label="Year">
            <input name="year" type="number" min={1990} max={2030} required className="input" placeholder="e.g. 2019" />
          </Field>
          <Field label="Price (KSh)">
            <input name="price" type="number" required className="input" placeholder="e.g. 3500000" />
          </Field>
          <Field label="Mileage (km)">
            <input name="mileage" type="number" className="input" placeholder="e.g. 85000" />
          </Field>
          <Field label="Transmission">
            <select name="transmission" className="input">
              {TRANSMISSIONS.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Fuel Type">
            <select name="fuel_type" className="input">
              {FUEL_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Body Type">
            <select name="body_type" className="input">
              <option value="">Select body type</option>
              {BODY_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Engine">
            <input name="engine" placeholder="2.0L / 2400 CC" className="input" />
          </Field>
          <Field label="Condition">
            <select name="condition" className="input">
              {CONDITIONS.map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold block mb-1">Description</label>
            <textarea name="description" rows={4} className="input" placeholder="Key selling points, service history, extras..." />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-semibold block mb-1">Features (comma-separated)</label>
            <input name="features" placeholder="Sunroof, Leather seats, Reverse camera, Alloy wheels" className="input" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold block mb-2">Photos (multiple)</label>
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" id="vehicle-photos" />
            <label htmlFor="vehicle-photos" className="flex items-center gap-2 cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 py-4 text-sm font-medium text-gray-600 hover:border-accent hover:bg-accent/5 transition">
              <Upload className="h-5 w-5" />
              {selectedFiles.length ? 'Add more photos' : 'Choose photos'}
            </label>
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {previews.map((src, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-[4/3]">
                    <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow-md opacity-90 hover:opacity-100 transition" title="Remove this photo">
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 truncate">
                      {selectedFiles[index]?.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {previews.length === 0 && (
              <p className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                <ImageIcon className="h-3.5 w-3.5" /> No photos selected yet
              </p>
            )}
          </div>

          <div>
            <label className="text-sm">
              <input name="featured" type="checkbox" className="mr-2 w-auto" />
              Feature on homepage
            </label>
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
