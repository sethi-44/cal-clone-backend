const express = require("express");
const router = express.Router();
const controller = require("../controllers/event.controller");
const validate = require("../middleware/validate");
const {
  createEventSchema,
  updateEventSchema,
} = require("../validators/event.validator");

// Routes
router.post("/", validate(createEventSchema), controller.createEvent);
router.get("/", controller.getAllEvents);
router.get("/slug/:slug", controller.getEventBySlug);
router.get("/:id", controller.getEventById);
router.put("/:id", validate(updateEventSchema), controller.updateEvent);
router.delete("/:id", controller.deleteEvent);

module.exports = router;