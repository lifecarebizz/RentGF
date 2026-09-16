import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-change-me";

/**
 * GET /api/chat/conversations
 * List all conversations for the current user.
 * Supabase schema: conversations has customer_profile_id + companion_profile_id (not a join table)
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string };

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { customerProfileId: payload.id },
          { companionProfile: { profileId: payload.id } },
        ],
        isActive: true,
      },
      include: {
        customer: { select: { id: true, displayName: true, profilePhotoUrl: true } },
        companionProfile: {
          include: { profile: { select: { id: true, displayName: true, profilePhotoUrl: true } } },
        },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Normalize to old format the chat UI expects
    const normalized = conversations.map((conv) => {
      const isCustomer = conv.customerProfileId === payload.id;
      const otherUser = isCustomer
        ? { id: conv.companionProfile.profile.id, displayName: conv.companionProfile.profile.displayName, avatarUrl: conv.companionProfile.profile.profilePhotoUrl }
        : { id: conv.customer.id, displayName: conv.customer.displayName, avatarUrl: conv.customer.profilePhotoUrl };

      return {
        id: conv.id,
        updatedAt: conv.updatedAt,
        participants: [
          { userId: conv.customerProfileId, user: { id: conv.customer.id, displayName: conv.customer.displayName, avatarUrl: conv.customer.profilePhotoUrl } },
          { userId: conv.companionProfile.profileId, user: { id: conv.companionProfile.profile.id, displayName: conv.companionProfile.profile.displayName, avatarUrl: conv.companionProfile.profile.profilePhotoUrl } },
        ],
        messages: conv.messages,
        otherUser,
      };
    });

    return NextResponse.json({ conversations: normalized });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load conversations" }, { status: 500 });
  }
}

/**
 * POST /api/chat/conversations
 * Create or fetch a conversation between current user and a companion.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string };
    const { companionProfileId } = await req.json();

    if (!companionProfileId) return NextResponse.json({ error: "companionProfileId required" }, { status: 400 });

    // Find or create
    let conversation = await prisma.conversation.findFirst({
      where: { customerProfileId: payload.id, companionProfileId },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { customerProfileId: payload.id, companionProfileId, isActive: true },
      });
    }

    return NextResponse.json({ conversationId: conversation.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
