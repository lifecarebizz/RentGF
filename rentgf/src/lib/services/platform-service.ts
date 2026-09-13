import { prisma } from "@/lib/db/prisma-client";


export class PlatformService {
  async getSettings() {
    return prisma.platformSetting.findMany();
  }

  async getSetting(key: string) {
    return prisma.platformSetting.findUnique({ where: { key } });
  }

  async updateSetting(key: string, value: any, description?: string, updatedBy?: string) {
    return prisma.$transaction(async (tx) => {
      const setting = await tx.platformSetting.upsert({
        where: { key },
        update: { value, description, updatedAt: new Date() },
        create: { key, value, description },
      });

      if (updatedBy) {
        await tx.auditLog.create({
          data: { adminId: updatedBy, action: "UPDATE_SETTING", targetType: "PLATFORM_SETTING", targetId: key, metadata: { value } },
        });
      }

      return setting;
    });
  }

  async getAccessFee() {
    const setting = await prisma.platformSetting.findUnique({ where: { key: "ACCESS_FEE" } });
    return setting ? JSON.parse(setting.value).amount : 499;
  }
}

export const platformService = new PlatformService();
