const service = require("../services/availability.service");

exports.setAvailability = async (req, res, next) => {
  try {
    const result = await service.setAvailability(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getAvailability = async (req, res, next) => {
  try {
    const data = await service.getAvailability(req.params.eventTypeId);
    res.json(data);
  } catch (err) {
    next(err);
  }
};