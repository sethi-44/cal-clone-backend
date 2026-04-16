const express = require("express");
const router = express.Router();
const controller = require("../controllers/booking.controller");

router.post("/", controller.createBooking);
router.get("/:eventTypeId", controller.getBookings);

module.exports = router;