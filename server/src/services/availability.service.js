const prisma = require("../config/prisma");
const { AppError } = require("../middleware/errorHandler");

exports.setAvailability = async (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new AppError("Availability data must be a non-empty array", 400);
  }

  const eventTypeId = data[0].eventTypeId;

  // Validate all items have same eventTypeId
  for (const item of data) {
    if (item.eventTypeId !== eventTypeId) {
      throw new AppError(
        "All availability items must be for the same event type",
        400
      );
    }
    if (item.startTime >= item.endTime) {
      throw new AppError(
        `Start time (${item.startTime}) must be before end time (${item.endTime})`,
        400
      );
    }
  }

  // Verify event exists
  const event = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
  });
  if (!event) throw new AppError("Event type not found", 404);

  // Atomic replace: delete + insert in single transaction
  const result = await prisma.$transaction([
    prisma.availability.deleteMany({ where: { eventTypeId } }),
    prisma.availability.createMany({
      data: data.map((item) => ({
        eventTypeId: item.eventTypeId,
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        timezone: item.timezone,
      })),
    }),
  ]);

  return { deleted: result[0].count, created: result[1].count };
};

exports.getAvailability = async (eventTypeId) => {
  return prisma.availability.findMany({
    where: { eventTypeId },
    orderBy: { dayOfWeek: "asc" },
  });
};