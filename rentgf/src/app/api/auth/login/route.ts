import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-change-me";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const profile = await prisma.profile.findUnique({ where: { email } });
    if (!profile || !profile.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, profile.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (profile.accountStatus === "SUSPENDED" || profile.accountStatus === "BANNED" || profile.accountStatus === "DEACTIVATED") {
      return NextResponse.json({ error: "Account is not active" }, { status: 403 });
    }

    const token = jwt.sign(
      { id: profile.id, email: profile.email, role: profile.role, displayName: profile.displayName },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    await prisma.profile.update({ where: { id: profile.id }, data: { lastLoginAt: new Date() } });

    return NextResponse.json({
      token,
      user: { id: profile.id, email: profile.email, displayName: profile.displayName, fullName: profile.fullName, role: profile.role },
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
