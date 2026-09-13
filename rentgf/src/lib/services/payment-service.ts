import { prisma } from "@/lib/db/prisma-client";


export class PaymentService {
  async createPayment(data: {
    userId: string;
    orderId: string;
    amount: number;
    discountAmount?: number;
    finalAmount: number;
    currency?: string;
    discountId?: string;
    bookingId?: string;
    paymentMethod?: string;
  }) {
    return prisma.payment.create({
      data: {
        orderId: data.orderId,
        userId: data.userId,
        amount: data.amount,
        discountAmount: data.discountAmount || 0,
        finalAmount: data.finalAmount,
        currency: data.currency || "INR",
        discountId: data.discountId,
        bookingId: data.bookingId,
        paymentMethod: data.paymentMethod,
        status: "PENDING",
      },
    });
  }

  async verifyPayment(paymentId: string) {
    // In production, verify with payment provider
    // This marks as server-side verified only
    return prisma.payment.update({
      where: { id: paymentId },
      data: { status: "SUCCESS" },
    });
  }

  async failPayment(paymentId: string) {
    return prisma.payment.update({
      where: { id: paymentId },
      data: { status: "FAILED" },
    });
  }

  async processRefund(paymentId: string) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.findUnique({ where: { id: paymentId } });
      if (!payment) throw new Error("Payment not found");
      if (payment.status === "REFUNDED") throw new Error("Already refunded");

      await tx.payment.update({
        where: { id: paymentId },
        data: { status: "REFUNDED" },
      });

      await tx.refund.create({
        data: {
          paymentId,
          amount: payment.finalAmount,
          status: "COMPLETED",
          refundDate: new Date(),
          reason: "Requested by user",
        },
      });

      return { paymentId, refundAmount: payment.finalAmount };
    });
  }

  async getPayment(paymentId: string, userId?: string) {
    const where: any = { id: paymentId };
    if (userId) where.userId = userId;
    return prisma.payment.findFirst({ where });
  }

  async getPayments(userId: string, params: { page: number; limit: number }) {
    const skip = (params.page - 1) * params.limit;
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({ where: { userId }, skip, take: params.limit, orderBy: { createdAt: "desc" } }),
      prisma.payment.count({ where: { userId } }),
    ]);
    return { payments, total, page: params.page, totalPages: Math.ceil(total / params.limit) };
  }

  async getPaymentByOrderId(orderId: string) {
    return prisma.payment.findUnique({ where: { orderId } });
  }

  async createAccessPayment(userId: string, accessFee: number) {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return this.createPayment({
      userId,
      orderId,
      amount: accessFee,
      finalAmount: accessFee,
      paymentMethod: "PLATFORM",
    });
  }
}

export const paymentService = new PaymentService();
