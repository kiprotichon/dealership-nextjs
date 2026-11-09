# Daily Bazaar – Vehicle Dealership Platform

A modern, full-stack vehicle dealership platform designed to make discovering, exploring and enquiring about quality vehicles easier.

**Daily Bazaar** provides customers with an online platform to browse vehicle listings, compare specifications, view vehicle galleries and submit enquiries. Administrators can manage inventory, vehicle images and customer enquiries through a secure dashboard.

**Live Website:** https://dailybazaar-five.vercel.app/

---

## Project Preview

Daily Bazaar is built with a modern, responsive interface and a premium dealership design.

**Brand Positioning:** Driven by Trust. Defined by Quality.

**Location:** Nairobi, Kenya.

---

## Key Features

### Customer Website

- Modern, responsive homepage.
- Featured and recently added vehicles.
- Vehicle inventory and search functionality.
- Vehicle filtering by make, model, year and price.
- Shop by vehicle brand.
- Individual vehicle detail pages.
- Multiple vehicle images and interactive gallery.
- Vehicle specifications and features.
- Customer enquiry forms.
- Contact page and business information.
- Responsive mobile and desktop layouts.

### Admin Dashboard

- Secure administrator authentication.
- Dashboard statistics and inventory overview.
- Add new vehicle listings.
- Edit existing vehicle information.
- Upload multiple vehicle images.
- Cloudinary image integration.
- Manage featured vehicles.
- Update vehicle availability and sales status.
- Delete vehicle listings.
- View and manage customer enquiries.

---

## Technology Stack

| Technology | Purpose |
|---|---|
| Next.js 14 | Full-stack React framework |
| React | User interface |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive design |
| Prisma ORM | Database access |
| PostgreSQL | Relational database |
| Supabase | Database hosting |
| Cloudinary | Image storage and optimization |
| JWT | Admin authentication |
| Vercel | Application hosting |
| GitHub | Source control and version management |

---

## System Architecture

The application uses a full-stack architecture in one Next.js project.

```text
                 CUSTOMERS / ADMIN
                         |
                         v
                  NEXT.JS WEBSITE
                         |
              -----------------------
              |                     |
              v                     v
         FRONTEND UI           API ROUTES
              |                     |
              |                     v
              |                 PRISMA ORM
              |                     |
              |                     v
              |              SUPABASE POSTGRESQL
              |
              v
          CLOUDINARY
        Vehicle Images

              |
              v
            VERCEL
       Application Hosting
```

### How the system works

1. Customers browse vehicle listings through the website.
2. Next.js retrieves vehicle information from PostgreSQL using Prisma.
3. Vehicle images are stored and delivered through Cloudinary.
4. Customer enquiries are submitted through API routes and stored in the database.
5. Administrators manage listings and enquiries through the admin dashboard.
6. GitHub commits trigger deployments through Vercel.

---

## Project Structure

```text
dealership-nextjs/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   └── static-assets
│
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── inventory/
│   │   ├── contact/
│   │   ├── about/
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── listings/
│   │   │   ├── add-vehicle/
│   │   │   └── inquiries/
│   │   │
│   │   └── api/
│   │       ├── vehicles/
│   │       ├── inquiries/
│   │       ├── auth/
│   │       └── upload/
│   │
│   ├── components/
│   │
│   └── lib/
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Database Architecture

The application uses Supabase PostgreSQL with Prisma ORM.

Main database models:

| Model | Description |
|---|---|
| Vehicle | Stores vehicle information and listing details |
| VehicleImage | Stores vehicle image URLs and primary image information |
| VehicleFeature | Stores individual vehicle features |
| Inquiry | Stores customer enquiries |
| AdminUser | Stores administrator account information |

The database uses relational connections to maintain relationships between vehicles, images, features and enquiries.

---

## Image Management

Daily Bazaar uses Cloudinary for vehicle image storage and delivery.

Image upload workflow:

1. Administrator selects vehicle images.
2. Images are uploaded through the application's API.
3. Cloudinary stores and optimizes the images.
4. The returned image URLs are saved in PostgreSQL.
5. The website retrieves and displays the images in vehicle listings and galleries.

---

## Customer Enquiry Management

Customers can submit enquiries through vehicle listings and contact forms.

The system stores enquiry information in PostgreSQL, allowing administrators to access and manage enquiries through the admin dashboard.

Email notifications can be integrated as an additional notification channel.

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/kiprotichon/dealership-nextjs.git

cd dealership-nextjs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

### 4. Start the development server

```bash
npm run dev
```

Open:

http://localhost:3000

---

## Deployment

Daily Bazaar uses the following production services:

| Service | Responsibility |
|---|---|
| Vercel | Hosts the Next.js application |
| Supabase | Hosts PostgreSQL database |
| Cloudinary | Stores and delivers vehicle images |
| GitHub | Stores source code and tracks changes |


---.

---

## Future Improvements

Potential enhancements include:

- Automated email notifications for new enquiries.
- Advanced vehicle comparison.
- Inventory pagination and performance improvements.
- Enhanced analytics and reporting.
- API rate limiting and additional security controls.
- Additional search engine optimization.
- Improved customer communication workflows.

---

## Developer & Credits

**Designed and Developed by Tonny Kiprotich Chumba**

Full-Stack Web Developer

### Development Contributions

- Full-stack website architecture and development.
- Responsive frontend design and implementation.
- Vehicle inventory and management system.
- Admin dashboard development.
- Authentication and API integration.
- Database design and Prisma integration.
- Cloudinary image upload integration.
- Production deployment and configuration.

### Developer Profiles

- **Portfolio:** https://tonnykip.netlify.app/
- **GitHub:** https://github.com/kiprotichon

---

## Project Information

**Project:** Daily Bazaar

**Category:** Vehicle Dealership Platform

**Location:** Nairobi, Kenya

**Status:** Production Deployment

**Website:** https://dailybazaar-five.vercel.app/

---

© 2026 Daily Bazaar. All rights reserved.

Developed by Tonny Kiprotich Chumba.