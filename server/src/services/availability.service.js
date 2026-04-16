const prisma = require("../config/prisma");

exports.setAvailability = async (data) => {
  if (!data || data.length === 0) {
    throw new Error("No availability provided");
  }

  const eventTypeId = data[0].eventTypeId;

  // 🧹 Step 1: delete old availability
  await prisma.availability.deleteMany({
    where: { eventTypeId },
  });

  // ✨ Step 2: insert new availability
  return prisma.availability.createMany({
    data,
  });
};