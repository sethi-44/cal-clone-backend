const express = require("express");
const router = express.Router();
const controller = require("../controllers/event.controller");

router.post("/", controller.createEvent);
router.get("/", controller.getAllEvents);
router.get("/:id", controller.getEventById);
router.put("/:id", controller.updateEvent);
router.delete("/:id", controller.deleteEvent);

module.exports = router;