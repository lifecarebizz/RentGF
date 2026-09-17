export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-change-me";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string; role: string };

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status") || undefined;

    // Customer sees their bookings; companion sees bookings they're involved in
    const where =
      payload.role === "COMPANION"
        ? { companionProfile: { profileId: payload.id }, ...(status ? { status } : {}) }
        : { customerProfileId: payload.id, ...(status ? { status } : {}) };

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          companionProfile: {
            include: { profile: { select: { id: true, displayName: true, profilePhotoUrl: true } } },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    const normalized = bookings.map((b) => ({
      id: b.id,
      bookingDate: b.scheduledDate,
      startTime: b.scheduledTime,
      durationMinutes: Math.round(Number(b.durationHours) * 60),
      activityType: b.activityType,
      status: b.status,
      totalAmount: Number(b.totalAmount),
      createdAt: b.createdAt,
      companion: {
        user: {
          displayName: b.companionProfile.profile.displayName,
          avatarUrl: b.companionProfile.profile.profilePhotoUrl,
        },
      },
    }));

    return NextResponse.json({ bookings: normalized, total });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
