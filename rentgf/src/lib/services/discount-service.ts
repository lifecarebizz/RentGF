import { prisma } from "@/lib/db/prisma-client";
import { z } from "zod";


export class DiscountService {
  async getActiveDiscount() {
    const now = new Date();
    return prisma.discount.findFirst({
      where: { isActive: true, startDate: { lte: now }, endDate: { gte: now } },
    });
  }

  async validateDiscount(code: string) {
    const now = new Date();
    const discount = await prisma.discount.findFirst({
      where: { code, isActive: true, startDate: { lte: now }, endDate: { gte: now } },
    });
    if (!discount) throw new Error("Invalid discount code");
    if (discount.maxUses && discount.usedCount >= discount.maxUses) throw new Error("Discount code has reached its limit");
    return discount;
  }

  async applyDiscount(discountId: string) {
    return prisma.discount.update({
      where: { id: discountId },
      data: { usedCount: { increment: 1 } },
    });
  }

  async getAllDiscounts() {
    return prisma.discount.findMany({ orderBy: { createdAt: "desc" } });
  }

  async createDiscount(data: any) {
    return prisma.discount.create({ data });
  }

  async updateDiscount(id: string, data: any) {
    return prisma.discount.update({ where: { id }, data });
  }

  async toggleDiscount(id: string, isActive: boolean) {
    return prisma.discount.update({ where: { id }, data: { isActive } });
  }
}

export const discountService = new DiscountService();
