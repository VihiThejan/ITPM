import { z } from "zod";

export const createRoommatePostSchema = z
  .object({
    title: z.string().trim().min(5).max(140),
    description: z.string().trim().min(20).max(1000),
    preferredLocation: z.string().trim().max(120).optional().default(""),
    budgetMin: z.number().min(0).optional().default(0),
    budgetMax: z.number().min(0).optional().default(0),
    contactPhone: z.string().trim().max(30).optional().default("")
  })
  .superRefine((input, ctx) => {
    if (input.budgetMax && input.budgetMin && input.budgetMax < input.budgetMin) {
      ctx.addIssue({
        code: "custom",
        path: ["budgetMax"],
        message: "budgetMax must be greater than or equal to budgetMin."
      });
    }
  });
