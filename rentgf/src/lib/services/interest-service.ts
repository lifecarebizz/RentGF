import { prisma } from "@/lib/db/prisma-client";


export class InterestService {
  async getInterests() {
    return prisma.interest.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc", name: "asc" } });
  }

  async createInterest(data: { name: string; slug: string }) {
    return prisma.interest.create({ data });
  }

  async updateInterest(id: string, data: any) {
    return prisma.interest.update({ where: { id }, data });
  }

  async deactivateInterest(id: string) {
    return prisma.interest.update({ where: { id }, data: { isActive: false } });
  }
}

export const interestService = new InterestService();
