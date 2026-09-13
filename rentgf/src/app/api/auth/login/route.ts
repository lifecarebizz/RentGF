import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.status === "SUSPENDED" || user.status === "BLOCKED" || user.status === "DEACTIVATED") {
      return NextResponse.json({ error: "Account is not active" }, { status: 403 });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, status: user.status, displayName: user.displayName },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    return NextResponse.json({
      user: { id: user.id, email: user.email, displayName: user.displayName, fullName: user.fullName, role: user.role, status: user.status },
      token,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
