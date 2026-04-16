const prisma = require("../config/prisma");
const { generateSlots } = require("../utils/slot.util");

exports.getSlots = async (req, res) => {
  try {
    const { eventTypeId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    const event = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
    });

    const availability = await prisma.availability.findMany({
      where: { eventTypeId },
    });

    if (!event || availability.length === 0) {
      return res.json([]);
    }

    // Get day of week
    const day = new Date(date).getDay();

    // Find matching availability
    const avail = availability.find(a => a.dayOfWeek === day);

    if (!avail) return res.json([]);

    // Generate all slots
    const slots = generateSlots(
      avail.startTime,
      avail.endTime,
      event.duration
    );

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

    // Convert booked times to "HH:mm"
    const bookedSlots = bookings.map(b =>
      new Date(b.startTime).toTimeString().slice(0, 5)
    );

    // Filter slots
    const availableSlots = slots.filter(
      slot => !bookedSlots.includes(slot.start)
    );

    res.json(availableSlots);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};