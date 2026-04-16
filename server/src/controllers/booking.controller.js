const service = require("../services/booking.service");

exports.createBooking = async (req, res, next) => {
  try {
    const booking = await service.createBooking(req.body);
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await service.getAllBookings();
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await service.getBookingsByEventType(req.params.eventTypeId);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    await service.cancelBooking(req.params.id);
    res.json({ message: "Booking cancelled" });
  } catch (err) {
    next(err);
  }
};