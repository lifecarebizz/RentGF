import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-change-me";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { role: string };
    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [totalUsers, customers, companions, pendingVerification, activeCompanions,
      totalBookings, completedBookings, revenueAgg, pendingPayoutsAgg, openReports] = await Promise.all([
      prisma.profile.count(),
      prisma.profile.count({ where: { role: "CUSTOMER" } }),
      prisma.profile.count({ where: { role: "COMPANION" } }),
      prisma.companionProfile.count({ where: { verificationStatus: "PENDING" } }),
      prisma.companionProfile.count({ where: { isVisible: true, verificationStatus: "APPROVED" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.bookingPayment.aggregate({ where: { status: "SUCCESS" }, _sum: { amount: true } }),
      prisma.payout.aggregate({ where: { status: "PENDING" }, _sum: { amount: true } }),
      prisma.report.count({ where: { status: "OPEN" } }),
    ]);

    return NextResponse.json({
      totalUsers, customers, companions, pendingVerification, activeCompanions,
      totalBookings, completedBookings,
      totalRevenue: Number(revenueAgg._sum.amount ?? 0),
      pendingPayouts: Number(pendingPayoutsAgg._sum.amount ?? 0),
      openReports,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
