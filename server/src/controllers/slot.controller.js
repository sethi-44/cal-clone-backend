const slotService = require("../services/slot.service");

exports.getSlots = async (req, res, next) => {
  try {
    const { eventTypeId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date query parameter is required" });
    }

    const slots = await slotService.getAvailableSlots(eventTypeId, date);
    res.json(slots);
  } catch (err) {
    next(err);
  }
};