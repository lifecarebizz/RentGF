import { prisma } from "@/lib/db/prisma-client";


export class ChatService {
  async createConversation(participantIds: string[]) {
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: participantIds.map((userId) => ({ userId })),
        },
      },
      include: { participants: true },
    });
    return conversation;
  }

  async getConversation(conversationId: string, userId: string) {
    const participant = await prisma.conversationParticipant.findFirst({
      where: { conversationId, userId },
    });
    if (!participant) throw new Error("Access denied");

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: true,
        messages: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });
    return conversation;
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const participant = await prisma.conversationParticipant.findFirst({
      where: { conversationId, userId: senderId },
    });
    if (!participant) throw new Error("Access denied");

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: { sender: true },
    });

    await prisma.conversationParticipant.updateMany({
      where: { conversationId, userId: { notIn: [senderId] }, isBlocked: false },
      data: {},
    });

    return message;
  }

  async getConversations(userId: string, params: { page: number; limit: number }) {
    const skip = (params.page - 1) * params.limit;

    const conversationIds = await prisma.conversationParticipant.findMany({
      where: { userId },
      select: { conversationId: true },
      skip,
      take: params.limit,
      orderBy: { lastReadAt: "desc" },
    });

    const conversations = await prisma.conversation.findMany({
      where: { id: { in: conversationIds.map((c) => c.conversationId) } },
      include: {
        participants: { include: { user: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    });

    const total = await prisma.conversationParticipant.count({ where: { userId } });

    return { conversations, total, page: params.page, totalPages: Math.ceil(total / params.limit) };
  }

  async markAsRead(conversationId: string, userId: string) {
    await prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: new Date() },
    });

    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string) {
    return prisma.message.count({
      where: {
        conversation: { participants: { some: { userId, isBlocked: false } } },
        senderId: { not: userId },
        isRead: false,
      },
    });
  }
}

export const chatService = new ChatService();
