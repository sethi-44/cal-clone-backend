const prisma = require("../config/prisma");
const { AppError } = require("../middleware/errorHandler");

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

exports.createEvent = async (data) => {
  // Auto-generate slug if not provided
  if (!data.slug) {
    data.slug = slugify(data.title);
  }

  // Handle slug collision
  let slug = data.slug;
  let attempt = 0;
  while (true) {
    const candidate = attempt === 0 ? slug : `${slug}-${attempt}`;
    const existing = await prisma.eventType.findUnique({
      where: { slug: candidate },
    });
    if (!existing) {
      data.slug = candidate;
      break;
    }
    attempt++;
    if (attempt > 20) throw new AppError("Cannot generate unique slug", 409);
  }

  return prisma.eventType.create({ data });
};

exports.getAllEvents = async () => {
  return prisma.eventType.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { bookings: true } },
    },
  });
};

exports.getEventById = async (id) => {
  return prisma.eventType.findUnique({
    where: { id },
  });
};

exports.getEventBySlug = async (slug) => {
  return prisma.eventType.findUnique({
    where: { slug },
  });
};

exports.updateEvent = async (id, data) => {
  try {
    return await prisma.eventType.update({
      where: { id },
      data,
    });
  } catch (err) {
    if (err.code === "P2002") {
      throw new AppError(`Slug "${data.slug}" is already in use`, 409);
    }
    if (err.code === "P2025") {
      throw new AppError("Event not found", 404);
    }
    throw err;
  }
};

exports.deleteEvent = async (id) => {
  // Check for future confirmed bookings
  const futureBookings = await prisma.booking.count({
    where: {
      eventTypeId: id,
      startTime: { gte: new Date() },
      status: "CONFIRMED",
    },
  });

  if (futureBookings > 0) {
    throw new AppError(
      `Cannot delete: ${futureBookings} upcoming booking(s) exist. Cancel them first.`,
      400
    );
  }

  try {
    return await prisma.eventType.delete({ where: { id } });
  } catch (err) {
    if (err.code === "P2025") {
      throw new AppError("Event not found", 404);
    }
    throw err;
  }
};