import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const city = searchParams.get("city") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "RECOMMENDED";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
    const skip = (page - 1) * limit;

    // Base filter: visible + approved companions
    const where: Record<string, unknown> = {
      isVisible: true,
      isDiscoverable: true,
      verificationStatus: "APPROVED",
    };

    if (city) where.city = { equals: city, mode: "insensitive" };
    if (category) where.categories = { has: category };

    if (q) {
      where.profile = {
        OR: [
          { displayName: { contains: q, mode: "insensitive" } },
          { fullName: { contains: q, mode: "insensitive" } },
        ],
      };
    }

    const orderBy: Record<string, string> =
      sort === "PRICE_ASC" ? { startingPrice: "asc" } :
      sort === "PRICE_DESC" ? { startingPrice: "desc" } :
      sort === "RATING" ? { avgRating: "desc" } :
      { createdAt: "desc" };

    const [companions, total] = await Promise.all([
      prisma.companionProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          profile: {
            select: { id: true, displayName: true, fullName: true, profilePhotoUrl: true, email: true },
          },
        },
      }),
      prisma.companionProfile.count({ where }),
    ]);

    // Normalize for frontend (expects `user` and `averageRating`)
    const normalized = companions.map((c) => ({
      ...c,
      user: {
        id: c.profile.id,
        displayName: c.profile.displayName,
        avatarUrl: c.profile.profilePhotoUrl,
      },
      averageRating: c.avgRating ? Number(c.avgRating) : null,
      reviewCount: c.totalReviews,
      startingPrice: c.startingPrice ? Number(c.startingPrice) : 0,
    }));

    return NextResponse.json({ companions: normalized, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("Discover error:", err);
    return NextResponse.json({ error: "Failed to load companions" }, { status: 500 });
  }
}
