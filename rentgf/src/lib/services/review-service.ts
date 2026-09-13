import { prisma } from "@/lib/db/prisma-client";


export class ReviewService {
  async createReview(data: {
    bookingId: string;
    reviewerId: string;
    revieweeId: string;
    rating: number;
    comment?: string;
  }) {
    const existing = await prisma.review.findUnique({ where: { bookingId: data.bookingId } });
    if (existing) throw new Error("Review already exists for this booking");

    const booking = await prisma.booking.findUnique({ where: { id: data.bookingId } });
    if (!booking || booking.status !== "COMPLETED") {
      throw new Error("Review can only be left for completed bookings");
    }

    if (data.reviewerId !== booking.customerId && data.reviewerId !== booking.companionId) {
      throw new Error("Unauthorized");
    }

    return prisma.$transaction(async (tx) => {
      const review = await tx.review.create({
        data: {
          bookingId: data.bookingId,
          reviewerId: data.reviewerId,
          revieweeId: data.revieweeId,
          rating: data.rating,
          comment: data.comment,
          isVerified: true,
          status: "APPROVED",
        },
      });

      const reviews = await tx.review.findMany({ where: { revieweeId: data.revieweeId } });
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

      await tx.companionProfile.update({
        where: { userId: data.revieweeId },
        data: { averageRating: avgRating, reviewCount: reviews.length },
      });

      return review;
    });
  }

  async getReviewsByUser(userId: string, role: string, params: { page: number; limit: number }) {
    const skip = (params.page - 1) * params.limit;
    const where: any = {};

    if (role === "CUSTOMER") where.reviewerId = userId;
    else if (role === "COMPANION") where.revieweeId = userId;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({ where, skip, take: params.limit, orderBy: { createdAt: "desc" }, include: { booking: true } }),
      prisma.review.count({ where }),
    ]);

    return { reviews, total, page: params.page, totalPages: Math.ceil(total / params.limit) };
  }

  async getReview(reviewId: string, userId: string) {
    return prisma.review.findFirst({
      where: { id: reviewId, OR: [{ reviewerId: userId }, { revieweeId: userId }] },
    });
  }

  async moderateReview(reviewId: string, status: string, adminId: string) {
    return prisma.review.update({
      where: { id: reviewId },
      data: { status: status as any },
    });
  }

  async getReviewsForCompanion(companionId: string) {
    const profile = await prisma.companionProfile.findUnique({ where: { userId: companionId } });
    if (!profile) return [];
    return prisma.review.findMany({ where: { revieweeId: profile.id }, orderBy: { createdAt: "desc" } });
  }
}

export const reviewService = new ReviewService();
