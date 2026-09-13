import { prisma } from "@/lib/db/prisma-client";


export class BlockService {
  async blockUser(blockerId: string, blockedId: string, reason?: string) {
    if (blockerId === blockedId) throw new Error("Cannot block yourself");

    return prisma.block.upsert({
      where: { blockerId_blockedId: { blockerId, blockedId } },
      update: { reason },
      create: { blockerId, blockedId, reason },
    });
  }

  async unblockUser(blockerId: string, blockedId: string) {
    return prisma.block.delete({
      where: { blockerId_blockedId: { blockerId, blockedId } },
    });
  }

  async isBlocked(blockerId: string, blockedId: string) {
    return prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId, blockedId } },
    });
  }

  async getBlockedUsers(userId: string) {
    return prisma.block.findMany({
      where: { blockerId: userId },
      include: { blocked: true },
    });
  }
}

export const blockService = new BlockService();
