import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';
import { makeSlug } from '@/lib/slug';

// GET /api/vehicles?make=&status=&sort=&page=&limit=  (public)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const make = searchParams.get('make');
  const status = searchParams.get('status') || 'available';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');

  const sortMap: Record<string, any> = {
    newest: { createdAt: 'desc' },
    price_low: { price: 'asc' },
    price_high: { price: 'desc' },
    year: { year: 'desc' }
  };

  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        status,
        ...(make ? { make: { equals: make, mode: 'insensitive' } } : {})
      },
      orderBy: sortMap[sort] || sortMap.newest,
      skip: (page - 1) * limit,
      take: limit,
      include: { images: { where: { isPrimary: true }, take: 1 } }
    });
    return NextResponse.json(vehicles);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}

// POST /api/vehicles  (admin only, JSON body — image URLs uploaded separately via /api/upload)
export async function POST(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      make, model, year, price, mileage, transmission, fuelType,
      bodyType, engine, condition, description, featured, features, imageUrls
    } = body;

    const slug = makeSlug(year, make, model);

    const vehicle = await prisma.vehicle.create({
      data: {
        make, model, year: Number(year), price: Number(price),
        mileage: mileage ? Number(mileage) : null,
        transmission, fuelType, bodyType, engine, condition, description,
        featured: !!featured,
        slug,
        images: imageUrls?.length
          ? { create: imageUrls.map((url: string, i: number) => ({ imageUrl: url, isPrimary: i === 0 })) }
          : undefined,
        features: features?.length
          ? { create: features.map((f: string) => ({ featureName: f })) }
          : undefined
      },
      include: { images: true, features: true }
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
  }
}
