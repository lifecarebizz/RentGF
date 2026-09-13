import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import bcrypt from "bcryptjs";
import crypto from "crypto";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, newPassword, confirmPassword } = body;

    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    const tempToken = await prisma.tempToken.findUnique({ where: { token } });
    if (!tempToken || tempToken.type !== "PASSWORD_RESET" || tempToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: tempToken.userId }, data: { passwordHash } });
    await prisma.tempToken.delete({ where: { id: tempToken.id } });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Password reset failed" }, { status: 500 });
  }
}
