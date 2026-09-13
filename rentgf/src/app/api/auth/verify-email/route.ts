import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";


export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    const tempToken = await prisma.tempToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!tempToken || tempToken.type !== "EMAIL_VERIFY" || tempToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 });
    }

    await prisma.user.update({ where: { id: tempToken.userId }, data: { emailVerified: true } });
    await prisma.tempToken.delete({ where: { id: tempToken.id } });

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
