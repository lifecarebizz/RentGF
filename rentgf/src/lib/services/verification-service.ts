import { prisma } from "@/lib/db/prisma-client";


export class VerificationService {
  async submitVerification(companionId: string, documents: { documentType: string; documentUrl: string }[]) {
    return prisma.$transaction(async (tx) => {
      const profile = await tx.companionProfile.update({
        where: { userId: companionId },
        data: { verificationStatus: "PENDING" },
      });

      await tx.verificationDocument.deleteMany({ where: { companionId } });

      for (const doc of documents) {
        await tx.verificationDocument.create({
          data: { companionId, documentType: doc.documentType, documentUrl: doc.documentUrl },
        });
      }

      await tx.notification.create({
        data: {
          userId: companionId,
          type: "VERIFICATION_STATUS",
          title: "Verification Submitted",
          message: "Your verification has been submitted for review",
        },
      });

      return profile;
    });
  }

  async addVerificationNote(companionId: string, note: string) {
    const profile = await prisma.companionProfile.update({
      where: { userId: companionId },
      data: { verificationNotes: note },
    });
    return profile;
  }

  async getVerificationByCompanionId(companionId: string) {
    return prisma.verificationDocument.findMany({ where: { companionId } });
  }
}

export const verificationService = new VerificationService();
