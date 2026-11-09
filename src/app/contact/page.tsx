
'use client';

import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ArrowUpRight,
  Navigation,
  Send,
} from 'lucide-react';
import type { FormEvent } from 'react';

const WHATSAPP_NUMBER = '254715455098';

export default function ContactPage() {
  function handleInquirySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get('name');
    const phone = formData.get('phone');
    const email = formData.get('email');
    const enquiryType = formData.get('enquiryType');
    const vehicle = formData.get('vehicle');
    const message = formData.get('message');

    const whatsappMessage = `
Hello Daily Bazaar,

I would like to make an enquiry.

Name: ${name}
Phone: ${phone}
Email: ${email || 'Not provided'}
Enquiry Type: ${enquiryType}
Vehicle of Interest: ${vehicle || 'Not specified'}

Message:
${message}
    `.trim();

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    event.currentTarget.reset();
  }

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="bg-primary px-5 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-accent">
            Contact Daily Bazaar
          </p>

          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
            Let's Find the Right Vehicle for You.
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base">
            Looking for your next car? Have questions about our vehicles?
            Send us an enquiry and our team will be happy to assist.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#vehicle-enquiry"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-primary transition hover:bg-yellow-400"
            >
              Make an Enquiry
              <ArrowUpRight size={18} />
            </a>

            <a
              href="https://wa.me/254715455098"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* Contact details */}
      <section className="px-5 py-14 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
          <a
            href="tel:+254715455098"
            className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-accent">
              <Phone size={22} />
            </div>
            <h2 className="font-bold text-primary">Call Our Team</h2>
            <p className="mt-2 text-sm text-gray-600">
              +254 715 455 098
            </p>
            <p className="mt-3 text-sm font-semibold text-primary">
              Call us <ArrowUpRight className="inline" size={15} />
            </p>
          </a>

          <a
            href="mailto:dailybazaarltd@gmail.com"
            className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-accent">
              <Mail size={22} />
            </div>
            <h2 className="font-bold text-primary">Email Us</h2>
            <p className="mt-2 break-all text-sm text-gray-600">
              dailybazaarltd@gmail.com
            </p>
            <p className="mt-3 text-sm font-semibold text-primary">
              Send an email <ArrowUpRight className="inline" size={15} />
            </p>
          </a>

          <a
            href="https://wa.me/254715455098"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-gray-200 p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-accent">
              <MessageCircle size={22} />
            </div>
            <h2 className="font-bold text-primary">WhatsApp</h2>
            <p className="mt-2 text-sm text-gray-600">
              Chat directly with our team.
            </p>
            <p className="mt-3 text-sm font-semibold text-primary">
              Start chatting <ArrowUpRight className="inline" size={15} />
            </p>
          </a>
        </div>
      </section>

      {/* Enquiry form */}
      <section
        id="vehicle-enquiry"
        className="scroll-mt-24 bg-gray-50 px-5 py-16 sm:py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-accent">
              Vehicle Enquiry
            </p>

            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-primary">
              Tell Us What You're Looking For.
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-600">
              Complete the enquiry form with a few details about yourself
              and the vehicle you're interested in. Your enquiry will be
              prepared as a WhatsApp message for our team.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-accent">
                  <Clock size={21} />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Business Hours</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Monday – Saturday
                  </p>
                  <p className="text-sm text-gray-600">
                    6:00 AM – 6:00 PM
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-accent">
                  <MapPin size={21} />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Visit Our Showroom</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Ngong Road, Nairobi, Kenya
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-9 rounded-xl border border-yellow-200 bg-yellow-50 p-5">
              <h3 className="font-bold text-primary">
                Need a quick response?
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                You can also contact our team directly through WhatsApp.
              </p>
              <a
                href="https://wa.me/254715455098"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-yellow-700"
              >
                <MessageCircle size={17} />
                Chat on WhatsApp
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-7">
              <h3 className="text-xl font-extrabold text-primary">
                Send an Enquiry
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Fill in the details below. Fields marked with * are required.
              </p>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+254 7XX XXX XXX"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              <div>
                <label
                  htmlFor="enquiryType"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  What can we help you with? *
                </label>
                <select
                  id="enquiryType"
                  name="enquiryType"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                >
                  <option value="" disabled>
                    Select an enquiry type
                  </option>
                  <option value="Vehicle purchase">Buying a vehicle</option>
                  <option value="Vehicle availability">Vehicle availability</option>
                  <option value="Financing enquiry">Financing enquiry</option>
                  <option value="Trade-in enquiry">Trade-in enquiry</option>
                  <option value="Test drive">Booking a test drive</option>
                  <option value="General enquiry">General enquiry</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="vehicle"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Vehicle of Interest
                </label>
                <input
                  id="vehicle"
                  name="vehicle"
                  type="text"
                  placeholder="e.g. Toyota Harrier 2020"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us more about what you're looking for..."
                  className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 text-sm font-bold text-white transition hover:bg-gray-800"
              >
                <Send size={17} className="text-accent" />
                Send Enquiry via WhatsApp
              </button>

              <p className="text-center text-xs leading-5 text-gray-500">
                Your enquiry will open in WhatsApp. Review the message and
                press Send to contact Daily Bazaar.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-accent">
                Find Us
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-primary sm:text-3xl">
                Visit Our Showroom
              </h2>
              <p className="mt-3 text-sm text-gray-600">
                Find Daily Bazaar on Ngong Road, Nairobi, Kenya.
              </p>
            </div>

            <a
              href="https://maps.app.goo.gl/CowR3S71fgrVZDjd8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-primary transition hover:bg-yellow-400"
            >
              <Navigation size={17} />
              Get Directions
              <ArrowUpRight size={16} />
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
            <iframe
              title="Daily Bazaar location on Google Maps"
              src="https://www.google.com/maps?q=Ngong+Road,+Nairobi,+Kenya&output=embed"
              width="100%"
              height="420"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 pb-16">
        <div className="mx-auto max-w-5xl rounded-2xl bg-primary px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-extrabold sm:text-3xl">
            Your Next Vehicle Could Be Here.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-300">
            Explore our available vehicles and get in touch with our team
            when you find something you like.
          </p>
          <Link
            href="/inventory"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-primary transition hover:bg-yellow-400"
          >
            Browse Our Inventory
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
