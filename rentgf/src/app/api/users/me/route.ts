import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-change-me";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };

    const profile = await prisma.profile.findUnique({
      where: { id: payload.id },
      select: {
        id: true, email: true, displayName: true, fullName: true, phone: true,
        dateOfBirth: true, country: true, role: true, accountStatus: true,
        profilePhotoUrl: true, emailVerified: true, createdAt: true,
        city: { select: { id: true, name: true } },
      },
    });

    if (!profile) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      user: {
        ...profile,
        // Normalize for frontend compatibility
        avatarUrl: profile.profilePhotoUrl,
        status: profile.accountStatus,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
