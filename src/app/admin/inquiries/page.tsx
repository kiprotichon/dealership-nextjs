
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  MessageSquare,
  Search,
  RefreshCw,
  Trash2,
  Phone,
  Mail,
  CarFront,
  CheckCircle2,
  AlertCircle,
  Inbox,
  UserRound
} from 'lucide-react';
import { useAdminAuth } from '@/lib/useAdminAuth';

interface InquiryRow {
  id: number;
  customerName: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  status: string;
  vehicle: {
    make: string;
    model: string;
    year: number;
  } | null;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'viewing_scheduled', label: 'Viewing Scheduled' },
  { value: 'closed', label: 'Closed' }
];

function statusLabel(status: string) {
  return (
    STATUS_OPTIONS.find(option => option.value === status)?.label ||
    status.replace(/_/g, ' ')
  );
}

function statusStyle(status: string) {
  return 'bg-gray-100 text-gray-700 ring-gray-200';
}

export default function InquiriesPage() {
  const { ready, authFetch } = useAdminAuth();

  const [inquiries, setInquiries] = useState<InquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState<number | null>(null);

  useEffect(() => {
    if (!ready) return;

    let cancelled = false;

    async function loadInquiries() {
      setLoading(true);
      setError('');

      try {
        const response = await authFetch('/api/inquiries');

        if (!response.ok) {
          throw new Error('Unable to load customer inquiries.');
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Unexpected response from the server.');
        }

        if (!cancelled) {
          setInquiries(data);
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

    loadInquiries();

    return () => {
      cancelled = true;
    };
  }, [ready]);

  async function updateStatus(id: number, status: string) {
    setBusyId(id);
    setError('');
    setNotice('');

    try {
      const response = await authFetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update inquiry status.');
      }

      setInquiries(current =>
        current.map(inquiry =>
          inquiry.id === id ? { ...inquiry, status } : inquiry
        )
      );

      setNotice('Inquiry status updated successfully.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not update inquiry.'
      );
    } finally {
      setBusyId(null);
    }
  }

  async function deleteInquiry(id: number) {
    const inquiry = inquiries.find(item => item.id === id);

    if (!inquiry) return;

    const confirmed = window.confirm(
      `Permanently delete the inquiry from ${inquiry.customerName}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setBusyId(id);
    setError('');
    setNotice('');

    try {
      const response = await authFetch(`/api/inquiries/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || 'Failed to delete inquiry.');
      }

      setInquiries(current =>
        current.filter(item => item.id !== id)
      );

      setNotice('Customer inquiry deleted successfully.');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not delete inquiry.'
      );
    } finally {
      setBusyId(null);
    }
  }

  const filteredInquiries = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) return inquiries;

    return inquiries.filter(inquiry => {
      const vehicle = inquiry.vehicle
        ? `${inquiry.vehicle.year} ${inquiry.vehicle.make} ${inquiry.vehicle.model}`
        : '';

      return [
        inquiry.customerName,
        inquiry.phone || '',
        inquiry.email || '',
        inquiry.message || '',
        vehicle,
        inquiry.status
      ].some(value => value.toLowerCase().includes(term));
    });
  }, [inquiries, search]);

  if (!ready) return null;

  return (
    <div className="w-full min-w-0 space-y-6">

      {/* Heading */}
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <MessageSquare size={15} className="text-gray-600" />
          Customer Management
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-[#0b0b0b] sm:text-3xl">
          Customer Inquiries
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View customer requests, manage follow-ups and track inquiry progress.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Total Inquiries</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {inquiries.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">New</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {inquiries.filter(i => i.status === 'new').length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Contacted</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {inquiries.filter(i => i.status === 'contacted').length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500">Closed</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {inquiries.filter(i => i.status === 'closed').length}
          </p>
        </div>

      </div>

      {/* Search and Refresh */}
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
            placeholder="Search customer, phone, email or vehicle..."
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
          <p className="text-sm text-gray-500">
            Loading customer inquiries...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredInquiries.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-16 text-center shadow-sm">
          <Inbox size={40} className="mx-auto mb-3 text-gray-300" />

          <h3 className="font-semibold text-gray-900">
            {search ? 'No matching inquiries' : 'No inquiries yet'}
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            {search
              ? 'Try searching with a different name, email or vehicle.'
              : 'Customer inquiries will appear here when someone contacts your dealership.'}
          </p>
        </div>
      )}

      {/* Mobile and Tablet Inquiry Cards */}
      {!loading && filteredInquiries.length > 0 && (
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:hidden">
          {filteredInquiries.map(inquiry => (
            <div
              key={inquiry.id}
              className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >

              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                    <UserRound size={21} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="break-words font-bold text-gray-900">
                      {inquiry.customerName}
                    </h3>
                    <p className="text-xs text-gray-400">
                      Inquiry #{inquiry.id}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${statusStyle(inquiry.status)}`}
                >
                  {statusLabel(inquiry.status)}
                </span>
              </div>

              {/* Contact Details */}
              <div className="mt-4 space-y-2">
                {inquiry.phone && (
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="flex min-w-0 items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Phone size={15} className="shrink-0 text-gray-400" />
                    <span className="break-all">{inquiry.phone}</span>
                  </a>
                )}

                {inquiry.email && (
                  <a
                    href={`mailto:${inquiry.email}`}
                    className="flex min-w-0 items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <Mail size={15} className="shrink-0 text-gray-400" />
                    <span className="break-all">{inquiry.email}</span>
                  </a>
                )}
              </div>

              {/* Vehicle */}
              {inquiry.vehicle && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-gray-50 p-3">
                  <CarFront size={17} className="mt-0.5 shrink-0 text-gray-400" />

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                      Vehicle of Interest
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-800">
                      {inquiry.vehicle.year} {inquiry.vehicle.make}{' '}
                      {inquiry.vehicle.model}
                    </p>
                  </div>
                </div>
              )}

              {/* Message */}
              {inquiry.message && (
                <div className="mt-4">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Customer Message
                  </p>
                  <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                    {inquiry.message}
                  </p>
                </div>
              )}

              {/* Status Control */}
              <div className="mt-4 border-t border-gray-100 pt-4">
                <label className="mb-1.5 block text-xs font-medium text-gray-500">
                  Update Inquiry Status
                </label>

                <select
                  value={inquiry.status}
                  disabled={busyId === inquiry.id}
                  onChange={e => updateStatus(inquiry.id, e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm outline-none focus:border-gray-500 disabled:opacity-50"
                >
                  {STATUS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => deleteInquiry(inquiry.id)}
                  disabled={busyId === inquiry.id}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {busyId === inquiry.id ? 'Please wait...' : 'Delete Inquiry'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop Table */}
      {!loading && filteredInquiries.length > 0 && (
        <div className="hidden min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:block">

          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="font-semibold text-gray-900">
              Inquiry Records
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {filteredInquiries.length} customer inquiries
            </p>
          </div>

          <div className="w-full max-w-full overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Customer</th>
                  <th className="px-5 py-4 font-semibold">Contact</th>
                  <th className="px-5 py-4 font-semibold">Vehicle</th>
                  <th className="px-5 py-4 font-semibold">Message</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredInquiries.map(inquiry => (
                  <tr
                    key={inquiry.id}
                    className="align-top transition hover:bg-gray-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                          <UserRound size={17} />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {inquiry.customerName}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400">
                            Inquiry #{inquiry.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="max-w-[200px] px-5 py-4">
                      <div className="space-y-2 text-xs text-gray-600">
                        {inquiry.phone && (
                          <a
                            href={`tel:${inquiry.phone}`}
                            className="flex items-center gap-2 hover:text-gray-900"
                          >
                            <Phone size={13} />
                            <span className="break-all">{inquiry.phone}</span>
                          </a>
                        )}

                        {inquiry.email && (
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="flex items-center gap-2 hover:text-gray-900"
                          >
                            <Mail size={13} />
                            <span className="break-all">{inquiry.email}</span>
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {inquiry.vehicle ? (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CarFront size={17} className="shrink-0 text-gray-400" />
                          <span>
                            {inquiry.vehicle.year} {inquiry.vehicle.make}{' '}
                            {inquiry.vehicle.model}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">General inquiry</span>
                      )}
                    </td>

                    <td className="max-w-[260px] px-5 py-4">
                      <p className="whitespace-pre-wrap break-words text-sm leading-5 text-gray-600">
                        {inquiry.message || 'No message provided'}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={inquiry.status}
                        disabled={busyId === inquiry.id}
                        onChange={e =>
                          updateStatus(inquiry.id, e.target.value)
                        }
                        className="max-w-[170px] rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium outline-none focus:border-gray-500 disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => deleteInquiry(inquiry.id)}
                          disabled={busyId === inquiry.id}
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
            Customer inquiry records and follow-up status.
          </div>
        </div>
      )}

    </div>
  );
}
