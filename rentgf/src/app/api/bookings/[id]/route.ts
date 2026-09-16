import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-change-me";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string; role: string };

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        companionProfile: {
          include: { profile: { select: { id: true, displayName: true, profilePhotoUrl: true } } },
        },
        reviews: true,
      },
    });

    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Only customer or companion can view
    const isCustomer = booking.customerProfileId === payload.id;
    const isCompanion = booking.companionProfile.profileId === payload.id;
    const isAdmin = payload.role === "ADMIN";
    if (!isCustomer && !isCompanion && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json({
      booking: {
        ...booking,
        companion: {
          user: { displayName: booking.companionProfile.profile.displayName, avatarUrl: booking.companionProfile.profile.profilePhotoUrl },
        },
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { id: string; role: string };

    const { status, cancellationReason } = await req.json();
    const booking = await prisma.booking.findUnique({ where: { id: params.id }, include: { companionProfile: true } });
    if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isCustomer = booking.customerProfileId === payload.id;
    const isCompanion = booking.companionProfile.profileId === payload.id;
    const isAdmin = payload.role === "ADMIN";
    if (!isCustomer && !isCompanion && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const data: Record<string, unknown> = { status };
    if (status === "CANCELLED") {
      data.cancelledBy = payload.id;
      data.cancellationReason = cancellationReason || null;
      data.cancelledAt = new Date();
    }
    if (status === "COMPLETED") data.completedAt = new Date();

    const updated = await prisma.booking.update({ where: { id: params.id }, data });
    return NextResponse.json({ booking: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
