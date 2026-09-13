import { prisma } from "@/lib/db/prisma-client";


export class PayoutService {
  async requestPayout(data: { companionId: string; amount: number }) {
    return prisma.payout.create({
      data: {
        companionId: data.companionId,
        amount: data.amount,
        payoutStatus: "PENDING",
        requestedDate: new Date(),
      },
    });
  }

  async processPayout(payoutId: string, adminId: string, reference?: string, notes?: string) {
    return prisma.$transaction(async (tx) => {
      const payout = await tx.payout.update({
        where: { id: payoutId },
        data: {
          payoutStatus: "COMPLETED",
          payoutReference: reference || `Payout-${Date.now()}`,
          processedDate: new Date(),
          adminNotes: notes,
        },
      });

      await tx.auditLog.create({
        data: { adminId, action: "PROCESS_PAYOUT", targetType: "PAYOUT", targetId: payoutId },
      });

      return payout;
    });
  }

  async getPayoutsByCompanionId(companionId: string) {
    return prisma.payout.findMany({
      where: { companionId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getPayout(payoutId: string) {
    return prisma.payout.findUnique({ where: { id: payoutId } });
  }
}

export const payoutService = new PayoutService();
