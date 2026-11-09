import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  CheckCircle2,
  Clock,
  FileCheck2,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="bg-white text-gray-900">

      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-black/80" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent">
              <CarFront className="h-4 w-4" />
              About Daily Bazaar
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Driven by Trust.
              <span className="block text-accent">Defined by Quality.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300 sm:text-xl">
              Welcome to Daily Bazaar, Nairobi&apos;s boutique motor vehicle
              dealership located along Ngong Road. We specialize in sourcing,
              certifying, and delivering hand-picked, high-quality foreign-used
              and brand-new vehicles for the modern Kenyan driver.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/inventory"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 font-bold text-primary transition hover:brightness-95"
              >
                Explore Our Vehicles
                <ArrowRight className="h-5 w-5" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
              >
                Contact Daily Bazaar
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-accent">
                Who We Are
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                Your next vehicle should come with confidence.
              </h2>

              <p className="mt-6 leading-8 text-gray-600">
                At Daily Bazaar, we understand that buying a vehicle is more
                than choosing a make and model. It is an important investment,
                and the process should be clear, straightforward, and
                reassuring from the first enquiry to the final handover.
              </p>

              <p className="mt-4 leading-8 text-gray-600">
                Whether you are looking for an agile, fuel-efficient hatchback
                for everyday Nairobi commuting, a rugged 4x4 for long road
                trips, or a high-performance vehicle, our goal is to connect
                you with quality vehicles suited to your needs and lifestyle.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-primary">
                      Quality Focused
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Carefully selected vehicles with quality at the centre.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Users className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-primary">
                      Client First
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-gray-500">
                      Personal guidance throughout your buying journey.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Visual panel */}
            <div className="relative">
              <div className="rounded-2xl bg-primary p-8 shadow-xl sm:p-10">

                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-primary">
                  <CarFront className="h-8 w-8" />
                </div>

                <p className="text-sm font-bold uppercase tracking-widest text-accent">
                  Daily Bazaar
                </p>

                <h3 className="mt-3 text-3xl font-extrabold text-white">
                  Quality vehicles.
                  <br />
                  Honest service.
                </h3>

                <p className="mt-5 leading-7 text-gray-300">
                  We aim to make your vehicle-buying experience transparent,
                  informed, and hassle-free.
                </p>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <MapPin className="h-5 w-5 text-accent" />
                    Ngong Road, Nairobi, Kenya
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-accent">
              The Daily Bazaar Promise
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              What you can expect from us
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              We focus on making the vehicle-buying process simple,
              transparent, and tailored to every client.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* Card 1 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Sparkles className="h-7 w-7" />
              </div>

              <h3 className="mt-6 text-xl font-bold text-primary">
                Hand-Picked Excellence
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We don&apos;t just clear cars. We source vehicles with a focus
                on verified mileage, accident history, and mechanical
                condition.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  Carefully selected vehicles
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  Verified vehicle information
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  Quality-focused selection
                </div>
              </div>

            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <FileCheck2 className="h-7 w-7" />
              </div>

              <h3 className="mt-6 text-xl font-bold text-primary">
                Absolute Transparency
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                We believe you should understand the vehicle you are buying
                and the process involved before making your decision.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  Genuine vehicle documentation
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  Clear vehicle information
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  Straightforward transactions
                </div>
              </div>

            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <BadgeCheck className="h-7 w-7" />
              </div>

              <h3 className="mt-6 text-xl font-bold text-primary">
                Tailored Client Delivery
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Every buyer has different needs. Our team helps you navigate
                the options and make a decision that fits your lifestyle.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  Personal assistance
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  Test-drive guidance
                </div>

                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  Support through the buying process
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Buying Experience */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-accent">
                Your Buying Experience
              </p>

              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                From browsing to driving away.
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                Our approach is designed to keep the vehicle-buying process
                straightforward. Browse our available vehicles, ask questions,
                arrange a viewing, and get the assistance you need before
                making your purchase.
              </p>

              <div className="mt-8 space-y-5">

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-primary">
                    1
                  </div>

                  <div>
                    <h3 className="font-bold text-primary">
                      Explore
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Browse our available vehicles and find models that match
                      your needs.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-primary">
                    2
                  </div>

                  <div>
                    <h3 className="font-bold text-primary">
                      Enquire
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Get more information and speak with our team about the
                      vehicle you are interested in.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-primary">
                    3
                  </div>

                  <div>
                    <h3 className="font-bold text-primary">
                      View & Decide
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Arrange a viewing, inspect the vehicle, and make an
                      informed decision.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-bold text-primary">
                    4
                  </div>

                  <div>
                    <h3 className="font-bold text-primary">
                      Drive Away
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Complete the necessary process and get ready for the
                      road.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="rounded-2xl bg-primary p-8 sm:p-10">
              <Star className="h-10 w-10 text-accent" />

              <h3 className="mt-6 text-2xl font-extrabold text-white">
                A dealership experience built around you.
              </h3>

              <p className="mt-4 leading-7 text-gray-300">
                Whether you already know the exact vehicle you want or you are
                still comparing your options, our team is here to help you
                navigate the process with clarity and confidence.
              </p>

              <Link
                href="/inventory"
                className="mt-8 inline-flex items-center gap-2 font-bold text-accent transition hover:gap-3"
              >
                View available vehicles
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Showroom */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="rounded-2xl bg-primary p-8 text-white shadow-xl sm:p-10 lg:p-12">

            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-accent">
                  Visit Our Showroom
                </p>

                <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                  Experience Daily Bazaar in person.
                </h2>

                <p className="mt-5 max-w-2xl leading-8 text-gray-300">
                  Experience a transparent, hassle-free car buying journey at
                  our location along Ngong Road, Nairobi.
                </p>
              </div>

              <Link
                href="https://maps.app.goo.gl/CowR3S71fgrVZDjd8"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 font-bold text-primary transition hover:brightness-95"
              >
                Get Directions
                <ArrowRight className="h-5 w-5" />
              </Link>

            </div>

            <div className="mt-10 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Location
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    Ngong Road, Nairobi, Kenya
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-accent" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Opening Hours
                  </p>
                  <p className="mt-1 text-sm font-medium text-white">
                    Monday – Saturday
                  </p>
                  <p className="text-sm text-gray-300">
                    6:00 AM – 6:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-accent" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Direct Line
                  </p>

                  <a
                    href="tel:+254715455098"
                    className="mt-1 block text-sm font-medium text-white hover:text-accent"
                  >
                    +254 715 455 098
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
            <CarFront className="h-7 w-7" />
          </div>

          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
            Ready to find your next vehicle?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-600">
            Browse our current inventory or get in touch with Daily Bazaar
            today. We&apos;re here to help you find the right vehicle with
            confidence.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link
              href="/inventory"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-bold text-white transition hover:opacity-90"
            >
              Browse Inventory
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href="https://wa.me/254715455098?text=Hi%20Daily%20Bazaar%2C%20I%27d%20like%20to%20enquire%20about%20a%20vehicle"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-6 py-3.5 font-bold text-primary transition hover:border-accent hover:text-accent"
            >
              Talk to Us
            </a>

          </div>

        </div>
      </section>

    </main>
  );
}