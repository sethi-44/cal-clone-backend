const { z } = require("zod");

const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional().default(""),
  duration: z.number({ coerce: true }).int().min(5, "Min 5 minutes").max(480),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes"),
  bufferTime: z.number({ coerce: true }).int().min(0).max(60).optional().default(0),
});

const updateEventSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  duration: z.number({ coerce: true }).int().min(5).max(480).optional(),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes")
    .optional(),
  bufferTime: z.number({ coerce: true }).int().min(0).max(60).optional(),
});

module.exports = { createEventSchema, updateEventSchema };
