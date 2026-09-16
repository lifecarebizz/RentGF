import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/services/email-service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, displayName, email, phone, dateOfBirth, country, city, password, confirmPassword } = body;

    if (!fullName || !displayName || !email || !password) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const now = new Date();
      let age = now.getFullYear() - dob.getFullYear();
      const monthDiff = now.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age--;
      if (age < 18) {
        return NextResponse.json({ error: "Must be 18 years or older to register" }, { status: 400 });
      }
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        displayName,
        fullName,
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        country: country || null,
        city: city || null,
        role: "CUSTOMER",
      },
    });

    await prisma.customerProfile.create({ data: { userId: user.id } });

    await prisma.tempToken.create({
      data: { token: verifyToken, userId: user.id, type: "EMAIL_VERIFY", expiresAt: new Date(Date.now() + 86400000) },
    });

    try {
      await sendVerificationEmail(email, verifyToken, displayName);
    } catch (emailError) {
      console.error("Email send failed:", emailError);
    }

    return NextResponse.json({ user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role } }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
