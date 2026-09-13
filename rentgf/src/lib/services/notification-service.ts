import { prisma } from "@/lib/db/prisma-client";


export class NotificationService {
  async createNotification(data: {
    userId: string;
    type: string;
    title: string;
    message: string;
    relatedId?: string;
    relatedType?: string;
    data?: any;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type as any,
        title: data.title,
        message: data.message,
        relatedId: data.relatedId,
        relatedType: data.relatedType,
        data: data.data,
      },
    });
  }

  async getUserNotifications(userId: string, params: { page: number; limit: number; isRead?: boolean }) {
    const skip = (params.page - 1) * params.limit;
    const where: any = { userId };
    if (params.isRead !== undefined) where.isRead = params.isRead;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({ where, skip, take: params.limit, orderBy: { createdAt: "desc" } }),
      prisma.notification.count({ where }),
    ]);

    return { notifications, total, page: params.page, totalPages: Math.ceil(total / params.limit) };
  }

  async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.update({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async getUnreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  }
}

export const notificationService = new NotificationService();
