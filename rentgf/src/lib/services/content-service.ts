import { prisma } from "@/lib/db/prisma-client";


export class ContentService {
  async getContent(slug: string) {
    return prisma.contentPage.findUnique({ where: { slug } });
  }

  async getFAQs() {
    return prisma.faq.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  }

  async getAnnouncements() {
    return prisma.announcement.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" } });
  }
}

export const contentService = new ContentService();
