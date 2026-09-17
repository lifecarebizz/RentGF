export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-change-me";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { role: string };
    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const verificationStatus = searchParams.get("verificationStatus");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (verificationStatus) where.verificationStatus = verificationStatus;

    const [companions, total] = await Promise.all([
      prisma.companionProfile.findMany({
        where, skip, take: limit,
        include: {
          profile: { select: { id: true, displayName: true, email: true, profilePhotoUrl: true, accountStatus: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.companionProfile.count({ where }),
    ]);

    const normalized = companions.map((c) => ({
      ...c,
      user: { id: c.profile.id, displayName: c.profile.displayName, email: c.profile.email, avatarUrl: c.profile.profilePhotoUrl },
    }));

    return NextResponse.json({ companions: normalized, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
