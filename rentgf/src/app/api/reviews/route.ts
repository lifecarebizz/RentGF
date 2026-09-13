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

    const { searchParams } = new URL(req.url);
    const companionId = searchParams.get("companionId");

    const reviews = await prisma.review.findMany({
      where: { revieweeId: companionId || payload.id },
      orderBy: { createdAt: "desc" },
      include: { reviewer: true, booking: true },
    });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
