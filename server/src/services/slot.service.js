const prisma = require("../config/prisma");
const { generateSlots } = require("../utils/slot.util");

/**
 * Get available slots for an event type on a specific date.
 */
exports.getAvailableSlots = async (eventTypeId, dateStr) => {
  const event = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
  });
  if (!event) return [];

  const availability = await prisma.availability.findMany({
    where: { eventTypeId },
  });
  if (!availability.length) return [];

  // Determine the timezone from availability records
  const hostTimezone = availability[0].timezone || "UTC";

  // Calculate day of week in the host's timezone
  const date = new Date(dateStr + "T12:00:00Z");
  const dayName = date.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: hostTimezone,
  });
  const dayMap = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  const dayOfWeek = dayMap[dayName];

  const dayAvail = availability.filter((a) => a.dayOfWeek === dayOfWeek);
  if (!dayAvail.length) return [];

  // Generate all possible slots (with buffer time)
  const allSlots = dayAvail.flatMap((a) =>
    generateSlots(a.startTime, a.endTime, event.duration, event.bufferTime || 0)
  );

  // Get existing bookings for the date
  const startOfDay = new Date(dateStr + "T00:00:00Z");
  const endOfDay = new Date(dateStr + "T23:59:59.999Z");

  const bookings = await prisma.booking.findMany({
    where: {
      eventTypeId,
      status: "CONFIRMED",
      startTime: { gte: startOfDay, lte: endOfDay },
    },
  });

  // Convert booked start times to HH:MM in host timezone
  const bookedSlots = bookings.map((b) => {
    return new Date(b.startTime).toLocaleTimeString("en-GB", {
      timeZone: hostTimezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  });

  // Filter past slots if date is today
  const now = new Date();
  const todayStr = now.toLocaleDateString("en-CA", { timeZone: hostTimezone });
  const isPastFilter = dateStr === todayStr;
  let currentTimeStr = "";
  if (isPastFilter) {
    currentTimeStr = now.toLocaleTimeString("en-GB", {
      timeZone: hostTimezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // Mark availability and filter past slots
  return allSlots
    .filter((slot) => {
      if (isPastFilter && slot.start <= currentTimeStr) return false;
      return true;
    })
    .map((slot) => ({
      start: slot.start,
      end: slot.end,
      available: !bookedSlots.includes(slot.start),
    }));
};