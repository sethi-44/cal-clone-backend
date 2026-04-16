const prisma = require("../config/prisma");

exports.createEvent = async (data) => {
  return prisma.eventType.create({
    data,
  });
};

exports.getAllEvents = async () => {
  return prisma.eventType.findMany({
    orderBy: { createdAt: "desc" },
  });
};

exports.getEventById = async (id) => {
  return prisma.eventType.findUnique({
    where: { id },
  });
};

exports.updateEvent = async (id, data) => {
  return prisma.eventType.update({
    where: { id },
    data,
  });
};

exports.deleteEvent = async (id) => {
  return prisma.eventType.delete({
    where: { id },
  });
};