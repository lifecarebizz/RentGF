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

    if (payload.role !== "COMPANION") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const step = body.step;

    const data: any = {};
    if (body.city !== undefined) data.city = body.city;
    if (body.languages !== undefined) data.languages = body.languages;
    if (body.interests !== undefined) data.interests = body.interests;
    if (body.categories !== undefined) data.categories = body.categories;
    if (body.bio !== undefined) data.bio = body.bio;
    if (body.startingPrice !== undefined) data.startingPrice = body.startingPrice;
    if (body.availabilityDays !== undefined) data.availabilityDays = body.availabilityDays;
    if (body.availabilityTimes !== undefined) data.availabilityTimes = body.availabilityTimes;
    if (body.unavailabilityPeriods !== undefined) data.unavailabilityPeriods = body.unavailabilityPeriods;

    const profile = await prisma.companionProfile.update({
      where: { userId: payload.id },
      data: {
        ...data,
        onboardingStep: Math.max(step || 0, 1),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ profile, progress: Math.min(((step || 0) / 12) * 100, 100) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
