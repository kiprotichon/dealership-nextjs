import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/vehicles/[slug]  (public)
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { slug: params.slug },
      include: { images: true, features: true }
    });
    if (!vehicle) return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    return NextResponse.json(vehicle);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch vehicle' }, { status: 500 });
  }
}
