import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.substring(7);
    const payload = jwt.verify(token, JWT_SECRET) as any;

    const { email, currentPassword, newPassword } = await req.json();

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || user.email !== email) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (user.passwordHash) {
      const isValid = await require("bcryptjs").compare(currentPassword, user.passwordHash);
      if (!isValid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    const passwordHash = await require("bcryptjs").hash(newPassword, 12);
    await prisma.user.update({ where: { id: payload.id }, data: { passwordHash } });

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
