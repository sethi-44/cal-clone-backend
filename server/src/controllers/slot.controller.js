const prisma = require("../config/prisma");
const { generateSlots } = require("../utils/slot.util");

exports.getSlots = async (req, res) => {
  try {
    const { eventTypeId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    // console.log("\n====================");
    // console.log("📅 Requested Date:", date);
    // console.log("🎯 EventTypeId:", eventTypeId);

    const event = await prisma.eventType.findUnique({
      where: { id: eventTypeId },
    });

    const availability = await prisma.availability.findMany({
      where: { eventTypeId },
    });

    if (!event || availability.length === 0) {
      // console.log("❌ No event or availability found");
      return res.json([]);
    }

    // Get day of week
    const day = new Date(date).getDay();
    // console.log("📆 Day of week:", day);

    // Find matching availability
    const avail = availability.find(a => a.dayOfWeek === day);

    if (!avail) {
      // console.log("❌ No availability for this day");
      return res.json([]);
    }

    // console.log("🟢 Availability:", avail.startTime, "-", avail.endTime);

    // Generate slots
    const slots = generateSlots(
      avail.startTime,
      avail.endTime,
      event.duration
    );

    // console.log("🧩 Generated Slots:", slots);

    // Day range (IMPORTANT: keep consistent)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // console.log("⏱️ Range:", startOfDay, "→", endOfDay);

    // Fetch bookings
    const bookings = await prisma.booking.findMany({
      where: {
        eventTypeId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // console.log("📦 Raw Bookings:", bookings);

    // 🔥 CORRECT timezone conversion (IST)
    const bookedSlots = bookings.map(b => {
      const formatted = new Date(b.startTime).toLocaleTimeString("en-GB", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      // console.log(
      //   "🔁 Booking UTC:",
      //   b.startTime,
      //   "→ IST:",
      //   formatted
      // );

      return formatted;
    });

    // console.log("🚫 BookedSlots (IST):", bookedSlots);

    // Mark availability
    const finalSlots = slots.map(slot => {
      const isBooked = bookedSlots.includes(slot.start);

      return {
        start: slot.start,
        available: !isBooked,
      };
    });

    // console.log("✅ FinalSlots:", finalSlots);
    // console.log("====================\n");

    res.json(finalSlots);

  } catch (err) {
    console.error("💥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};