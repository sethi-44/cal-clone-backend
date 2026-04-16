const express = require("express");
const router = express.Router();
const controller = require("../controllers/booking.controller");
const validate = require("../middleware/validate");
const {
  createBookingSchema,
} = require("../validators/booking.validator");

router.post("/", validate(createBookingSchema), controller.createBooking);
router.get("/", controller.getAllBookings);
router.get("/:eventTypeId", controller.getBookings);
router.delete("/:id", controller.cancelBooking);

module.exports = router;