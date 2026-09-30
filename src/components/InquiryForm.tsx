'use client';

import { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';

interface InquiryFormProps {
  vehicleId?: number;
  /** Show as a button that opens a modal (default true). Set false for always-visible form. */
  asModal?: boolean;
  buttonLabel?: string;
  className?: string;
}

export default function InquiryForm({
  vehicleId,
  asModal = true,
  buttonLabel = 'Inquire about this car',
  className = ''
}: InquiryFormProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const form = e.currentTarget;
    const payload = {
      vehicleId: vehicleId || null,
      customerName: (form.elements.namedItem('customerName') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value
    };

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      setStatus({ ok: true, msg: 'Thank you! We will contact you shortly.' });
      form.reset();
      // Auto-close modal after success
      setTimeout(() => {
        setOpen(false);
        setStatus(null);
      }, 2000);
    } catch {
      setStatus({ ok: false, msg: 'Something went wrong. Please try WhatsApp instead.' });
    } finally {
      setSubmitting(false);
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="customerName"
        type="text"
        placeholder="Your name"
        required
        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone number"
        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <textarea
        name="message"
        rows={3}
        placeholder="I'd like to schedule a viewing..."
        className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
      />
      <button type="submit" disabled={submitting} className="btn w-full">
        {submitting ? 'Submitting...' : 'Submit Inquiry'}
      </button>
      {status && (
        <p className={`text-sm text-center ${status.ok ? 'text-green-600' : 'text-red-600'}`}>
          {status.msg}
        </p>
      )}
    </form>
  );

  // Always-visible mode (legacy)
  if (!asModal) {
    return <div className={className}>{formContent}</div>;
  }

  return (
    <div className={className}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn w-full flex items-center justify-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        {buttonLabel}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-primary">Request more info</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {formContent}
          </div>
        </div>
      )}
    </div>
  );
}
