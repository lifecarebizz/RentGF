import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = jwt.verify(token, JWT_SECRET) as any;

    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const stats = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.user.count({ where: { role: "COMPANION" } }),
      prisma.companionProfile.count({ where: { verificationStatus: "PENDING" } }),
      prisma.companionProfile.count({ where: { isDiscoverable: true, verificationStatus: "APPROVED" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { finalAmount: true } }),
      prisma.payout.aggregate({ where: { payoutStatus: "PENDING" }, _sum: { amount: true } }),
      prisma.report.count({ where: { status: "OPEN" } }),
    ]);

    return NextResponse.json({
      totalUsers: stats[0],
      customers: stats[1],
      companions: stats[2],
      pendingVerification: stats[3],
      activeCompanions: stats[4],
      totalBookings: stats[5],
      completedBookings: stats[6],
      totalRevenue: stats[7]._sum.finalAmount || 0,
      pendingPayouts: stats[8]._sum.amount || 0,
      openReports: stats[9],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
