export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-change-me";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string; role: string };

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50");

    // Companions see BookingPayments; customers see AccessPayments
    if (payload.role === "COMPANION") {
      const payments = await prisma.bookingPayment.findMany({
        where: { booking: { companionProfile: { profileId: payload.id } } },
        orderBy: { createdAt: "desc" },
        take: limit,
      });
      return NextResponse.json({ payments, total: payments.length });
    }

    const payments = await prisma.accessPayment.findMany({
      where: { customerProfileId: payload.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return NextResponse.json({ payments, total: payments.length });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
