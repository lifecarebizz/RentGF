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

    const companionProfile = await prisma.companionProfile.findUnique({
      where: { profileId: payload.id },
      include: {
        profile: {
          select: { id: true, displayName: true, email: true, profilePhotoUrl: true },
        },
      },
    });

    if (!companionProfile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    return NextResponse.json({
      profile: {
        ...companionProfile,
        user: {
          id: companionProfile.profile.id,
          displayName: companionProfile.profile.displayName,
          email: companionProfile.profile.email,
          avatarUrl: companionProfile.profile.profilePhotoUrl,
        },
        averageRating: companionProfile.avgRating ? Number(companionProfile.avgRating) : null,
        reviewCount: companionProfile.totalReviews,
        totalBookings: companionProfile.totalBookings,
        totalEarnings: Number(companionProfile.totalEarnings),
        startingPrice: companionProfile.startingPrice ? Number(companionProfile.startingPrice) : 0,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
