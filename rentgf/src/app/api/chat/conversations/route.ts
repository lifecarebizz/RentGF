import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string };

    const participations = await prisma.conversationParticipant.findMany({
      where: { userId: payload.id },
      select: { conversationId: true },
    });
    const conversationIds = participations.map((p) => p.conversationId);

    const conversations = await prisma.conversation.findMany({
      where: { id: { in: conversationIds } },
      include: {
        participants: { include: { user: { select: { id: true, displayName: true, avatarUrl: true } } } },
        messages: { orderBy: { createdAt: "desc" }, take: 1, select: { content: true, createdAt: true, senderId: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ conversations });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string };

    const { targetUserId } = await req.json();
    if (!targetUserId) return NextResponse.json({ error: "targetUserId required" }, { status: 400 });
    if (targetUserId === payload.id) return NextResponse.json({ error: "Cannot chat with yourself" }, { status: 400 });

    // Find existing conversation
    const participations = await prisma.conversationParticipant.findMany({
      where: { userId: payload.id },
      select: { conversationId: true },
    });
    const myConvIds = participations.map((p) => p.conversationId);

    const existing = await prisma.conversationParticipant.findFirst({
      where: { userId: targetUserId, conversationId: { in: myConvIds } },
    });

    if (existing) {
      return NextResponse.json({ conversationId: existing.conversationId });
    }

    const conversation = await prisma.conversation.create({ data: {} });
    await prisma.conversationParticipant.createMany({
      data: [
        { conversationId: conversation.id, userId: payload.id },
        { conversationId: conversation.id, userId: targetUserId },
      ],
    });

    return NextResponse.json({ conversationId: conversation.id }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
