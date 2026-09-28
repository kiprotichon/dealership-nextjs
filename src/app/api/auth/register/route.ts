import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

// POST /api/auth/register
// IMPORTANT: remove this route or protect it once your first admin user exists.
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await prisma.adminUser.create({
      data: { email, passwordHash },
      select: { id: true, email: true }
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error (email may already exist)' }, { status: 500 });
  }
}
