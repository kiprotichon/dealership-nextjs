# Dealership Website — Next.js + TypeScript + Prisma + PostgreSQL

Full-stack app in one project: pages, API routes, and database access all live together.

## Structure

```
dealership-nextjs/
├── prisma/
│   └── schema.prisma        # Vehicle, VehicleImage, VehicleFeature, Inquiry, AdminUser models
├── src/
│   ├── app/
│   │   ├── page.tsx                    Homepage (featured vehicles)
│   │   ├── inventory/page.tsx          Inventory listing (sort/filter)
│   │   ├── inventory/[slug]/page.tsx   Vehicle detail + inquiry form
│   │   ├── contact/page.tsx
│   │   ├── admin/
│   │   │   ├── login/page.tsx
│   │   │   ├── dashboard/page.tsx      Stats overview
│   │   │   ├── listings/page.tsx       Mark sold/reserved, feature, delete
│   │   │   ├── add-vehicle/page.tsx    Form + multi-photo upload
│   │   │   └── inquiries/page.tsx      Manage customer inquiries
│   │   └── api/
│   │       ├── vehicles/route.ts               GET (public list), POST (admin create)
│   │       ├── vehicles/[slug]/route.ts        GET single vehicle (public)
│   │       ├── vehicles/id/[id]/route.ts       PUT/DELETE (admin)
│   │       ├── vehicles/admin/all/route.ts     GET all statuses (admin)
│   │       ├── vehicles/admin/stats/route.ts   GET dashboard counts (admin)
│   │       ├── inquiries/route.ts              POST (public), GET (admin)
│   │       ├── inquiries/[id]/route.ts         PUT status (admin)
│   │       ├── auth/login/route.ts
│   │       ├── auth/register/route.ts          remove/protect after first use
│   │       └── upload/route.ts                 Cloudinary image upload (admin)
│   ├── components/          Navbar, Footer, VehicleCard, VehicleGallery, InquiryForm,
│   │                        AdminSidebar, InventoryFilters
│   └── lib/                 prisma.ts, auth.ts, cloudinary.ts, slug.ts, useAdminAuth.ts
```

## Setup

```bash
cd dealership-nextjs
cp .env.example .env
# fill in DATABASE_URL, JWT_SECRET, CLOUDINARY_* keys
npm install
npm run migrate      # creates all tables via Prisma Migrate
npm run dev          # http://localhost:3000
```

### Create your first admin user

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"yourpassword"}'
```

Then remove or protect the `/api/auth/register` route.

### Admin dashboard
Go to `/admin/login`, sign in, and you'll land on `/admin/dashboard`: stats, listings management, the add-vehicle form (uploads straight to Cloudinary, then creates the vehicle), and inquiries.

## Why this stack
- **Next.js App Router** — pages and API routes in one project; vehicle pages are server-rendered for SEO (important since people search "2021 Toyota Harrier Kenya" directly on Google)
- **TypeScript** — catches field-name typos and shape mismatches at compile time, especially valuable across all the vehicle/inquiry forms
- **Prisma** — type-safe queries and schema migrations, replacing hand-written SQL
- **PostgreSQL** — same relational fit as before: vehicles, images, and features as related tables

## Deploying
- **App** → Vercel (native fit for Next.js)
- **Database** → Vercel Postgres, Supabase, Neon, or Render Postgres — set `DATABASE_URL` in Vercel's environment variables
- **Images** → Cloudinary (same free-tier setup as before)

## What's stubbed vs. real
Routes, pages, schema, and auth are fully functional — not placeholders. Still worth adding as you go:
- Real hero/placeholder images in `public/` (currently referenced but not included)
- Pagination on the inventory page (API already supports `page`/`limit` params if you extend the page query)
- Input validation with `zod` (already a dependency) on the API routes for production hardening
- Rate limiting on public routes (`/api/inquiries`, `/api/auth/login`)
