const eventService = require("../services/event.service");

exports.createEvent = async (req, res, next) => {
  try {
    const event = await eventService.createEvent(req.body);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
};

exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAllEvents();
    res.json(events);
  } catch (err) {
    next(err);
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    next(err);
  }
};

exports.getEventBySlug = async (req, res, next) => {
  try {
    const event = await eventService.getEventBySlug(req.params.slug);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await eventService.updateEvent(req.params.id, req.body);
    res.json(event);
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    await eventService.deleteEvent(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
};