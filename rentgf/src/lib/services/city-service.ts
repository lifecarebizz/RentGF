import { prisma } from "@/lib/db/prisma-client";


export class CityService {
  async getCities() {
    return prisma.city.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc", name: "asc" } });
  }

  async getCity(slug: string) {
    return prisma.city.findUnique({ where: { slug }, include: { companions: { include: { user: true } } } });
  }

  async createCity(data: { name: string; slug: string; country: string; state?: string; description?: string }) {
    return prisma.city.create({ data });
  }

  async updateCity(id: string, data: any) {
    return prisma.city.update({ where: { id }, data });
  }

  async deactivateCity(id: string) {
    return prisma.city.update({ where: { id }, data: { isActive: false } });
  }
}

export const cityService = new CityService();
