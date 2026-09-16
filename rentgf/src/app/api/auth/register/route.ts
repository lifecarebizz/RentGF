import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/services/email-service";

export async function POST(req: NextRequest) {
  try {
    const { fullName, displayName, email, phone, dateOfBirth, country, city, password, confirmPassword } = await req.json();

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
      const m = now.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
      if (age < 18) return NextResponse.json({ error: "Must be 18 years or older to register" }, { status: 400 });
    }

    const existing = await prisma.profile.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomBytes(32).toString("hex");

    // Resolve city to city UUID if provided
    let cityRecord = null;
    if (city) {
      cityRecord = await prisma.city.findFirst({ where: { name: { equals: city, mode: "insensitive" } } });
    }

    const profile = await prisma.profile.create({
      data: {
        email,
        passwordHash,
        displayName,
        fullName,
        phone: phone || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        country: country || null,
        cityId: cityRecord?.id ?? null,
        role: "CUSTOMER",
        accountStatus: "ACTIVE",
      },
    });

    await prisma.tempToken.create({
      data: { token: verifyToken, profileId: profile.id, type: "EMAIL_VERIFY", expiresAt: new Date(Date.now() + 86400000) },
    });

    try {
      await sendVerificationEmail(email, verifyToken, displayName);
    } catch (e) {
      console.error("Email send failed:", e);
    }

    const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-change-me";
    const jwtToken = require("jsonwebtoken").sign(
      { id: profile.id, email: profile.email, role: profile.role, displayName: profile.displayName },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return NextResponse.json(
      { token: jwtToken, user: { id: profile.id, email: profile.email, displayName: profile.displayName, role: profile.role } },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    const msg = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
