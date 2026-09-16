import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import { verifyRazorpaySignature } from "@/lib/services/razorpay-service";
import {
  sendBookingConfirmationEmail,
  sendNewBookingAlertEmail,
} from "@/lib/services/email-service";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";
const PLATFORM_COMMISSION = 0.2;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string; email: string };

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !bookingId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const payment = await prisma.payment.findUnique({ where: { orderId: razorpayOrderId } });
    if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    if (payment.status === "SUCCESS") {
      return NextResponse.json({ success: true, alreadyVerified: true });
    }

    await prisma.payment.update({ where: { id: payment.id }, data: { status: "SUCCESS", paymentId: razorpayPaymentId } });

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentId: razorpayPaymentId, paymentStatus: "SUCCESS", status: "CONFIRMED" },
    });

    await prisma.accessEntitlement.create({
      data: { userId: payload.id, paymentId: payment.id },
    });

    const platformCommission = Math.round(payment.finalAmount * PLATFORM_COMMISSION);
    const companionEarnings = payment.finalAmount - platformCommission;

    const companion = await prisma.companionProfile.findUnique({ where: { userId: booking.companionId } });
    if (companion) {
      await prisma.earnings.create({
        data: {
          companionId: companion.id,
          bookingId,
          bookingAmount: payment.finalAmount,
          platformCommission,
          companionEarnings,
          payoutStatus: "PENDING",
        },
      });
    }

    const [customer, companionUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: payload.id } }),
      prisma.user.findUnique({ where: { id: booking.companionId } }),
    ]);

    const dateStr = new Date(booking.bookingDate).toLocaleDateString("en-IN", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    const timeStr = new Date(booking.startTime).toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit",
    });

    const bookingDetails = {
      companionName: companionUser?.displayName || "Companion",
      customerName: customer?.displayName || "Customer",
      date: dateStr,
      time: timeStr,
      duration: `${booking.durationMinutes} minutes`,
      activityType: booking.activityType || undefined,
      amount: booking.finalPrice.toLocaleString("en-IN"),
      bookingId: booking.id,
      dashboardUrl: `${APP_URL}/customer/dashboard`,
    };

    // Send emails in parallel — email failure must never break payment
    await Promise.allSettled([
      customer?.email
        ? sendBookingConfirmationEmail(customer.email, customer.displayName, bookingDetails)
        : Promise.resolve(),
      companionUser?.email
        ? sendNewBookingAlertEmail(companionUser.email, companionUser.displayName, {
            ...bookingDetails,
            dashboardUrl: `${APP_URL}/companion/dashboard`,
          })
        : Promise.resolve(),
    ]);

    await prisma.notification.create({
      data: {
        userId: booking.companionId,
        type: "BOOKING_CONFIRMED",
        title: "Booking Confirmed",
        message: `New booking from ${customer?.displayName || "a customer"} on ${dateStr}.`,
        relatedId: bookingId,
        relatedType: "BOOKING",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Verification failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
