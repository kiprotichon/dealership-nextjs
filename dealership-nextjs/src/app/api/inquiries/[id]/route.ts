import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

// PUT /api/inquiries/[id]  (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = verifyAdminToken(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { status } = await req.json();
    const inquiry = await prisma.inquiry.update({
      where: { id: Number(params.id) },
      data: { status }
    });
    return NextResponse.json(inquiry);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 });
  }
}
