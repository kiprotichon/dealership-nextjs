
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CarFront,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from 'lucide-react';

import { prisma } from '@/lib/prisma';
import VehicleCard from '@/components/VehicleCard';
import SearchPanel from '@/components/SearchPanel';
import BrandScroller from '@/components/brandscroller';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Daily Bazaar | Quality Cars for Sale in Kenya',
  description:
    'Discover quality vehicles for sale at Daily Bazaar. Explore our available inventory, compare vehicles and contact our team in Nairobi.',
};

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Transparent Vehicle Information',
    description:
      'Explore vehicle details, specifications and pricing before making your decision.',
  },
  {
    icon: CheckCircle2,
    title: 'A Straightforward Buying Process',
    description:
      'Our team is available to guide you through the vehicle enquiry and purchase process.',
  },
  {
    icon: Wallet,
    title: 'Clear Pricing',
    description:
      'View listed vehicle prices and contact us when you need further clarification.',
  },
  {
    icon: MessageCircle,
    title: 'Personal Assistance',
    description:
      'Have questions about a vehicle? Get in touch with our team for assistance.',
  },
];

const buyingSteps = [
  {
    number: '01',
    title: 'Explore our inventory',
    description:
      'Browse available vehicles and compare their prices, mileage and specifications.',
  },
  {
    number: '02',
    title: 'Make an enquiry',
    description:
      'Contact our team about the vehicle you are interested in.',
  },
  {
    number: '03',
    title: 'Arrange a viewing',
    description:
      'Speak with our team to discuss the vehicle and arrange the next steps.',
  },
  {
    number: '04',
    title: 'Complete your purchase',
    description:
      'Proceed with the agreed purchase arrangements and required documentation.',
  },
];

const faqs = [
  {
    question: 'How do I find a vehicle?',
    answer:
      'Visit our inventory page to browse available vehicles. You can also use the search filters to narrow down your options by make, model, year and price.',
  },
  {
    question: 'Can I enquire about a vehicle before visiting?',
    answer:
      'Yes. Open the vehicle listing and use the enquiry or contact option to speak with our team before arranging a viewing.',
  },
  {
    question: 'Can I arrange a vehicle viewing?',
    answer:
      'Yes. Contact our team to discuss the vehicle you are interested in and arrange the next steps.',
  },
  {
    question: 'Do you accept trade-ins?',
    answer:
      'Contact our team with details of your current vehicle to discuss whether a trade-in arrangement is possible.',
  },
  {
    question: 'Do you offer vehicle financing?',
    answer:
      'Contact our team to discuss your financing enquiry and any available arrangements.',
  },
];

export default async function HomePage() {
  const [vehicles, featuredVehicles, latestVehicles] =
    await Promise.all([
      prisma.vehicle.findMany({
        where: {
          status: 'available',
        },
        select: {
          make: true,
          model: true,
          year: true,
        },
      }),

      prisma.vehicle.findMany({
        where: {
          status: 'available',
          featured: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 8,
        include: {
          images: {
            where: {
              isPrimary: true,
            },
            take: 1,
          },
        },
      }),

      prisma.vehicle.findMany({
        where: {
          status: 'available',
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 4,
        include: {
          images: {
            where: {
              isPrimary: true,
            },
            take: 1,
          },
        },
      }),
    ]);

  // Build available vehicle models and brand stock counts.
  const models: Record<string, string[]> = {};
  const counts: Record<string, number> = {};

  vehicles.forEach((vehicle) => {
    if (!models[vehicle.make]) {
      models[vehicle.make] = [];
    }

    if (!models[vehicle.make].includes(vehicle.model)) {
      models[vehicle.make].push(vehicle.model);
    }

    counts[vehicle.make] = (counts[vehicle.make] || 0) + 1;
  });

  // Sort models alphabetically.
  Object.keys(models).forEach((make) => {
    models[make].sort();
  });

  const years = Array.from(
    new Set(vehicles.map((vehicle) => vehicle.year))
  ).sort((a, b) => b - a);

  // Use the latest available vehicle with a primary image as the hero image.
  const heroImage = latestVehicles.find(
    (vehicle) => vehicle.images?.[0]?.imageUrl
  )?.images?.[0]?.imageUrl;

  return (
    <main className="overflow-hidden bg-white text-[#0b0b0b]">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="relative flex min-h-[620px] items-center overflow-hidden bg-[#0b0b0b] md:min-h-[700px]">

        {heroImage && (
          <Image
            src="/public/hero.jpeg"  
            alt="Vehicle available at Daily Bazaar"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center"
          />
        )}

        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 lg:px-12">
          <div className="max-w-3xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f0bc00]/40 bg-[#f0bc00]/10 px-4 py-2 text-sm font-semibold text-[#f0bc00]">
              <CarFront size={17} />
              Your next vehicle starts here
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Smart Deals Every Day.
              <span className="block text-[#f0bc00]">
                Drive with confidence.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-300 sm:text-lg">
              Discover quality vehicles at Daily Bazaar. Explore our
              inventory, compare your options and get in touch with
              our team to take the next step.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/inventory"
                className="inline-flex items-center justify-center gap-3 rounded-md bg-[#f0bc00] px-7 py-4 font-bold text-black transition hover:bg-[#d9a900]"
              >
                Explore inventory
                <ArrowRight size={19} />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-3 rounded-md border border-white/40 px-7 py-4 font-semibold text-white transition hover:border-[#f0bc00] hover:text-[#f0bc00]"
              >
                Contact our team
                <MessageCircle size={18} />
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-[#f0bc00]" />
                Available vehicle listings
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-[#f0bc00]" />
                Transparent information
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={17} className="text-[#f0bc00]" />
                Nairobi, Kenya
              </div>
            </div>

          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-[#f0bc00]" />
      </section>

      {/* =====================================================
          VEHICLE SEARCH
      ===================================================== */}
      <section className="relative z-20 mx-auto -mt-8 max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xl sm:p-8">

          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b58b00]">
              Find your vehicle
            </p>

            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Search our inventory
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Filter available vehicles to find something that suits your needs.
            </p>
          </div>

          <SearchPanel models={models} years={years} />

        </div>
      </section>

      {/* =====================================================
          SHOP BY BRAND
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <BrandScroller counts={counts} />
      </section>

      {/* =====================================================
          FEATURED VEHICLES
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">

        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b58b00]">
              Handpicked listings
            </p>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Featured vehicles
            </h2>

            <p className="mt-3 max-w-xl text-gray-500">
              Take a closer look at some of the vehicles highlighted in
              our inventory.
            </p>
          </div>

          <Link
            href="/inventory"
            className="inline-flex items-center gap-2 font-bold transition hover:text-[#b58b00]"
          >
            Browse all vehicles
            <ArrowRight size={18} />
          </Link>
        </div>

        {featuredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.slug}
                v={{ ...vehicle, price: vehicle.price.toString() }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
            <CarFront className="mx-auto text-gray-400" size={38} />

            <h3 className="mt-4 text-lg font-bold">
              Featured vehicles coming soon
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Explore our complete inventory to see currently available vehicles.
            </p>

            <Link
              href="/inventory"
              className="mt-5 inline-flex items-center gap-2 font-bold text-[#b58b00]"
            >
              Explore inventory
              <ArrowRight size={17} />
            </Link>
          </div>
        )}

      </section>

      {/* =====================================================
          RECENTLY ADDED VEHICLES
      ===================================================== */}
      <section className="bg-[#0b0b0b] py-20 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f0bc00]">
              Fresh from our inventory
            </p>

            <h2 className="mt-2 text-3xl font-black sm:text-4xl">
              Recently added
            </h2>

            <p className="mt-3 max-w-xl text-gray-400">
              Explore the four latest vehicles added to Daily Bazaar.
            </p>
          </div>

          {latestVehicles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {latestVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.slug}
                    v={{ ...vehicle, price: vehicle.price.toNumber() }}
                  />
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <Link
                  href="/inventory"
                  className="inline-flex items-center justify-center gap-3 rounded-md bg-[#f0bc00] px-8 py-4 font-bold text-black transition hover:bg-[#d9a900]"
                >
                  Browse all inventory
                  <ArrowRight size={19} />
                </Link>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-12 text-center">
              <CarFront className="mx-auto text-[#f0bc00]" size={38} />

              <h3 className="mt-4 text-lg font-bold">
                No recently added vehicles
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Please check back later to see our latest listings.
              </p>

              <Link
                href="/inventory"
                className="mt-6 inline-flex items-center gap-2 font-bold text-[#f0bc00]"
              >
                Browse inventory
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE DAILY BAZAAR
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">

        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b58b00]">
            The Daily Bazaar difference
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            A better way to explore your next vehicle
          </h2>

          <p className="mt-4 leading-7 text-gray-500">
            We make it easier to discover available vehicles and get the
            information you need to make your next move.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-xl border border-gray-200 bg-white p-7 transition hover:-translate-y-1 hover:border-[#f0bc00] hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f0bc00]/15 text-[#a77e00]">
                  <Icon size={25} />
                </div>

                <h3 className="mt-6 text-lg font-bold">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>

      </section>

      {/* =====================================================
          HOW TO BUY
      ===================================================== */}
      <section className="border-y border-gray-200 bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">

          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b58b00]">
              Simple steps
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              How to buy your next car
            </h2>

            <p className="mt-4 text-gray-500">
              From discovering a vehicle to making an enquiry, here is
              how to get started.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {buyingSteps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-xl border border-gray-200 bg-white p-7"
              >
                <span className="text-4xl font-black text-[#f0bc00]">
                  {step.number}
                </span>

                <h3 className="mt-5 text-lg font-bold">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =====================================================
          FINANCING AND TRADE-IN ENQUIRIES
      ===================================================== */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">

        <div className="grid overflow-hidden rounded-2xl bg-[#f0bc00] md:grid-cols-2">

          <div className="p-8 sm:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-[#f0bc00]">
              <Wallet size={25} />
            </div>

            <h2 className="mt-6 text-3xl font-black">
              Have a financing question?
            </h2>

            <p className="mt-4 max-w-lg leading-7 text-black/70">
              Need information about financing arrangements? Contact our
              team and let us know what you are looking for.
            </p>

            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-3 rounded-md bg-black px-6 py-3.5 font-bold text-white transition hover:bg-gray-800"
            >
              Make an enquiry
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="border-t border-black/10 bg-black p-8 text-white sm:p-12 md:border-l md:border-t-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f0bc00] text-black">
              <RefreshCw size={25} />
            </div>

            <h2 className="mt-6 text-3xl font-black">
              Thinking about a trade-in?
            </h2>

            <p className="mt-4 max-w-lg leading-7 text-gray-400">
              Interested in trading in your current vehicle? Share your
              details with us so we can discuss your enquiry.
            </p>

            <Link
              href="/contact"
              className="mt-7 inline-flex items-center gap-3 rounded-md bg-[#f0bc00] px-6 py-3.5 font-bold text-black transition hover:bg-[#d9a900]"
            >
              Discuss a trade-in
              <ArrowRight size={18} />
            </Link>
          </div>

        </div>

      </section>

      {/* =====================================================
          CUSTOMER FEEDBACK
      ===================================================== */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0bc00]/20 text-[#a77e00]">
            <MessageCircle size={27} />
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-[#b58b00]">
            Your experience matters
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            We would love to hear from you
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-500">
            Whether you have purchased a vehicle, made an enquiry or
            simply explored our inventory, your feedback helps us improve
            the Daily Bazaar experience.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-3 rounded-md bg-black px-7 py-4 font-bold text-white transition hover:bg-[#f0bc00] hover:text-black"
          >
            Share your feedback
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

      {/* =====================================================
          FREQUENTLY ASKED QUESTIONS
      ===================================================== */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">

        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#b58b00]">
            Need answers?
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Frequently asked questions
          </h2>

          <p className="mt-4 text-gray-500">
            Some useful information to help you get started.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-gray-200 bg-white p-5 open:border-[#f0bc00] sm:p-6"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                {faq.question}

                <ChevronRight
                  size={20}
                  className="shrink-0 text-[#b58b00] transition group-open:rotate-90"
                />
              </summary>

              <p className="mt-4 border-t border-gray-100 pt-4 text-sm leading-7 text-gray-500">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

      </section>

      {/* =====================================================
          CONTACT SECTION
      ===================================================== */}
      <section className="bg-[#0b0b0b] py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-12">

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f0bc00]">
              Get in touch
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-5xl">
              Ready to find your next vehicle?
            </h2>

            <p className="mt-5 max-w-xl leading-8 text-gray-400">
              Our team is ready to hear from you. Contact us about a
              vehicle, arrange a viewing or ask any questions about
              our inventory.
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-3 rounded-md bg-[#f0bc00] px-7 py-4 font-bold text-black transition hover:bg-[#d9a900]"
            >
              Contact Daily Bazaar
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <Phone className="text-[#f0bc00]" size={28} />

              <h3 className="mt-5 text-lg font-bold">
                Speak with us
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Have a question? Get in touch with our team through
                our contact page.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <MapPin className="text-[#f0bc00]" size={28} />

              <h3 className="mt-5 text-lg font-bold">
                Find us
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Daily Bazaar
                <br />
                Nairobi, Kenya
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <Clock className="text-[#f0bc00]" size={28} />

              <h3 className="mt-5 text-lg font-bold">
                Arrange a viewing
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Contact our team to discuss a suitable viewing
                arrangement.
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <Building2 className="text-[#f0bc00]" size={28} />

              <h3 className="mt-5 text-lg font-bold">
                Daily Bazaar
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                Quality vehicles, transparent pricing and honest service.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL INVENTORY CTA
      ===================================================== */}
      <section className="bg-[#f0bc00] px-5 py-14 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">

          <div>
            <h2 className="text-2xl font-black sm:text-3xl">
              Your next vehicle could be waiting.
            </h2>

            <p className="mt-2 text-sm text-black/70">
              Explore the Daily Bazaar inventory today.
            </p>
          </div>

          <Link
            href="/inventory"
            className="inline-flex shrink-0 items-center gap-3 rounded-md bg-black px-7 py-4 font-bold text-white transition hover:bg-gray-800"
          >
            Explore vehicles
            <ArrowRight size={18} />
          </Link>

        </div>
      </section>

    </main>
  );
}
