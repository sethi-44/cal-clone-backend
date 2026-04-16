const express = require("express");
const router = express.Router();
const controller = require("../controllers/booking.controller");
const validate = require("../middleware/validate");
const {
  createBookingSchema,
  rescheduleBookingSchema,
} = require("../validators/booking.validator");

router.post("/", validate(createBookingSchema), controller.createBooking);
router.get("/", controller.getAllBookings);
router.get("/:eventTypeId", controller.getBookings);
router.get("/id/:id", controller.getBookingById);
router.patch("/:id/reschedule", validate(rescheduleBookingSchema), controller.rescheduleBooking);
router.delete("/:id", controller.cancelBooking);

module.exports = router;