import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

// GET /api/vehicles/admin/all  (admin only)
export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
      include: { images: { where: { isPrimary: true }, take: 1 } }
    });
    return NextResponse.json(vehicles);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}
