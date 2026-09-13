import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = jwt.verify(token, JWT_SECRET) as any;

    const { documents } = await req.json();

    const profile = await prisma.companionProfile.update({
      where: { userId: payload.id },
      data: { verificationStatus: "PENDING" },
    });

    if (documents && Array.isArray(documents)) {
      await prisma.verificationDocument.deleteMany({ where: { companionId: payload.id } });
      for (const doc of documents) {
        await prisma.verificationDocument.create({
          data: { companionId: payload.id, documentType: doc.type, documentUrl: doc.url },
        });
      }
    }

    await prisma.notification.create({
      data: { userId: payload.id, type: "VERIFICATION_STATUS", title: "Verification Submitted", message: "Your verification is under review" },
    });

    return NextResponse.json({ message: "Verification submitted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
