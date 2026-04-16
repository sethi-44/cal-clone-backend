const service = require("../services/booking.service");

exports.createBooking = async (req, res) => {
  try {
    const booking = await service.createBooking(req.body);
    res.json(booking);
  } catch (err) {
    // 🔥 Correct status code
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const data = await service.getBookingsByEvent(
      req.params.eventTypeId
    );
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};