import { prisma } from "@/lib/db/prisma-client";


export class AdminService {
  async getDashboardStats() {
    const [
      totalUsers,
      customers,
      companions,
      pendingVerification,
      activeCompanions,
      totalBookings,
      completedBookings,
      pendingBookings,
      totalRevenue,
      pendingPayouts,
      openReports,
      recentActivity,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.user.count({ where: { role: "COMPANION" } }),
      prisma.companionProfile.count({ where: { verificationStatus: "PENDING" } }),
      prisma.companionProfile.count({ where: { isDiscoverable: true, verificationStatus: "APPROVED" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { finalAmount: true } }),
      prisma.payout.aggregate({ where: { payoutStatus: "PENDING" }, _sum: { amount: true } }),
      prisma.report.count({ where: { status: "OPEN" } }),
      prisma.auditLog.findMany({ take: 10, orderBy: { createdAt: "desc" } }),
    ]);

    return {
      totalUsers,
      customers,
      companions,
      pendingVerification,
      activeCompanions,
      totalBookings,
      completedBookings,
      pendingBookings,
      totalRevenue: totalRevenue._sum.finalAmount || 0,
      pendingPayouts: pendingPayouts._sum.amount || 0,
      openReports,
      recentActivity,
    };
  }

  async getUsers(params: { page: number; limit: number; role?: string; status?: string; search?: string }) {
    const skip = (params.page - 1) * params.limit;
    const where: any = {};
    if (params.role) where.role = params.role;
    if (params.status) where.status = params.status;
    if (params.search) {
      where.OR = [
        { displayName: { contains: params.search, mode: "insensitive" } },
        { fullName: { contains: params.search, mode: "insensitive" } },
        { email: { contains: params.search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: params.limit, orderBy: { createdAt: "desc" } }),
      prisma.user.count({ where }),
    ]);

    return { users, total, page: params.page, totalPages: Math.ceil(total / params.limit) };
  }

  async updateUserStatus(userId: string, status: string, adminId: string, reason?: string) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.update({ where: { id: userId }, data: { status } });

      await tx.auditLog.create({
        data: {
          adminId,
          action: "UPDATE_USER_STATUS",
          targetType: "USER",
          targetId: userId,
          metadata: { status, reason },
        },
      });

      return user;
    });
  }

  async getCompanions(params: { page: number; limit: number; status?: string; search?: string; verified?: boolean }) {
    const skip = (params.page - 1) * params.limit;
    const where: any = {};
    if (params.search) where.user = { displayName: { contains: params.search, mode: "insensitive" } };
    if (params.verified !== undefined) where.verificationStatus = params.verified ? "APPROVED" : "PENDING";

    const [companions, total] = await Promise.all([
      prisma.companionProfile.findMany({ where, skip, take: params.limit, include: { user: true } }),
      prisma.companionProfile.count({ where }),
    ]);

    return { companions, total, page: params.page, totalPages: Math.ceil(total / params.limit) };
  }

  async approveVerification(companionId: string, adminId: string) {
    return prisma.$transaction(async (tx) => {
      const verification = await tx.verificationDocument.updateMany({
        where: { companionId },
        data: { isVerified: true, verifiedAt: new Date(), verifiedBy: adminId },
      });

      const profile = await tx.companionProfile.update({
        where: { userId: companionId },
        data: { verificationStatus: "APPROVED", verifiedAt: new Date() },
      });

      await tx.auditLog.create({
        data: { adminId, action: "APPROVE_VERIFICATION", targetType: "COMPANION", targetId: companionId },
      });

      return { verification, profile };
    });
  }

  async rejectVerification(companionId: string, adminId: string, reason: string) {
    return prisma.$transaction(async (tx) => {
      const profile = await tx.companionProfile.update({
        where: { userId: companionId },
        data: { verificationStatus: "REJECTED", rejectedAt: new Date() },
      });

      await tx.auditLog.create({
        data: { adminId, action: "REJECT_VERIFICATION", targetType: "COMPANION", targetId: companionId, metadata: { reason } },
      });

      return profile;
    });
  }

  async getAuditLogs(params: { page: number; limit: number }) {
    const skip = (params.page - 1) * params.limit;
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({ skip, take: params.limit, orderBy: { createdAt: "desc" } }),
      prisma.auditLog.count(),
    ]);
    return { logs, total, page: params.page, totalPages: Math.ceil(total / params.limit) };
  }
}

export const adminService = new AdminService();
