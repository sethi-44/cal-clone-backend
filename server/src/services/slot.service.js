const prisma = require("../config/prisma");

function generateSlots(startTime, endTime, duration) {
  const slots = [];

  let [startH, startM] = startTime.split(":").map(Number);
  let [endH, endM] = endTime.split(":").map(Number);

  let current = startH * 60 + startM;
  const end = endH * 60 + endM;

  while (current + duration <= end) {
    const h = Math.floor(current / 60);
    const m = current % 60;

    const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    slots.push(formatted);
    current += duration;
  }

  return slots;
}

exports.getSlots = async (eventTypeId, date) => {
  const event = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
  });

  const availability = await prisma.availability.findMany({
    where: { eventTypeId },
  });

  const day = new Date(date).getDay();

  const dayAvailability = availability.filter(
    (a) => a.dayOfWeek === day
  );

  if (!dayAvailability.length) return [];

  const allSlots = [];

  dayAvailability.forEach((a) => {
    const slots = generateSlots(
      a.startTime,
      a.endTime,
      event.duration
    );

    allSlots.push(...slots);
  });

  // Get bookings for that date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const bookings = await prisma.booking.findMany({
    where: {
      eventTypeId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const bookedTimes = bookings.map((b) => {
    const d = new Date(b.startTime);
    return `${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  });

  // 🔥 final clean response
  return allSlots.map((slot) => ({
    start: slot,
    available: !bookedTimes.includes(slot),
  }));
};