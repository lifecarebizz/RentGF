import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import crypto from "crypto";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "If an account exists, a reset link will be sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.tempToken.create({
      data: { token, userId: user.id, type: "PASSWORD_RESET", expiresAt: new Date(Date.now() + 3600000) },
    });

    // In production, send email here
    console.log(`Password reset token for ${email}: ${token}`);

    return NextResponse.json({ message: "If an account exists, a reset link will be sent" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
