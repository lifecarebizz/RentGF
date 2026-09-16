import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-change-me";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ unreadCount: 0 });
    const token = authHeader.substring(7);
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };

    const count = await prisma.notification.count({
      where: { profileId: payload.id, isRead: false },
    });

    return NextResponse.json({ unreadCount: count });
  } catch {
    return NextResponse.json({ unreadCount: 0 });
  }
}
