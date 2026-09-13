import { prisma } from "@/lib/db/prisma-client";


export class EarningsService {
  async calculateEarnings(bookingId: string, platformCommissionPercent: number = 10) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("Booking not found");

    const platformCommission = Math.round(booking.finalPrice * (platformCommissionPercent / 100));
    const companionEarnings = booking.finalPrice - platformCommission;

    return {
      bookingId,
      bookingAmount: booking.finalPrice,
      platformCommission,
      companionEarnings,
    };
  }

  async recordEarnings(bookingId: string, platformCommissionPercent: number = 10) {
    const earnings = await this.calculateEarnings(bookingId, platformCommissionPercent);
    return prisma.earnings.create({
      data: {
        bookingId,
        companionId: earnings.bookingId,
        companion: { connect: { id: earnings.bookingId } },
        bookingAmount: earnings.bookingAmount,
        platformCommission: earnings.platformCommission,
        companionEarnings: earnings.companionEarnings,
      },
    });
  }

  async getEarningsByCompanionId(companionId: string) {
    return prisma.earnings.findMany({
      where: { companionId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getTotalEarnings(companionId: string) {
    const result = await prisma.earnings.aggregate({
      where: { companionId },
      _sum: { companionEarnings: true, platformCommission: true },
    });
    return result;
  }
}

export const earningsService = new EarningsService();
