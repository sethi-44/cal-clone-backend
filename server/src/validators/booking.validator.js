const { z } = require("zod");

const createBookingSchema = z.object({
  eventTypeId: z.string().uuid(),
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address"),
  startTime: z.string().datetime({ message: "Invalid start time" }),
  endTime: z.string().datetime({ message: "Invalid end time" }),
});

module.exports = { createBookingSchema };
