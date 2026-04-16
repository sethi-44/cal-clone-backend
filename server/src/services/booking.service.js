const prisma = require("../config/prisma");
const { AppError } = require("../middleware/errorHandler");

exports.createBooking = async (data) => {
  const { eventTypeId, name, email, startTime, endTime } = data;

  const start = new Date(startTime);
  start.setSeconds(0, 0);
  const end = new Date(endTime);
  end.setSeconds(0, 0);

  // Validation: Event exists
  const event = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
  });
  if (!event) throw new AppError("Event type not found", 404);

  // Validation: Not in the past
  if (start <= new Date()) {
    throw new AppError("Cannot book a slot in the past", 400);
  }

  // Validation: Duration matches event
  const durationMs = end.getTime() - start.getTime();
  const expectedMs = event.duration * 60 * 1000;
  if (Math.abs(durationMs - expectedMs) > 60000) {
    throw new AppError("Booking duration does not match event type", 400);
  }

  try {
    return await prisma.booking.create({
      data: {
        eventTypeId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        startTime: start,
        endTime: end,
      },
    });
  } catch (err) {
    if (err.code === "P2002") {
      throw new AppError("This time slot has already been booked", 409);
    }
    throw err;
  }
};

exports.getAllBookings = async () => {
  return prisma.booking.findMany({
    where: { status: "CONFIRMED" },
    include: {
      eventType: {
        select: { title: true, slug: true, duration: true },
      },
    },
    orderBy: { startTime: "asc" },
  });
};

exports.getBookingsByEventType = async (eventTypeId) => {
  return prisma.booking.findMany({
    where: { eventTypeId },
    include: {
      eventType: {
        select: { title: true, slug: true, duration: true },
      },
    },
    orderBy: { startTime: "asc" },
  });
};

exports.cancelBooking = async (id) => {
  try {
    return await prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });
  } catch (err) {
    if (err.code === "P2025") {
      throw new AppError("Booking not found", 404);
    }
    throw err;
  }
};