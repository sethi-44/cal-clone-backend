const express = require("express");
const router = express.Router();
const controller = require("../controllers/event.controller.js");

// Validate :id param
router.param("id", (req, res, next, id) => {
  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID" });
  }
  next();
});

// Routes
router.post("/", controller.createEvent);
router.get("/", controller.getAllEvents);
router.get("/:id", controller.getEventById);
router.put("/:id", controller.updateEvent);
router.delete("/:id", controller.deleteEvent);

module.exports = router;