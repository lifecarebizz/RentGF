import { prisma } from "@/lib/db/prisma-client";


export class BookingService {
  async createBooking(data: {
    customerId: string;
    companionId: string;
    bookingDate: string;
    startTime: string;
    durationMinutes: number;
    activityType?: string;
    message?: string;
    discountCode?: string;
    price: number;
    finalPrice: number;
    discountAmount?: number;
    discountId?: string;
  }) {
    const companion = await prisma.companionProfile.findUnique({
      where: { userId: data.companionId },
    });
    if (!companion || !companion.isDiscoverable || companion.verificationStatus !== "APPROVED") {
      throw new Error("Companion not available for booking");
    }

    // Check availability
    if (companion.availabilityDays.length > 0) {
      const day = new Date(data.bookingDate).toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
      if (!companion.availabilityDays.includes(day)) {
        throw new Error("Companion is not available on this day");
      }
    }

    // Check for overlapping bookings
    const start = new Date(data.startTime);
    const end = new Date(start.getTime() + data.durationMinutes * 60000);

    const existingBooking = await prisma.booking.findFirst({
      where: {
        companionId: data.companionId,
        status: { notIn: ["CANCELLED", "COMPLETED", "REFUNDED", "REJECTED"] },
        OR: [
          { startTime: { lt: end }, endTime: { gt: start } },
          { startTime: { gte: start }, endTime: { lt: end } },
        ],
      },
    });

    if (existingBooking) {
      throw new Error("Companion is already booked during this time");
    }

    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          customerId: data.customerId,
          companionId: data.companionId,
          bookingDate: new Date(data.bookingDate),
          startTime: start,
          endTime: end,
          durationMinutes: data.durationMinutes,
          activityType: data.activityType,
          message: data.message,
          price: data.price,
          discountAmount: data.discountAmount || 0,
          finalPrice: data.finalPrice,
          discountId: data.discountId,
          status: "CONFIRMED",
          paymentStatus: "PENDING",
        },
      });

      await tx.notification.create({
        data: {
          userId: data.companionId,
          type: "BOOKING_REQUEST",
          title: "New Booking Request",
          message: `A customer has requested your services for ${data.bookingDate} at ${data.startTime}`,
          relatedId: booking.id,
          relatedType: "BOOKING",
        },
      });

      return booking;
    });
  }

  async acceptBooking(bookingId: string, companionId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("Booking not found");
    if (booking.companionId !== companionId) throw new Error("Unauthorized");
    if (booking.status !== "PENDING") throw new Error("Booking cannot be accepted in current status");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: { status: "ACCEPTED" },
      });

      await tx.notification.create({
        data: {
          userId: booking.customerId,
          type: "BOOKING_ACCEPTED",
          title: "Booking Accepted",
          message: "Your booking has been accepted by the companion",
          relatedId: bookingId,
          relatedType: "BOOKING",
        },
      });

      return updated;
    });
  }

  async rejectBooking(bookingId: string, companionId: string, reason?: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("Booking not found");
    if (booking.companionId !== companionId) throw new Error("Unauthorized");
    if (booking.status !== "PENDING") throw new Error("Booking cannot be rejected in current status");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: { status: "REJECTED", cancelledBy: companionId, cancellationReason: reason || "Companion declined" },
      });

      await tx.notification.create({
        data: {
          userId: booking.customerId,
          type: "BOOKING_REJECTED",
          title: "Booking Rejected",
          message: reason || "Your booking request was declined",
          relatedId: bookingId,
          relatedType: "BOOKING",
        },
      });

      return updated;
    });
  }

  async cancelBooking(bookingId: string, userId: string, reason?: string) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, companion: true },
    });
    if (!booking) throw new Error("Booking not found");
    if (booking.status !== "CONFIRMED") throw new Error("Booking cannot be cancelled");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: "CANCELLED",
          cancelledBy: userId,
          cancellationReason: reason || "Customer cancelled",
          cancelledAt: new Date(),
        },
      });

      await tx.notification.create({
        data: {
          userId: booking.companionId,
          type: "BOOKING_CANCELLED",
          title: "Booking Cancelled",
          message: `Booking cancelled. ${reason || "Customer cancelled"}`,
          relatedId: bookingId,
          relatedType: "BOOKING",
        },
      });

      await tx.notification.create({
        data: {
          userId: booking.customerId,
          type: "BOOKING_CANCELLED",
          title: "Booking Cancelled",
          message: `Your booking was cancelled. ${reason || "Customer cancelled"}`,
          relatedId: bookingId,
          relatedType: "BOOKING",
        },
      });

      return updated;
    });
  }

  async completeBooking(bookingId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("Booking not found");
    if (booking.status !== "CONFIRMED") throw new Error("Booking cannot be completed");

    return prisma.$transaction(async (tx) => {
      const updated = await tx.booking.update({
        where: { id: bookingId },
        data: { status: "COMPLETED", completedAt: new Date() },
      });

      await tx.notification.create({
        data: {
          userId: booking.customerId,
          type: "BOOKING_COMPLETED",
          title: "Booking Completed",
          message: "Your booking has been completed",
          relatedId: bookingId,
          relatedType: "BOOKING",
        },
      });

      await tx.notification.create({
        data: {
          userId: booking.companionId,
          type: "BOOKING_COMPLETED",
          title: "Booking Completed",
          message: "The booking has been completed",
          relatedId: bookingId,
          relatedType: "BOOKING",
        },
      });

      return updated;
    });
  }

  async getBookings(userId: string, role: string, params: { page: number; limit: number; status?: string }) {
    const skip = (params.page - 1) * params.limit;
    const where: any = {};

    if (role === "CUSTOMER") where.customerId = userId;
    else if (role === "COMPANION") where.companionId = userId;

    if (params.status) where.status = params.status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({ where, skip, take: params.limit, orderBy: { createdAt: "desc" }, include: { customer: true, companion: true } }),
      prisma.booking.count({ where }),
    ]);

    return { bookings, total, page: params.page, totalPages: Math.ceil(total / params.limit) };
  }

  async getBooking(bookingId: string, userId: string) {
    return prisma.booking.findFirst({
      where: { id: bookingId, OR: [{ customerId: userId }, { companionId: userId }] },
      include: { customer: true, companion: true },
    });
  }

  async getBookingsByCompanionId(companionId: string, status?: string) {
    const where: any = { companionId };
    if (status) where.status = status;
    return prisma.booking.findMany({ where, orderBy: { createdAt: "desc" } });
  }
}

export const bookingService = new BookingService();
