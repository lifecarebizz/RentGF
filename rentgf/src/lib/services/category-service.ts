import { prisma } from "@/lib/db/prisma-client";


export class CategoryService {
  async getCategories() {
    return prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc", name: "asc" } });
  }

  async getCategory(slug: string) {
    return prisma.category.findUnique({ where: { slug } });
  }

  async createCategory(data: { name: string; slug: string; icon?: string; description?: string }) {
    return prisma.category.create({ data });
  }

  async updateCategory(id: string, data: any) {
    return prisma.category.update({ where: { id }, data });
  }

  async deactivateCategory(id: string) {
    return prisma.category.update({ where: { id }, data: { isActive: false } });
  }
}

export const categoryService = new CategoryService();
