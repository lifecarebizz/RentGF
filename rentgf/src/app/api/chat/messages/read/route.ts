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

    const { conversationId, messageId } = await req.json();

    const participant = await prisma.conversationParticipant.findFirst({
      where: { conversationId, userId: payload.id },
    });
    if (!participant) return NextResponse.json({ error: "Access denied" }, { status: 403 });

    await prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
