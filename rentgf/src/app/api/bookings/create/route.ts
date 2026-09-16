import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import { razorpay } from "@/lib/services/razorpay-service";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string; email: string; role: string };

    const { companionId, bookingDate, startTime, durationMinutes, activityType, message } = await req.json();

    if (!companionId || !bookingDate || !startTime || !durationMinutes) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const companion = await prisma.companionProfile.findUnique({ where: { userId: companionId } });
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
        ],
      },
    });
    if (existing) {
      return NextResponse.json({ error: "Companion already booked during this time" }, { status: 409 });
    }

    const price = companion.startingPrice || 0;
    const durationHours = durationMinutes / 60;
    const total = Math.round(price * durationHours);
    const totalPaise = total * 100;

    const internalOrderId = `ORD-${crypto.randomBytes(8).toString("hex")}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: totalPaise,
      currency: "INR",
      receipt: internalOrderId,
      notes: { companionId, customerId: payload.id },
    });

    const booking = await prisma.booking.create({
      data: {
        customerId: payload.id,
        companionId,
        bookingDate: new Date(bookingDate),
        startTime: start,
        endTime: end,
        durationMinutes,
        activityType: activityType || null,
        message: message || null,
        price: total,
        discountAmount: 0,
        finalPrice: total,
        status: "PENDING",
        paymentStatus: "PENDING",
      },
    });

    await prisma.payment.create({
      data: {
        orderId: razorpayOrder.id,
        userId: payload.id,
        bookingId: booking.id,
        amount: total,
        finalAmount: total,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      booking,
      razorpayOrderId: razorpayOrder.id,
      amount: totalPaise,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Booking failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
