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

    const { companionId, message } = await req.json();

    const conversation = await prisma.conversation.create({
      data: {
        participants: { create: [{ userId: payload.id }, { userId: companionId }] },
      },
    });

    const msg = await prisma.message.create({
      data: { conversationId: conversation.id, senderId: payload.id, content: message || "Hello!" },
    });

    return NextResponse.json({ conversation, message: msg });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
