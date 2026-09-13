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

    const { bookingId } = await req.json();

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.companionId !== payload.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (booking.status !== "PENDING") return NextResponse.json({ error: "Booking cannot be rejected" }, { status: 400 });

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "REJECTED" },
    });

    await prisma.notification.create({
      data: { userId: booking.customerId, type: "BOOKING_REJECTED", title: "Booking Rejected", message: "Your booking was declined", relatedId: bookingId, relatedType: "BOOKING" },
    });

    return NextResponse.json({ booking: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
