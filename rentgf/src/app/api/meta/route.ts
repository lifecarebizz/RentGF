export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";

export async function GET(_req: NextRequest) {
  try {
    const [cities, categories, interests, platformSettings] = await Promise.all([
      prisma.city.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.interest.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.platformSetting.findMany(),
    ]);
    return NextResponse.json({ cities, categories, interests, platformSettings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load meta" }, { status: 500 });
  }
}
