import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-change-me";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string };

    const favorites = await prisma.favorite.findMany({
      where: { customerProfileId: payload.id },
      orderBy: { createdAt: "desc" },
      include: {
        companion: {
          include: {
            profile: { select: { id: true, displayName: true, profilePhotoUrl: true } },
          },
        },
      },
    });

    const normalized = favorites.map((f) => ({
      id: f.id,
      createdAt: f.createdAt,
      companion: {
        id: f.companion.id,
        city: f.companion.city,
        startingPrice: Number(f.companion.startingPrice ?? 0),
        averageRating: f.companion.avgRating ? Number(f.companion.avgRating) : null,
        reviewCount: f.companion.totalReviews,
        verificationStatus: f.companion.verificationStatus,
        interests: f.companion.interests,
        user: {
          id: f.companion.profile.id,
          displayName: f.companion.profile.displayName,
          avatarUrl: f.companion.profile.profilePhotoUrl,
        },
      },
    }));

    return NextResponse.json({ favorites: normalized, total: normalized.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string };
    const { companionProfileId } = await req.json();

    const fav = await prisma.favorite.upsert({
      where: { customerProfileId_companionProfileId: { customerProfileId: payload.id, companionProfileId } },
      create: { customerProfileId: payload.id, companionProfileId },
      update: {},
    });

    return NextResponse.json({ favorite: fav }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
