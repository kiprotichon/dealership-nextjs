
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CarFront,
  CheckCircle2,
  CircleDollarSign,
  MessageSquare,
  Plus,
  ArrowRight,
  CalendarDays,
  RefreshCw,
  LayoutDashboard
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

interface Stats {
  total: number;
  available: number;
  sold: number;
  newInquiries: number;
}

interface VehicleRow {
  id: number;
  make: string;
  model: string;
  year: number;
  price: string;
  status: string;
  createdAt: string;
}

function formatPrice(price: string) {
  return 'KSh ' + Number(price).toLocaleString('en-KE');
}

export default function DashboardPage() {
  const { ready, authFetch } = useAdminAuth();

  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);

      try {
        const [statsResponse, vehiclesResponse] = await Promise.all([
          authFetch('/api/vehicles/admin/stats'),
          authFetch('/api/vehicles/admin/all')
        ]);

        if (!statsResponse.ok || !vehiclesResponse.ok) {
          throw new Error('Unable to load dashboard data.');
        }

        const statsData = await statsResponse.json();
        const vehiclesData = await vehiclesResponse.json();

        if (!cancelled) {
          setStats(statsData);
          setRecent(
            Array.isArray(vehiclesData) ? vehiclesData.slice(0, 8) : []
          );
        }
      } catch (error) {
        console.error('Dashboard loading error:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [ready]);

  if (!ready) return null;

  const statCards = [
    {
      label: 'Total Vehicles',
      value: stats?.total ?? 0,
      icon: CarFront,
      description: 'All dealership listings'
    },
    {
      label: 'Available',
      value: stats?.available ?? 0,
      icon: CheckCircle2,
      description: 'Ready for customers'
    },
    {
      label: 'Sold Vehicles',
      value: stats?.sold ?? 0,
      icon: CircleDollarSign,
      description: 'Successfully sold'
    },
    {
      label: 'New Inquiries',
      value: stats?.newInquiries ?? 0,
      icon: MessageSquare,
      description: 'Awaiting follow-up'
    }
  ];

  return (
    <div className="w-full min-w-0 space-y-7">

      {/* Dashboard Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <LayoutDashboard size={15} />
            Daily Bazaar Admin
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Dashboard Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Monitor your dealership performance and manage your inventory.
          </p>
        </div>

        <Link
          href="/admin/add-vehicle"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b0b0b] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 sm:w-auto"
        >
          <Plus size={17} />
          Add New Vehicle
        </Link>
      </div>

      {/* Statistics */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Business Summary
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Overview of your dealership activity
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {item.label}
                    </p>

                    <p className="mt-3 text-3xl font-bold tracking-tight text-gray-950 tabular-nums">
                      {loading ? '—' : item.value}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                    <Icon size={21} />
                  </div>
                </div>

                <p className="mt-4 border-t border-gray-100 pt-3 text-xs text-gray-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Vehicles */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Recently Added Vehicles
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              The latest vehicles added to your inventory.
            </p>
          </div>

          <Link
            href="/admin/listings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-black"
          >
            View All Listings
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="px-5 py-16 text-center">
            <RefreshCw
              size={23}
              className="mx-auto mb-3 animate-spin text-gray-400"
            />
            <p className="text-sm text-gray-500">
              Loading recent vehicles...
            </p>
          </div>
        ) : recent.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
              <CarFront size={24} />
            </div>

            <h3 className="font-semibold text-gray-900">
              No vehicles added yet
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Your recently added vehicles will appear here.
            </p>

            <Link
              href="/admin/add-vehicle"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0b0b0b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <Plus size={16} />
              Add First Vehicle
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Vehicle Cards */}
            <div className="divide-y divide-gray-100 lg:hidden">
              {recent.map(vehicle => (
                <div
                  key={vehicle.id}
                  className="flex min-w-0 flex-col gap-3 px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                        <CarFront size={20} />
                      </div>

                      <div className="min-w-0">
                        <p className="break-words text-sm font-semibold text-gray-900">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Vehicle #{vehicle.id}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold capitalize text-gray-700">
                      {vehicle.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pl-[52px]">
                    <p className="text-sm font-bold text-gray-900">
                      {formatPrice(vehicle.price)}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <CalendarDays size={13} />
                      {new Date(vehicle.createdAt).toLocaleDateString('en-KE')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[650px] border-collapse text-left">
                <thead className="bg-gray-50">
                  <tr className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4">Vehicle</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date Added</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {recent.map(vehicle => (
                    <tr
                      key={vehicle.id}
                      className="transition hover:bg-gray-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                            <CarFront size={20} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {vehicle.year} {vehicle.make} {vehicle.model}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              Vehicle #{vehicle.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-800">
                        {formatPrice(vehicle.price)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">
                          {vehicle.status}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(vehicle.createdAt).toLocaleDateString('en-KE')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50/60 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400">
            Showing the latest {recent.length} vehicles
          </p>

          <Link
            href="/admin/listings"
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-black"
          >
            Manage inventory
            <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="mb-4 text-base font-bold text-gray-900">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href="/admin/add-vehicle"
            className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-400 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Plus size={21} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Add a Vehicle
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Create a new inventory listing
                </p>
              </div>
            </div>

            <ArrowRight
              size={18}
              className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900"
            />
          </Link>

          <Link
            href="/admin/inquiries"
            className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-400 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <MessageSquare size={21} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Manage Inquiries
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  View and follow up with customers
                </p>
              </div>
            </div>

            <ArrowRight
              size={18}
              className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900"
            />
          </Link>
        </div>
      </section>

    </div>
  );
}
