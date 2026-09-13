import { prisma } from "@/lib/db/prisma-client";


export class ReportService {
  async createReport(data: {
    reporterId: string;
    reportedUserId: string;
    category: string;
    description?: string;
  }) {
    const existingBlock = await prisma.block.findUnique({
      where: { blockerId_blockedId: { blockerId: data.reporterId, blockedId: data.reportedUserId } },
    });
    if (existingBlock) throw new Error("Cannot report a blocked user");

    return prisma.report.create({
      data: {
        reporterId: data.reporterId,
        reportedUserId: data.reportedUserId,
        category: data.category as any,
        description: data.description,
      },
    });
  }

  async getReports(params: { page: number; limit: number; status?: string }) {
    const skip = (params.page - 1) * params.limit;
    const where: any = {};
    if (params.status) where.status = params.status;

    const [reports, total] = await Promise.all([
      prisma.report.findMany({ where, skip, take: params.limit, orderBy: { createdAt: "desc" }, include: { reporter: true, reportedUser: true } }),
      prisma.report.count({ where }),
    ]);

    return { reports, total, page: params.page, totalPages: Math.ceil(total / params.limit) };
  }

  async resolveReport(reportId: string, adminId: string, action: string, notes?: string) {
    return prisma.$transaction(async (tx) => {
      const report = await tx.report.update({
        where: { id: reportId },
        data: {
          status: action === "SUSPEND" || action === "BLOCK" ? "ACTION_TAKEN" : "RESOLVED",
          adminNotes: notes,
          resolvedBy: adminId,
          resolvedAt: new Date(),
        },
      });

      await tx.auditLog.create({
        data: { adminId, action: "RESOLVE_REPORT", targetType: "REPORT", targetId: reportId, metadata: { action, notes } },
      });

      return report;
    });
  }
}

export const reportService = new ReportService();
