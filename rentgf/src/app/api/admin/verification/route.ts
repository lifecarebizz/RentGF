import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-change-me";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string; role: string };
    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { companionProfileId, action, reason } = await req.json();

    const statusMap: Record<string, string> = {
      APPROVE: "APPROVED",
      REJECT: "REJECTED",
      SUSPEND: "SUSPENDED",
    };
    const newStatus = statusMap[action];
    if (!newStatus) return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    await prisma.companionProfile.update({
      where: { id: companionProfileId },
      data: {
        verificationStatus: newStatus,
        isVisible: action === "APPROVE",
        isDiscoverable: action === "APPROVE",
      },
    });

    await prisma.auditLog.create({
      data: { adminId: payload.id, action, targetType: "COMPANION", targetId: companionProfileId, metadata: { reason } },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
