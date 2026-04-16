const prisma = require("../config/prisma");

exports.setAvailability = async (data) => {
  return prisma.availability.createMany({
    data,
  });
};

exports.getAvailability = async (eventTypeId) => {
  return prisma.availability.findMany({
    where: { eventTypeId },
  });
};