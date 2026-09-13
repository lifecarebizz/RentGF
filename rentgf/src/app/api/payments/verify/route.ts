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

    const { orderId, paymentId, signature, bookingId } = await req.json();

    const payment = await prisma.payment.findUnique({ where: { orderId } });
    if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

    const signatureCheck = crypto
      .createHash("sha256")
      .update(orderId + paymentId + JWT_SECRET)
      .digest("hex");

    if (signatureCheck !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    await prisma.payment.update({ where: { id: payment.id }, data: { status: "SUCCESS", paymentId } });
    await prisma.booking.update({ where: { id: bookingId }, data: { paymentId, paymentStatus: "SUCCESS" } });

    await prisma.accessEntitlement.create({
      data: { userId: payload.id, paymentId: payment.id },
    });

    return NextResponse.json({ success: true, paymentId: payment.id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
