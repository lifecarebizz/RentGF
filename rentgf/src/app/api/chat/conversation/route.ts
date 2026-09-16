import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string };

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("id");
    if (!conversationId) return NextResponse.json({ error: "Missing conversation id" }, { status: 400 });

    const participant = await prisma.conversationParticipant.findFirst({
      where: { conversationId, userId: payload.id },
    });
    if (!participant) return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const messages = await prisma.message.findMany({
      where: { conversationId },
      include: { sender: { select: { id: true, displayName: true, avatarUrl: true } } },
      orderBy: { createdAt: "asc" },
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: { conversationId, senderId: { not: payload.id }, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ messages });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
