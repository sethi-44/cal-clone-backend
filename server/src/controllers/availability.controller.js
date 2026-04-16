const service = require("../services/availability.service");

exports.setAvailability = async (req, res) => {
  try {
    const result = await service.setAvailability(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const data = await service.getAvailability(req.params.eventTypeId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};