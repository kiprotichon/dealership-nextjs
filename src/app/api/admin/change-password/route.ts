import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyAdminToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const admin = verifyAdminToken(req);

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const adminUser = await prisma.adminUser.findUnique({
      where: {
        id: admin.id,
      },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: "Admin account not found" },
        { status: 404 }
      );
    }

    const passwordValid = await bcrypt.compare(
      currentPassword,
      adminUser.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.adminUser.update({
      where: {
        id: admin.id,
      },
      data: {
        passwordHash,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}