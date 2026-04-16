const service = require("../services/booking.service");
const prisma = require("../config/prisma");

exports.createBooking = async (req, res) => {
  try {
    const booking = await service.createBooking(req.body);
    res.json(booking);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { eventTypeId } = req.params;

    if (!eventTypeId) {
      return res.status(400).json({
        error: "eventTypeId is required",
      });
    }

    console.log("Fetching bookings for:", eventTypeId);

    const bookings = await prisma.booking.findMany({
      where: {
        eventTypeId: String(eventTypeId), 
      },
      orderBy: { startTime: "asc" },
    });

    console.log("Bookings found:", bookings);

    res.json(bookings);
  } catch (err) {
    console.error("🔥 GET BOOKINGS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;


    if (!id) {
      return res.status(400).json({
        error: "Booking id is required",
      });
    }

    await prisma.booking.delete({
      where: { id: String(id) },
    });

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    console.error("🔥 CANCEL BOOKING ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};