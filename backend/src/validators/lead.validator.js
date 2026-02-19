import { z } from "zod";

export const leadSchema = z.object({
  website: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  countryCode: z.string().optional(),
  phone: z.string().optional(),
  comments: z.string().optional(),
});

export const bulkLeadSchema = z.object({
    leads: z.array(leadSchema).min(1)
})