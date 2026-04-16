const { z } = require("zod");

const setAvailabilitySchema = z
  .array(
    z.object({
      eventTypeId: z.string().uuid(),
      dayOfWeek: z.number().int().min(0).max(6),
      startTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Must be HH:MM format"),
      endTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Must be HH:MM format"),
      timezone: z.string().min(1, "Timezone is required"),
    })
  )
  .min(1, "At least one availability entry is required");

module.exports = { setAvailabilitySchema };
