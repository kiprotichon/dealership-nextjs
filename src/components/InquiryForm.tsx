'use client';

import { useState } from 'react';

export default function InquiryForm({ vehicleId }: { vehicleId: number }) {
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    const form = e.currentTarget;
    const payload = {
      vehicleId,
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
    } catch {
      setStatus({ ok: false, msg: 'Something went wrong. Please try WhatsApp instead.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input name="customerName" type="text" placeholder="Your name" required className="w-full p-3 mb-3 border rounded-lg" />
      <input name="phone" type="tel" placeholder="Phone number" className="w-full p-3 mb-3 border rounded-lg" />
      <input name="email" type="email" placeholder="Email" className="w-full p-3 mb-3 border rounded-lg" />
      <textarea name="message" rows={3} placeholder="I'd like to schedule a viewing..." className="w-full p-3 mb-3 border rounded-lg" />
      <button type="submit" disabled={submitting} className="btn w-full">
        {submitting ? 'Submitting...' : 'Submit Inquiry'}
      </button>
      {status && (
        <p className={`mt-2 text-sm ${status.ok ? 'text-green-600' : 'text-red-600'}`}>{status.msg}</p>
      )}
    </form>
  );
}
