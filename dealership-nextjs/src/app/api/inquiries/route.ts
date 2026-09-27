import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

// POST /api/inquiries  (public)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vehicleId, customerName, phone, email, message } = body;

    if (!customerName || (!phone && !email)) {
      return NextResponse.json({ error: 'Name and at least one contact method required' }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        vehicleId: vehicleId ? Number(vehicleId) : null,
        customerName, phone, email, message
      }
    });
    return NextResponse.json(inquiry, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}

// GET /api/inquiries  (admin only)
export async function GET(req: NextRequest) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: { vehicle: { select: { make: true, model: true, year: true } } }
    });
    return NextResponse.json(inquiries);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}
