import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-change-me";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companionProfileId = searchParams.get("companionProfileId");
    if (!companionProfileId) return NextResponse.json({ error: "companionProfileId required" }, { status: 400 });

    const reviews = await prisma.review.findMany({
      where: { companionProfileId, isVisible: true },
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { id: true, displayName: true, profilePhotoUrl: true } },
      },
    });

    return NextResponse.json({
      reviews: reviews.map((r) => ({
        ...r,
        reviewer: { id: r.customer.id, displayName: r.customer.displayName, avatarUrl: r.customer.profilePhotoUrl },
      })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string };

    const { companionProfileId, bookingId, rating, comment } = await req.json();
    if (!companionProfileId || !rating) return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    if (rating < 1 || rating > 5) return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });

    const review = await prisma.review.create({
      data: {
        customerProfileId: payload.id,
        companionProfileId,
        bookingId: bookingId || null,
        rating,
        comment: comment || null,
        isVisible: true,
        status: "APPROVED",
      },
    });

    // Update companion average rating
    const agg = await prisma.review.aggregate({
      where: { companionProfileId, isVisible: true },
      _avg: { rating: true },
      _count: { rating: true },
    });
    await prisma.companionProfile.update({
      where: { id: companionProfileId },
      data: { avgRating: agg._avg.rating ?? 0, totalReviews: agg._count.rating },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
