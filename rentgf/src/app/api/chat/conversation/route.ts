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

    const conversation = await prisma.conversation.findFirst({
      where: { participants: { some: { userId: payload.id } } },
      include: { participants: { include: { user: true } }, messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!conversation) return NextResponse.json({ error: "Conversation not found" }, { status: 404 });

    const participants = conversation.participants.filter((p: any) => p.userId !== payload.id);
    const otherUserId = participants[0]?.userId;

    if (!otherUserId) return NextResponse.json({ error: "No other participant" }, { status: 404 });

    return NextResponse.json({ conversation, otherUser: participants[0]?.user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
