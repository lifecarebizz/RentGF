import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";

export async function GET(_req: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const companion = await prisma.companionProfile.findFirst({
      where: { profileId: params.userId },
      include: {
        profile: {
          select: { id: true, displayName: true, fullName: true, profilePhotoUrl: true },
        },
      },
    });

    if (!companion) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
      companion: {
        ...companion,
        user: { id: companion.profile.id, displayName: companion.profile.displayName, avatarUrl: companion.profile.profilePhotoUrl },
        averageRating: companion.avgRating ? Number(companion.avgRating) : null,
        reviewCount: companion.totalReviews,
        startingPrice: companion.startingPrice ? Number(companion.startingPrice) : 0,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
