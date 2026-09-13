export {};

declare module "@prisma/client" {
  export class PrismaClient {
    user: any;
    customerProfile: any;
    companionProfile: any;
    verificationDocument: any;
    city: any;
    category: any;
    interest: any;
    favorite: any;
    booking: any;
    payment: any;
    accessEntitlement: any;
    discount: any;
    platformSetting: any;
    earnings: any;
    payout: any;
    conversation: any;
    conversationParticipant: any;
    message: any;
    review: any;
    report: any;
    block: any;
    notification: any;
    faq: any;
    contentPage: any;
    auditLog: any;
    tempToken: any;
    refreshToken: any;
    announcement: any;
    $transaction: <T>(callback: (prisma: any) => Promise<T>) => Promise<T>;
    $connect: () => Promise<void>;
    $disconnect: () => Promise<void>;
  }
}
