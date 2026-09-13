import { prisma } from "@/lib/db/prisma-client";


export class AIAssistantService {
  async getSettings() {
    const settings = await prisma.platformSetting.findMany({
      where: { key: { in: ["AI_ENABLED", "AI_BOT_NAME", "AI_WELCOME_MESSAGE", "AI_SYSTEM_INSTRUCTIONS"] } },
    });
    return settings;
  }

  async updateSetting(key: string, value: string) {
    return prisma.platformSetting.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { key, value },
    });
  }

  async getFAQs() {
    return prisma.faq.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  }

  async getSuggestedQuestions() {
    const setting = await prisma.platformSetting.findUnique({ where: { key: "AI_SUGGESTED_QUESTIONS" } });
    return setting ? JSON.parse(setting.value) : [];
  }

  generateResponse(userMessage: string, context: any) {
    const faqs = context.faqs || [];
    const lower = userMessage.toLowerCase();

    for (const faq of faqs) {
      if (lower.includes(faq.question.toLowerCase().substring(0, 20))) {
        return faq.answer;
      }
    }

    return "I'm the RentGF AI assistant. I can help you with FAQs, booking instructions, payment information, cancellation/refund policies, safety guidelines, and platform rules. Please ask your question or choose from the suggested topics.";
  }
}

export const aiAssistantService = new AIAssistantService();
