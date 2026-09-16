import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/services/email-service";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "If an account exists, a reset link will be sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.tempToken.create({
      data: { token, userId: user.id, type: "PASSWORD_RESET", expiresAt: new Date(Date.now() + 3600000) },
    });

    try {
      await sendPasswordResetEmail(email, token);
    } catch (emailError) {
      console.error("Email send failed:", emailError);
    }

    return NextResponse.json({ message: "If an account exists, a reset link will be sent" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Request failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
