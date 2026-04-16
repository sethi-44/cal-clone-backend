const express = require("express");
const router = express.Router();
const controller = require("../controllers/availability.controller");
const validate = require("../middleware/validate");
const {
  setAvailabilitySchema,
} = require("../validators/availability.validator");

router.post("/", validate(setAvailabilitySchema), controller.setAvailability);
router.get("/:eventTypeId", controller.getAvailability);

module.exports = router;