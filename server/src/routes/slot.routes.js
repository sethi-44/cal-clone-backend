const express = require("express");
const router = express.Router();
const controller = require("../controllers/slot.controller");

router.get("/:eventTypeId", controller.getSlots);

module.exports = router;