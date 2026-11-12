
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CarFront,
  Plus,
  Pencil,
  Trash2,
  Star,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

interface VehicleRow {
  id: number;
  make: string;
  model: string;
  year: number;
  price: string;
  status: string;
  featured: boolean;
}

function formatPrice(price: string | number) {
  return 'KSh ' + Number(price).toLocaleString('en-KE');
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case 'available':
      return 'bg-green-50 text-green-700 ring-green-200';
    case 'reserved':
      return 'bg-amber-50 text-amber-700 ring-amber-200';
    case 'sold':
      return 'bg-red-50 text-red-700 ring-red-200';
    default:
      return 'bg-gray-100 text-gray-700 ring-gray-200';
  }
}

export default function ListingsPage() {
  const { ready, authFetch } = useAdminAuth();

  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    async function loadVehicles() {
      setLoading(true);
      setError('');

      try {
        const response = await authFetch('/api/vehicles/admin/all');

        if (!response.ok) {
          throw new Error('Could not load vehicle listings.');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Unexpected response from the server.');
        }

        if (!cancelled) {
          setVehicles(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Something went wrong.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadVehicles();

    return () => {
      cancelled = true;
    };
  }, [ready]);

  async function updateStatus(id: number, status: string) {
    setBusyId(id);
    setNotice('');
    setError('');

    try {
      const response = await authFetch(`/api/vehicles/id/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update vehicle status.');
      }

      setVehicles(current =>
        current.map(vehicle =>
          vehicle.id === id ? { ...vehicle, status } : vehicle
        )
      );

      setNotice('Vehicle status updated successfully.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not update status.'
      );
    } finally {
      setBusyId(null);
    }
  }

  async function toggleFeatured(id: number, featured: boolean) {
    setBusyId(id);
    setNotice('');
    setError('');

    try {
      const response = await authFetch(`/api/vehicles/id/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured })
      });

      if (!response.ok) {
        throw new Error('Failed to update featured status.');
      }

      setVehicles(current =>
        current.map(vehicle =>
          vehicle.id === id ? { ...vehicle, featured } : vehicle
        )
      );

      setNotice('Featured setting updated.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not update featured setting.'
      );
    } finally {
      setBusyId(null);
    }
  }

  async function deleteVehicle(id: number) {
    const vehicle = vehicles.find(item => item.id === id);

    if (
      !confirm(
        `Are you sure you want to permanently delete ${vehicle?.year} ${vehicle?.make} ${vehicle?.model}?`
      )
    ) {
      return;
    }

    setBusyId(id);
    setNotice('');
    setError('');

    try {
      const response = await authFetch(`/api/vehicles/id/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete vehicle.');
      }

      setVehicles(current => current.filter(item => item.id !== id));
      setNotice('Vehicle deleted successfully.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not delete vehicle.'
      );
    } finally {
      setBusyId(null);
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const term = search.toLowerCase();

    return (
      `${vehicle.year} ${vehicle.make} ${vehicle.model}`
        .toLowerCase()
        .includes(term) ||
      vehicle.status.toLowerCase().includes(term)
    );
  });

  if (!ready) return null;

  return (
    <div className="w-full min-w-0 space-y-6">

      {/* Page Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <CarFront size={15} className="text-gray-600" />
            Inventory Management
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Manage Listings
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your dealership vehicles, prices and availability.
          </p>
        </div>

        <Link
          href="/admin/add-vehicle"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b0b0b] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#242424] sm:w-auto"
        >
          <Plus size={18} />
          Add New Vehicle
        </Link>
      </div>

      {/* Summary Cards - Monochrome */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total Vehicles</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {vehicles.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Available</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {vehicles.filter(v => v.status === 'available').length}
          </p>
        </div>

        <div className="col-span-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:col-span-1">
          <p className="text-xs font-medium text-gray-500">Featured Vehicles</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {vehicles.filter(v => v.featured).length}
          </p>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full min-w-0 sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search make, model, year or status..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-500 focus:bg-white focus:ring-2 focus:ring-gray-200"
          />
        </div>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Notifications */}
      {notice && (
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-700">
          <CheckCircle2 size={18} />
          {notice}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-700" />
          <p className="text-sm text-gray-500">Loading vehicle listings...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredVehicles.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-16 text-center shadow-sm">
          <CarFront size={38} className="mx-auto mb-3 text-gray-300" />

          <h3 className="font-semibold text-gray-900">
            {search ? 'No matching vehicles' : 'No vehicles yet'}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {search
              ? 'Try searching with a different vehicle name.'
              : 'Add your first vehicle to get started.'}
          </p>

          {!search && (
            <Link
              href="/admin/add-vehicle"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0b0b0b] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#242424]"
            >
              <Plus size={17} />
              Add Vehicle
            </Link>
          )}
        </div>
      )}

      {/* Mobile and Tablet Vehicle Cards */}
      {!loading && filteredVehicles.length > 0 && (
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
          {filteredVehicles.map(vehicle => (
            <div
              key={vehicle.id}
              className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400">
                    VEHICLE #{vehicle.id}
                  </p>

                  <h3 className="mt-1 break-words text-base font-bold text-gray-900">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                </div>

                {vehicle.featured && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-200">
                    <Star size={12} fill="currentColor" />
                    Featured
                  </span>
                )}
              </div>

              <div className="my-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(vehicle.price)}
                </p>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusStyle(vehicle.status)}`}
                >
                  {vehicle.status}
                </span>
              </div>

              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-500">
                    Vehicle Status
                  </label>

                  <select
                    value={vehicle.status}
                    disabled={busyId === vehicle.id}
                    onChange={e =>
                      updateStatus(vehicle.id, e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-gray-500 disabled:opacity-50"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={vehicle.featured}
                    disabled={busyId === vehicle.id}
                    onChange={e =>
                      toggleFeatured(vehicle.id, e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 accent-gray-800"
                  />
                  Show as featured vehicle
                </label>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-4">
                <Link
                  href={`/admin/edit-vehicle/${vehicle.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  <Pencil size={15} />
                  Edit
                </Link>

                <button
                  onClick={() => deleteVehicle(vehicle.id)}
                  disabled={busyId === vehicle.id}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop Listings Table */}
      {!loading && filteredVehicles.length > 0 && (
        <div className="hidden min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-gray-900">
                Vehicle Inventory
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {filteredVehicles.length} vehicle
                {filteredVehicles.length !== 1 ? 's' : ''} displayed
              </p>
            </div>
          </div>

          <div className="w-full max-w-full overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Vehicle</th>
                  <th className="px-5 py-4 font-semibold">Price</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Featured</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredVehicles.map(vehicle => (
                  <tr
                    key={vehicle.id}
                    className="transition hover:bg-gray-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                          <CarFront size={20} />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            Vehicle ID: #{vehicle.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-gray-800">
                      {formatPrice(vehicle.price)}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={vehicle.status}
                        disabled={busyId === vehicle.id}
                        onChange={e =>
                          updateStatus(vehicle.id, e.target.value)
                        }
                        className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium capitalize outline-none focus:border-gray-500 disabled:opacity-50"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                      </select>
                    </td>

                    <td className="px-5 py-4">
                      <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={vehicle.featured}
                          disabled={busyId === vehicle.id}
                          onChange={e =>
                            toggleFeatured(vehicle.id, e.target.checked)
                          }
                          className="h-4 w-4 rounded border-gray-300 accent-gray-800"
                        />

                        {vehicle.featured ? (
                          <span className="font-medium text-amber-700">
                            Featured
                          </span>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </label>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/edit-vehicle/${vehicle.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-100"
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>

                        <button
                          onClick={() => deleteVehicle(vehicle.id)}
                          disabled={busyId === vehicle.id}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
            Scroll horizontally within the table if all columns are not visible.
          </div>
        </div>
      )}
    </div>
  );
}
