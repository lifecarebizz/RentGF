import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = jwt.verify(token, JWT_SECRET) as any;

    const { bookingId, rating, comment } = await req.json();

    const existing = await prisma.review.findUnique({ where: { bookingId } });
    if (existing) return NextResponse.json({ error: "Already reviewed" }, { status: 409 });

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking || booking.status !== "COMPLETED") {
      return NextResponse.json({ error: "Can only review completed bookings" }, { status: 400 });
    }

    const revieweeId = booking.customerId === payload.id ? booking.companionId : booking.customerId;

    const review = await prisma.review.create({
      data: { bookingId, reviewerId: payload.id, revieweeId, rating, comment },
      include: { reviewer: true, reviewee: true },
    });

    return NextResponse.json({ review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
