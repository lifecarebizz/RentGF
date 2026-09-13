import { prisma } from "@/lib/db/prisma-client";


export class FavoriteService {
  async addFavorite(customerId: string, companionId: string) {
    const existing = await prisma.favorite.findUnique({ where: { customerId_companionId: { customerId, companionId } } });
    if (existing) throw new Error("Already in favorites");

    return prisma.favorite.create({
      data: { customerId, companionId },
    });
  }

  async removeFavorite(customerId: string, companionId: string) {
    return prisma.favorite.delete({
      where: { customerId_companionId: { customerId, companionId } },
    });
  }

  async getFavorites(customerId: string) {
    return prisma.favorite.findMany({
      where: { customerId },
      include: { companion: { include: { user: true } } },
    });
  }

  async isFavorite(customerId: string, companionId: string) {
    return prisma.favorite.findUnique({
      where: { customerId_companionId: { customerId, companionId } },
    });
  }
}

export const favoriteService = new FavoriteService();
