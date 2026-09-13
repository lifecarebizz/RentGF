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

    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { companionId, action, reason } = await req.json();

    if (action === "APPROVE") {
      await prisma.companionProfile.update({
        where: { userId: companionId },
        data: { verificationStatus: "APPROVED", verifiedAt: new Date() },
      });
    } else if (action === "REJECT") {
      await prisma.companionProfile.update({
        where: { userId: companionId },
        data: { verificationStatus: "REJECTED", rejectedAt: new Date() },
      });
    } else if (action === "SUSPEND") {
      await prisma.companionProfile.update({
        where: { userId: companionId },
        data: { verificationStatus: "SUSPENDED", suspendedAt: new Date() },
      });
    }

    await prisma.auditLog.create({
      data: { adminId: payload.id, action, targetType: "COMPANION", targetId: companionId, metadata: { reason } },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
