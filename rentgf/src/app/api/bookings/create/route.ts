import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = jwt.verify(token, JWT_SECRET) as any;

    const { companionId, bookingDate, startTime, durationMinutes, activityType, message, discountCode } = await req.json();

    const companion = await prisma.companionProfile.findUnique({
      where: { userId: companionId },
    });

    if (!companion || !companion.isDiscoverable || companion.verificationStatus !== "APPROVED") {
      return NextResponse.json({ error: "Companion not available" }, { status: 400 });
    }

    const dayOfWeek = new Date(bookingDate).toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    if (companion.availabilityDays.length > 0 && !companion.availabilityDays.includes(dayOfWeek)) {
      return NextResponse.json({ error: "Companion not available on this day" }, { status: 400 });
    }

    const start = new Date(startTime);
    const end = new Date(start.getTime() + durationMinutes * 60000);

    const existing = await prisma.booking.findFirst({
      where: {
        companionId,
        status: { notIn: ["CANCELLED", "COMPLETED", "REFUNDED", "REJECTED"] },
        OR: [
          { startTime: { lt: end }, endTime: { gt: start } },
          { startTime: { gte: start }, endTime: { lte: end } },
        ],
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Companion already booked during this time" }, { status: 409 });
    }

    const accessFee = 499;
    const price = companion.startingPrice || 0;
    const total = price + accessFee;

    const orderId = `ORD-${crypto.randomBytes(8).toString("hex")}`;
    const booking = await prisma.booking.create({
      data: {
        customerId: payload.id,
        companionId,
        bookingDate: new Date(bookingDate),
        startTime: start,
        endTime: end,
        durationMinutes,
        activityType,
        message,
        price: total,
        discountAmount: 0,
        finalPrice: total,
        status: "CONFIRMED",
        paymentStatus: "PENDING",
      },
    });

    await prisma.payment.create({
      data: { orderId, userId: payload.id, bookingId: booking.id, amount: total, finalAmount: total, paymentMethod: "PLATFORM", status: "PENDING" },
    });

    await prisma.notification.create({
      data: { userId: companionId, type: "BOOKING_REQUEST", title: "New Booking", message: "You have a new booking request", relatedId: booking.id, relatedType: "BOOKING" },
    });

    return NextResponse.json({ booking, orderId, total });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
