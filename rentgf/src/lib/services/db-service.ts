import { prisma } from "@/lib/db/prisma-client";



export interface DBServiceInterface {
  getPrisma(): any;
  transaction<T>(callback: (prisma: any) => Promise<T>): Promise<T>;
  getUserById(id: string): Promise<any>;
  getUsers(params: { page: number; limit: number; role?: string; status?: string; search?: string }): Promise<{ users: any[]; total: number; page: number; totalPages: number }>;
  searchCompanions(params: {
    city?: string;
    category?: string;
    interest?: string;
    minPrice?: number;
    maxPrice?: number;
    verified?: boolean;
    available?: boolean;
    sort?: string;
    page: number;
    limit: number;
  }): Promise<{ results: any[]; total: number; page: number; totalPages: number }>;
}

export class DBService implements DBServiceInterface {
  getPrisma() {
    return prisma;
  }

  async transaction<T>(callback: (prisma: any) => Promise<T>): Promise<T> {
    return prisma.$transaction(callback);
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true, email: true, displayName: true, fullName: true, phone: true,
        dateOfBirth: true, country: true, city: true, role: true, status: true,
        avatarUrl: true, emailVerified: true, createdAt: true,
      },
    });
  }

  async getUsers(params: { page: number; limit: number; role?: string; status?: string; search?: string }) {
    const { page, limit, role, status, search } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role) where.role = role;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { displayName: { contains: search, mode: "insensitive" } },
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.user.count({ where }),
    ]);

    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  async searchCompanions(params: {
    city?: string;
    category?: string;
    interest?: string;
    minPrice?: number;
    maxPrice?: number;
    verified?: boolean;
    available?: boolean;
    sort?: string;
    page: number;
    limit: number;
  }) {
    const { city, category, interest, minPrice, maxPrice, verified, available, sort, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      isDiscoverable: true,
      isPublic: true,
      verificationStatus: "APPROVED",
      user: { status: "ACTIVE" },
    };

    if (city) where.city = city;
    if (category) where.categories = { has: category };
    if (interest) where.interests = { has: interest };
    if (minPrice !== undefined) where.startingPrice = { gte: minPrice };
    if (maxPrice !== undefined) where.startingPrice = { ...where.startingPrice, lte: maxPrice };

    const orderBy: any = {};
    switch (sort) {
      case "PRICE_ASC": orderBy.startingPrice = "asc"; break;
      case "PRICE_DESC": orderBy.startingPrice = "desc"; break;
      case "RATING": orderBy.averageRating = "desc"; break;
      case "NEWEST": orderBy.createdAt = "desc"; break;
      default: orderBy.createdAt = "desc";
    }

    const [companions, total] = await Promise.all([
      prisma.companionProfile.findMany({ where, skip, take: limit, orderBy, include: { user: true } }),
      prisma.companionProfile.count({ where }),
    ]);

    return { results: companions, total, page, totalPages: Math.ceil(total / limit) };
  }
}

export const dbService = new DBService();
