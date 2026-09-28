import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

// GET /api/vehicles/admin/stats  (admin only)
export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [total, available, sold, newInquiries] = await Promise.all([
      prisma.vehicle.count(),
      prisma.vehicle.count({ where: { status: 'available' } }),
      prisma.vehicle.count({ where: { status: 'sold' } }),
      prisma.inquiry.count({ where: { status: 'new' } })
    ]);

    return NextResponse.json({ total, available, sold, newInquiries });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
