import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

const ALLOWED_FIELDS = [
  'make', 'model', 'year', 'price', 'mileage', 'transmission', 'fuelType',
  'bodyType', 'engine', 'condition', 'description', 'status', 'featured'
];

// PUT /api/vehicles/id/[id]  (admin only - partial update)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const data: Record<string, any> = {};
    for (const key of ALLOWED_FIELDS) {
      if (body[key] !== undefined) data[key] = body[key];
    }
    if (!Object.keys(data).length) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: Number(params.id) },
      data
    });
    return NextResponse.json(vehicle);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
  }
}

// DELETE /api/vehicles/id/[id]  (admin only)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.vehicle.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ message: 'Vehicle deleted' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
  }
}
