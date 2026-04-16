const express = require("express");
const router = express.Router();
const controller = require("../controllers/availability.controller");

router.post("/", controller.setAvailability);
router.get("/:eventTypeId", controller.getAvailability);

module.exports = router;