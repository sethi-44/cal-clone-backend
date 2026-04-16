const prisma = require("../config/prisma");

exports.createBooking = async (data) => {
  try {
    const start = new Date(data.startTime);

    // 🔥 normalize completely
    start.setSeconds(0, 0);

    const end = new Date(data.endTime);
    end.setSeconds(0, 0);

    return await prisma.booking.create({
      data: {
        eventTypeId: data.eventTypeId,
        name: data.name,
        email: data.email,
        startTime: start,
        endTime: end,
      },
    });

  } catch (err) {
    if (err.code === "P2002") {
      throw new Error("Slot already booked");
    }
    throw err;
  }
};