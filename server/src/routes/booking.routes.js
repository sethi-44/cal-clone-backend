const express = require("express");
const router = express.Router();
const controller = require("../controllers/booking.controller.js");

router.post("/", controller.createBooking);
router.get("/:eventTypeId", controller.getBookings);
router.delete("/:id", controller.cancelBooking);

module.exports = router;