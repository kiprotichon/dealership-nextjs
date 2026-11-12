
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/lib/auth';

// Validate inquiry ID
function getInquiryId(id: string) {
  const inquiryId = Number(id);

  if (!Number.isInteger(inquiryId) || inquiryId <= 0) {
    return null;
  }

  return inquiryId;
}

// PUT /api/inquiries/[id] (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = verifyAdminToken(req);

  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const id = getInquiryId(params.id);

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid inquiry ID' },
        { status: 400 }
      );
    }

    const { status } = await req.json();

    const allowedStatuses = [
      'new',
      'contacted',
      'viewing_scheduled',
      'closed'
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid inquiry status' },
        { status: 400 }
      );
    }

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(inquiry);
  } catch (err: any) {
    console.error('Update inquiry error:', err);

    if (err.code === 'P2025') {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update inquiry' },
      { status: 500 }
    );
  }
}

// DELETE /api/inquiries/[id] (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = verifyAdminToken(req);

  if (!admin) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const id = getInquiryId(params.id);

    if (!id) {
      return NextResponse.json(
        { error: 'Invalid inquiry ID' },
        { status: 400 }
      );
    }

    await prisma.inquiry.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Inquiry deleted successfully'
    });
  } catch (err: any) {
    console.error('Delete inquiry error:', err);

    if (err.code === 'P2025') {
      return NextResponse.json(
        { error: 'Inquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}
